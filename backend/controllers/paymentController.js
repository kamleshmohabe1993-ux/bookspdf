const { phonePeV2Client } = require('../config/phonepe');
const crypto = require('crypto');
const Purchase = require('../models/Purchase');
const Book = require('../models/Book');
const Payment = require('../models/Payment');

const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORDER${timestamp}${random}`;
};


exports.initiatePayment = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        // Validate book
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ 
                success: false, 
                message: 'Book not found' 
            });
        }

        if (!book.isPaid) {
            return res.status(400).json({
                success: false,
                error: 'This book is free to download'
            });
        }

        // Check existing purchase
        const existingPurchase = await Payment.findOne({
            userId,
            bookId,
            status: 'SUCCESS'
        });

        if (existingPurchase) {
            return res.status(400).json({ 
                success: false, 
                message: 'You have already purchased this book',
                data: {
                    downloadToken: existingPurchase.downloadToken,
                    transactionId: existingPurchase.merchantOrderId
                } 
            });
        }

        // const user = await user.findById(userId);
        const merchantOrderId = generateOrderId();
        const amountInPaise = Math.round(book.price * 100);

        // Create payment record
        const payment = new Payment({
            userId,
            bookId,
            merchantOrderId,
            amount: amountInPaise,
            status: 'INITIATED',
            userMobile: req.user.mobileNumber,
            userEmail: req.user.email
        });

        await payment.save();

        // V2 Payment Data
        const paymentData = {
            merchantOrderId: merchantOrderId,
            amount: amountInPaise,
            redirectUrl: `${process.env.FRONTEND_URL}/payment/callback?orderId=${merchantOrderId}`,
            message: `Payment for ${book.title}`,
            expireAfter: 1800, // 30 minutes
            metaInfo: {
                udf1: userId.toString(),
                udf2: bookId.toString(),
                udf3: book.title
            }
        };

        // Create payment with PhonePe V2
        const phonePeResponse = await phonePeV2Client.createPayment(paymentData);

        if (!phonePeResponse.success) {
            payment.status = 'FAILED';
            payment.errorMessage = 'Payment creation failed';
            await payment.save();

            return res.status(400).json({
                success: false,
                message: 'Failed to initiate payment'
            });
        }

        // Update payment record
        payment.phonePeOrderId = phonePeResponse.orderId;
        payment.status = 'PENDING';
        payment.paymentState = phonePeResponse.state;
        payment.expireAt = new Date(phonePeResponse.expireAt);
        payment.redirectUrl = phonePeResponse.redirectUrl;
        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment initiated successfully',
            data: {
                paymentUrl: phonePeResponse.redirectUrl,
                merchantOrderId,
                orderId: phonePeResponse.orderId,
                amount: book.price,
                bookTitle: book.title,
                expireAt: phonePeResponse.expireAt
            }
        });

    } catch (error) {
        console.error('❌ Payment initiation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate payment',
            error: error.message
        });
    }
};

/**
 * Verify Payment - V2
 * GET /api/payments/v2/verify/:merchantOrderId
 */
exports.verifyPayment = async (req, res) => {
    try {
        const { merchantOrderId } = req.params;
        const userId = req.user.id;

        // Find payment record
        const payment = await Payment.findOne({
            merchantOrderId,
            userId
        }).populate('bookId', 'title price downloadUrl');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // If already successful
        if (payment.status === 'SUCCESS') {
            return res.status(200).json({
                success: true,
                message: 'Payment already verified',
                data: {
                    status: 'SUCCESS',
                    merchantOrderId: payment.merchantOrderId,
                    amount: payment.amount / 100,
                    book: payment.book,
                    completedAt: payment.completedAt
                }
            });
        }

        // Check with PhonePe V2
        const phonePeStatus = await phonePeV2Client.checkOrderStatus(merchantOrderId);

        // Update payment
        payment.paymentState = phonePeStatus.state;
        payment.paymentInstrument = phonePeStatus.paymentInstrument;

        if (phonePeStatus.paymentStatus === 'SUCCESS') {
            payment.status = 'SUCCESS';
            payment.completedAt = new Date();

            // Add book to user's library
            await User.findByIdAndUpdate(userId, {
                $addToSet: { purchasedBooks: payment.book }
            });

        } else if (phonePeStatus.paymentStatus === 'FAILED') {
            payment.status = 'FAILED';
        }

        await payment.save();

        res.status(200).json({
            success: true,
            message: 'Payment status retrieved',
            data: {
                status: payment.status,
                merchantOrderId: payment.merchantOrderId,
                orderId: payment.phonePeOrderId,
                amount: payment.amount / 100,
                paymentInstrument: payment.paymentInstrument,
                book: payment.book,
                completedAt: payment.completedAt
            }
        });

    } catch (error) {
        console.error('❌ Payment verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment',
            error: error.message
        });
    }
};

/**
 * Get Payment History
 * GET /api/payments/v2/history
 */
exports.getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, status } = req.query;

        const query = { userId };
        if (status) {
            query.status = status.toUpperCase();
        }

        const payments = await Payment.find(query)
            .populate('bookId', 'title coverImage price')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Payment.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                payments,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                total: count
            }
        });

    } catch (error) {
        console.error('❌ Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment history',
            error: error.message
        });
    }
};

/**
 * Initiate Refund - V2
 * POST /api/payments/v2/refund/:merchantOrderId
 */
exports.initiateRefund = async (req, res) => {
    try {
        const { merchantOrderId } = req.params;
        const { reason } = req.body;
        const userId = req.user.id;

        const payment = await Payment.findOne({
            merchantOrderId,
            userId
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status !== 'SUCCESS') {
            return res.status(400).json({
                success: false,
                message: 'Only successful payments can be refunded'
            });
        }

        if (payment.status === 'REFUNDED') {
            return res.status(400).json({
                success: false,
                message: 'Payment already refunded'
            });
        }

        // Check 7-day refund policy
        const daysSince = Math.floor(
            (Date.now() - payment.completedAt) / (1000 * 60 * 60 * 24)
        );

        if (daysSince > 7) {
            return res.status(400).json({
                success: false,
                message: 'Refund period has expired (7 days)'
            });
        }

        const merchantRefundId = `REFUND${Date.now()}`;

        const refundData = {
            merchantRefundId,
            originalOrderId: payment.phonePeOrderId,
            amount: payment.amount,
            reason: reason || 'Customer requested refund'
        };

        const refundResponse = await phonePeV2Client.initiateRefund(refundData);

        if (refundResponse.success) {
            payment.status = 'REFUNDED';
            payment.refundId = refundResponse.refundId;
            payment.refundAmount = payment.amount;
            payment.refundReason = reason;
            payment.refundedAt = new Date();

            await User.findByIdAndUpdate(userId, {
                $pull: { purchasedBooks: payment.bookId }
            });

            await payment.save();

            res.status(200).json({
                success: true,
                message: 'Refund initiated successfully',
                data: {
                    refundId: refundResponse.refundId,
                    merchantRefundId,
                    amount: payment.amount / 100
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Refund initiation failed'
            });
        }

    } catch (error) {
        console.error('❌ Refund error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate refund',
            error: error.message
        });
    }
};

// @route   POST /api/payments/callback
// @desc    PhonePe payment callback webhook
exports.paymentCallback = async (req, res) => {
    try {
        console.log('📥 Payment Callback Received');
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);

        const { response } = req.body;
        const xVerifyHeader = req.headers['x-verify'];

        if (!response) {
            console.error('❌ No response in callback');
            return res.status(400).json({
                success: false,
                error: 'Invalid callback data'
            });
        }

        // Verify webhook using SDK
        const verification = phonePeV2Client.verifyWebhook(response, xVerifyHeader);

        if (!verification.valid) {
            console.error('❌ Webhook verification failed:', verification.error);
            return res.status(400).json({
                success: false,
                error: verification.error
            });
        }

        console.log('✅ Webhook verified successfully');

        const decodedData = verification.data.data;
        const { transactionId, code } = decodedData;

        // Find purchase
        const purchase = await Payment.findOne({ transactionId });

        if (!purchase) {
            console.error('❌ Purchase not found:', transactionId);
            return res.status(404).json({
                success: false,
                error: 'Purchase not found'
            });
        }

        // Handle payment status
        if (code === 'PAYMENT_SUCCESS') {
            console.log('✅ Payment Successful:', transactionId);

            // Generate download token
            const downloadToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

            // Update purchase
            purchase.paymentStatus = 'COMPLETED';
            purchase.downloadToken = downloadToken;
            purchase.downloadExpiresAt = expiresAt;
            purchase.phonepeResponse = verification.data;
            await purchase.save();

            // Increment book download count
            await Book.findByIdAndUpdate(purchase.book, {
                $inc: { downloadCount: 1 }
            });

            console.log('✅ Purchase updated successfully');

            return res.json({
                success: true,
                message: 'Payment successful',
                data: {
                    transactionId,
                    downloadToken
                }
            });
        } else {
            console.log('❌ Payment Failed:', code);

            // Update purchase as failed
            purchase.paymentStatus = 'FAILED';
            purchase.phonepeResponse = verification.data;
            await purchase.save();

            return res.json({
                success: false,
                message: 'Payment failed',
                code
            });
        }

    } catch (error) {
        console.error('❌ Callback processing error:', error);
        res.status(500).json({
            success: false,
            error: 'Callback processing failed: ' + error.message
        });
    }
};

// @route   GET /api/payments/status/:transactionId
// @desc    Check payment status
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;

        console.log('🔍 Checking payment status:', transactionId);

        // Find purchase in database
        const purchase = await Purchase.findOne({ transactionId })
            .populate('book', 'title thumbnail price');

        if (!purchase) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Verify ownership
        if (purchase.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized access'
            });
        }

        // Check status from PhonePe
        try {
            const statusResponse = await phonePeClient.checkStatus(transactionId);

            console.log('📊 Status from PhonePe:', statusResponse);

            // Update local database if status changed
            if (statusResponse.success && statusResponse.data.state === 'COMPLETED') {
                if (purchase.paymentStatus !== 'COMPLETED') {
                    const downloadToken = crypto.randomBytes(32).toString('hex');
                    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                    purchase.paymentStatus = 'COMPLETED';
                    purchase.downloadToken = downloadToken;
                    purchase.downloadExpiresAt = expiresAt;
                    await purchase.save();

                    console.log('✅ Status updated to COMPLETED');
                }
            }
        } catch (statusError) {
            console.warn('⚠️  Status check failed, using DB status:', statusError.message);
        }

        res.json({
            success: true,
            data: {
                transactionId: purchase.transactionId,
                paymentStatus: purchase.paymentStatus,
                amount: purchase.amount,
                book: purchase.book,
                downloadToken: purchase.downloadToken,
                downloadExpiresAt: purchase.downloadExpiresAt,
                downloadCount: purchase.downloadCount,
                maxDownloads: purchase.maxDownloads
            }
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   POST /api/payments/refund
// @desc    Initiate refund
exports.initiateRefund = async (req, res) => {
    try {
        const { transactionId } = req.body;

        // Find purchase
        const purchase = await Purchase.findOne({ transactionId })
            .populate('book');

        if (!purchase) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Verify admin or owner
        if (!req.user.isAdmin && purchase.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Validate refund eligibility
        if (purchase.paymentStatus === 'REFUNDED') {
            return res.status(400).json({
                success: false,
                error: 'Already refunded'
            });
        }

        if (purchase.paymentStatus !== 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'Cannot refund incomplete payment'
            });
        }

        const refundTransactionId = `REFUND${Date.now()}${Math.random().toString(36).substr(2, 6)}`;
        const amount = Math.round(purchase.amount * 100); // in paise

        console.log('💸 Initiating refund:', {
            originalTxn: transactionId,
            refundTxn: refundTransactionId,
            amount
        });

        // Prepare refund data
        const refundData = {
            userId: `USER${purchase.user}`,
            originalTransactionId: transactionId,
            refundTransactionId,
            amount,
            callbackUrl: process.env.PHONEPE_CALLBACK_URL
        };

        // Initiate refund
        const refundResponse = await phonePeClient.initiateRefund(refundData);

        if (refundResponse.success) {
            console.log('✅ Refund initiated successfully');

            // Update purchase status
            purchase.paymentStatus = 'REFUNDED';
            purchase.refundTransactionId = refundTransactionId;
            purchase.refundedAt = new Date();
            await purchase.save();

            return res.json({
                success: true,
                message: 'Refund initiated successfully',
                data: {
                    refundTransactionId,
                    amount: purchase.amount,
                    status: refundResponse.data.state
                }
            });
        } else {
            console.error('❌ Refund failed:', refundResponse);
            
            return res.status(400).json({
                success: false,
                error: refundResponse.message || 'Refund initiation failed'
            });
        }

    } catch (error) {
        console.error('Refund error:', error);
        res.status(500).json({
            success: false,
            error: 'Refund failed: ' + error.message
        });
    }
};

// @route   GET /api/payments/download/:token
// @desc    Get secure download link
exports.getDownloadLink = async (req, res) => {
    try {
        const { token } = req.params;

        const purchase = await Purchase.findOne({ downloadToken: token })
            .populate('book');

        if (!purchase) {
            return res.status(404).json({
                success: false,
                error: 'Invalid download token'
            });
        }

        // Check expiry
        if (new Date() > purchase.downloadExpiresAt) {
            return res.status(403).json({
                success: false,
                error: 'Download link has expired. Please contact support.'
            });
        }

        // Check download limit
        if (purchase.downloadCount >= purchase.maxDownloads) {
            return res.status(403).json({
                success: false,
                error: `Download limit (${purchase.maxDownloads}) exceeded.`
            });
        }

        // Increment download count
        purchase.downloadCount += 1;
        await purchase.save();

        res.json({
            success: true,
            data: {
                downloadUrl: purchase.book.pdfDownloadLink,
                filename: `${purchase.book.title}.pdf`,
                remainingDownloads: purchase.maxDownloads - purchase.downloadCount,
                expiresAt: purchase.downloadExpiresAt
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   POST /api/payments/free-download/:bookId
// @desc    Handle free book download
exports.freeDownload = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user._id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        if (book.isPaid) {
            return res.status(400).json({
                success: false,
                error: 'This book requires payment'
            });
        }

        // Check if already downloaded
        const existingDownload = await Purchase.findOne({
            user: userId,
            book: bookId
        });

        if (existingDownload) {
            return res.json({
                success: true,
                data: {
                    downloadUrl: book.pdfDownloadLink,
                    filename: `${book.title}.pdf`,
                    downloadToken: existingDownload.downloadToken
                }
            });
        }

        // Create free download record - FIXED: Use correct enum value
        const transactionId = `FREE${Date.now()}${userId.toString().slice(-6)}`;
        const downloadToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

        await Purchase.create({
            user: userId,
            book: bookId,
            transactionId,
            amount: 0,
            paymentStatus: 'COMPLETED',
            paymentGateway: 'Free', // Changed from 'free' to match enum
            downloadToken,
            downloadExpiresAt: expiresAt,
            maxDownloads: 100
        });

        // Increment download count
        await Book.findByIdAndUpdate(bookId, {
            $inc: { downloadCount: 1 }
        });

        res.json({
            success: true,
            data: {
                downloadUrl: book.pdfDownloadLink,
                filename: `${book.title}.pdf`,
                downloadToken
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   GET /api/payments/my-purchases
// @desc    Get user's purchase history
exports.getMyPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find({
            user: req.user._id,
            paymentStatus: 'COMPLETED'
        })
            .populate('book', 'title author thumbnail price isPaid')
            .sort({ purchasedAt: -1 });

        res.json({
            success: true,
            count: purchases.length,
            data: purchases
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// @route   GET /api/payments/admin/transactions
// @desc    Get all transactions (Admin only)
// @access  Private (Admin)
exports.getAllTransactions = async (req, res) => {
    try {
        // Verify admin access
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        // Get query parameters for filtering (optional - for future backend filtering)
        const { status, page = 1, limit = 100, search } = req.query;

        // Build query
        let query = {};

        // Filter by status if provided
        if (status && status !== 'all') {
            query.status = status;
        }

        // Search functionality (optional)
        if (search) {
            // This would require text indexes on the Purchase model
            query.$or = [
                { phonePeOrderId: { $regex: search, $options: 'i' } }
            ];
        }

        // Fetch all transactions with populated user and book details
        const transactions = await Payment.find(query)
            .populate('user', 'fullName email mobileNumber') // Populate user details
            .populate('book', 'title author thumbnail price category') // Populate book details
            .sort({ purchasedAt: -1 }) // Sort by most recent first
            .lean(); // Convert to plain JavaScript objects for better performance

        // Calculate statistics
        const stats = {
            total: transactions.length,
            completed: transactions.filter(t => t.status === 'COMPLETED').length,
            pending: transactions.filter(t => t.status === 'PENDING').length,
            failed: transactions.filter(t => t.status === 'FAILED').length,
            refunded: transactions.filter(t => t.status === 'REFUNDED').length,
            totalRevenue: transactions
                .filter(t => t.paymentStatus === 'COMPLETED')
                .reduce((sum, t) => sum + (t.amount || 0), 0)
        };

        res.json({
            success: true,
            count: transactions.length,
            stats,
            data: transactions
        });

    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transactions: ' + error.message
        });
    }
};

// @route   GET /api/payments/admin/transactions/:id
// @desc    Get single transaction details (Admin only)
// @access  Private (Admin)
exports.getTransactionById = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        const transaction = await Payment.findById(req.params.id)
            .populate('user', 'fullName email mobileNumber')
            .populate('book', 'title author thumbnail price category');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            data: transaction
        });

    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   GET /api/payments/admin/stats
// @desc    Get transaction statistics (Admin only)
// @access  Private (Admin)
exports.getTransactionStats = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const { startDate, endDate } = req.query;

        // Build date filter if provided
        let dateFilter = {};
        if (startDate || endDate) {
            dateFilter.purchasedAt = {};
            if (startDate) dateFilter.purchasedAt.$gte = new Date(startDate);
            if (endDate) dateFilter.purchasedAt.$lte = new Date(endDate);
        }

        // Get all transactions
        const transactions = await Payment.find(dateFilter);

        // Calculate detailed statistics
        const stats = {
            overview: {
                total: transactions.length,
                completed: transactions.filter(t => t.status === 'COMPLETED').length,
                pending: transactions.filter(t => t.status === 'PENDING').length,
                failed: transactions.filter(t => t.status === 'FAILED').length,
                refunded: transactions.filter(t => t.status === 'REFUNDED').length
            },
            revenue: {
                total: transactions
                    .filter(t => t.status === 'COMPLETED')
                    .reduce((sum, t) => sum + t.amount, 0),
                refunded: transactions
                    .filter(t => t.status === 'REFUNDED')
                    .reduce((sum, t) => sum + t.amount, 0),
                pending: transactions
                    .filter(t => t.status === 'PENDING')
                    .reduce((sum, t) => sum + t.amount, 0)
            },
            paymentGateways: {
                PhonePe: transactions.filter(t => t.status === 'PhonePe').length,
                Free: transactions.filter(t => t.status === 'Free').length,
                Razorpay: transactions.filter(t => t.status === 'Razorpay').length
            },
            recentTransactions: await Payment.find(dateFilter)
                .sort({ purchasedAt: -1 })
                .limit(5)
                .populate('user', 'fullName')
                .populate('book', 'title')
        };

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   PUT /api/payments/admin/transactions/:id/status
// @desc    Update transaction status (Admin only)
// @access  Private (Admin)
exports.updateTransactionStatus = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const { status, note } = req.body;
        const validStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }

        const transaction = await Payment.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Update status
        transaction.status = status;
        
        // Add admin note if provided
        if (note) {
            if (!transaction.adminNotes) {
                transaction.adminNotes = [];
            }
            transaction.adminNotes.push({
                note,
                updatedBy: req.user._id,
                updatedAt: new Date()
            });
        }

        await transaction.save();

        res.json({
            success: true,
            message: 'Transaction status updated successfully',
            data: transaction
        });

    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   GET /api/payments/admin/export
// @desc    Export transactions to CSV (Admin only)
// @access  Private (Admin)
exports.exportTransactions = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const { status, startDate, endDate } = req.query;

        // Build query
        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }
        if (startDate || endDate) {
            query.purchasedAt = {};
            if (startDate) query.purchasedAt.$gte = new Date(startDate);
            if (endDate) query.purchasedAt.$lte = new Date(endDate);
        }

        const transactions = await Payment.find(query)
            .populate('user', 'fullName email')
            .populate('book', 'title')
            .sort({ purchasedAt: -1 });

        // Create CSV content
        const csvHeader = 'Transaction ID,User,Email,Book,Amount,Status,Payment Gateway,Date\n';
        const csvRows = transactions.map(txn => {
            return `${txn.transactionId},${txn.user?.fullName || 'N/A'},${txn.user?.email || 'N/A'},${txn.book?.title || 'N/A'},${txn.amount},${txn.paymentStatus},${txn.paymentGateway},${new Date(txn.purchasedAt).toISOString()}`;
        }).join('\n');

        const csv = csvHeader + csvRows;

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=transactions-${Date.now()}.csv`);
        res.send(csv);

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// @route   DELETE /api/payments/admin/transactions/:id
// @desc    Delete a transaction (Admin only - use with extreme caution)
// @access  Private (Admin)
exports.deleteTransaction = async (req, res) => {
    try {
        // Verify admin access
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        const transactionId = req.params.id;

        console.log('🗑️ Attempting to delete transaction:', transactionId);

        // Find the transaction
        const transaction = await Purchase.findById(transactionId)
            .populate('user', 'fullName email')
            .populate('book', 'title');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Check if transaction can be deleted
        // Only allow deletion of FAILED or PENDING transactions by default
        const deletableStatuses = ['FAILED', 'PENDING'];
        
        if (!deletableStatuses.includes(transaction.paymentStatus)) {
            // For COMPLETED or REFUNDED transactions, require additional confirmation
            // You might want to add a query parameter like ?force=true
            const forceDelete = req.query.force === 'true';
            
            if (!forceDelete) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot delete ${transaction.paymentStatus} transaction without force flag. This transaction has been completed.`,
                    data: {
                        transactionId: transaction.transactionId,
                        status: transaction.paymentStatus,
                        amount: transaction.amount,
                        user: transaction.user?.fullName,
                        book: transaction.book?.title,
                        requiresForce: true
                    }
                });
            }
        }

        // Log deletion for audit purposes
        console.log('⚠️ TRANSACTION DELETE:', {
            deletedBy: req.user.email,
            transactionId: transaction.transactionId,
            status: transaction.paymentStatus,
            amount: transaction.amount,
            user: transaction.user?.email,
            book: transaction.book?.title,
            deletedAt: new Date().toISOString()
        });

        // If transaction was COMPLETED, we need to reverse the book download count
        if (transaction.paymentStatus === 'COMPLETED' && transaction.book) {
            await Book.findByIdAndUpdate(
                transaction.book._id,
                { $inc: { downloadCount: -1 } }
            );
            console.log('✅ Reversed book download count');
        }

        // Store transaction data before deletion (for logging/audit)
        const deletedTransactionData = {
            _id: transaction._id,
            transactionId: transaction.transactionId,
            user: transaction.user?.email,
            book: transaction.book?.title,
            amount: transaction.amount,
            paymentStatus: transaction.paymentStatus,
            paymentGateway: transaction.paymentGateway,
            purchasedAt: transaction.purchasedAt,
            deletedBy: req.user.email,
            deletedAt: new Date()
        };

        // Optional: Store in a deletedTransactions collection for audit trail
        // await DeletedTransaction.create(deletedTransactionData);

        // Delete the transaction
        await transaction.deleteOne();

        console.log('✅ Transaction deleted successfully');

        res.json({
            success: true,
            message: 'Transaction deleted successfully',
            data: {
                deletedTransaction: deletedTransactionData
            }
        });

    } catch (error) {
        console.error('❌ Delete transaction error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete transaction: ' + error.message
        });
    }
};

// @route   POST /api/payments/admin/transactions/bulk-delete
// @desc    Bulk delete transactions (Admin only)
// @access  Private (Admin)
exports.bulkDeleteTransactions = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Admin privileges required.'
            });
        }

        const { transactionIds, force } = req.body;

        if (!transactionIds || !Array.isArray(transactionIds) || transactionIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid transaction IDs array'
            });
        }

        console.log('🗑️ Bulk delete request:', {
            count: transactionIds.length,
            force: force
        });

        // Find all transactions
        const transactions = await Purchase.find({ 
            _id: { $in: transactionIds } 
        }).populate('book', 'title');

        if (transactions.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'No transactions found'
            });
        }

        // Check if any transactions are COMPLETED or REFUNDED
        const protectedTransactions = transactions.filter(t => 
            t.paymentStatus === 'COMPLETED' || t.paymentStatus === 'REFUNDED'
        );

        if (protectedTransactions.length > 0 && !force) {
            return res.status(400).json({
                success: false,
                error: `${protectedTransactions.length} transaction(s) are COMPLETED or REFUNDED and require force delete`,
                data: {
                    protectedCount: protectedTransactions.length,
                    totalCount: transactions.length,
                    requiresForce: true
                }
            });
        }

        // Reverse book download counts for COMPLETED transactions
        const completedTransactions = transactions.filter(t => t.paymentStatus === 'COMPLETED');
        for (const transaction of completedTransactions) {
            if (transaction.book) {
                await Book.findByIdAndUpdate(
                    transaction.book._id,
                    { $inc: { downloadCount: -1 } }
                );
            }
        }

        // Log bulk deletion
        console.log('⚠️ BULK TRANSACTION DELETE:', {
            deletedBy: req.user.email,
            count: transactions.length,
            deletedAt: new Date().toISOString()
        });

        // Delete all transactions
        const result = await Purchase.deleteMany({ 
            _id: { $in: transactionIds } 
        });

        console.log(`✅ Bulk deleted ${result.deletedCount} transactions`);

        res.json({
            success: true,
            message: `${result.deletedCount} transaction(s) deleted successfully`,
            data: {
                deletedCount: result.deletedCount
            }
        });

    } catch (error) {
        console.error('❌ Bulk delete error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete transactions: ' + error.message
        });
    }
};

// @route   DELETE /api/payments/admin/transactions/cleanup
// @desc    Delete all FAILED transactions older than X days (Admin only)
// @access  Private (Admin)
exports.cleanupFailedTransactions = async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const { daysOld = 30 } = req.query;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(daysOld));

        console.log('🧹 Cleaning up failed transactions older than:', cutoffDate);

        // Find failed transactions older than cutoff date
        const failedTransactions = await Purchase.find({
            paymentStatus: 'FAILED',
            purchasedAt: { $lt: cutoffDate }
        });

        if (failedTransactions.length === 0) {
            return res.json({
                success: true,
                message: 'No failed transactions to clean up',
                data: {
                    deletedCount: 0
                }
            });
        }

        // Delete them
        const result = await Purchase.deleteMany({
            paymentStatus: 'FAILED',
            purchasedAt: { $lt: cutoffDate }
        });

        console.log(`✅ Cleaned up ${result.deletedCount} failed transactions`);

        res.json({
            success: true,
            message: `Cleaned up ${result.deletedCount} failed transaction(s)`,
            data: {
                deletedCount: result.deletedCount,
                cutoffDate
            }
        });

    } catch (error) {
        console.error('❌ Cleanup error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
// ============================================
// PURCHASE MODEL - Update your model to this
// ============================================

/*
// models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
        default: 'PENDING'
    },
    paymentGateway: {
        type: String,
        enum: ['PhonePe', 'Free', 'Razorpay', 'Paytm'], // FIXED: Correct enum values
        required: true
    },
    downloadToken: {
        type: String,
        unique: true,
        sparse: true
    },
    downloadExpiresAt: {
        type: Date
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    maxDownloads: {
        type: Number,
        default: 5
    },
    phonepeResponse: {
        type: Object
    },
    refundTransactionId: {
        type: String
    },
    refundedAt: {
        type: Date
    },
    purchasedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes
purchaseSchema.index({ user: 1, book: 1 });
purchaseSchema.index({ transactionId: 1 });
purchaseSchema.index({ downloadToken: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
*/