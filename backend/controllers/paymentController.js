const { phonePeV2Client } = require('../config/phonepe');
const crypto = require('crypto');
const Purchase = require('../models/Purchase');
const Book = require('../models/Book');
const Payment = require('../models/Payment');

const generateOrderId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
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
            status: 'SUCCESS || COMPLETED'
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
            paymentGateway: 'PhonePe',
            downloadToken,
            maxDownloads: 100,
            userMobile: req.user.mobileNumber,
            userEmail: req.user.email
        });

        // Increment download count
        await Book.findByIdAndUpdate(bookId, {
            $inc: { downloadCount: 1 }
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

// @route   GET /api/payments/download/:token
// @desc    Get secure download link
exports.getDownloadLink = async (req, res) => {
    try {
        const { token } = req.params;

        const purchase = await Payment.findOne({ downloadToken: token })
            .populate('bookId');

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
                downloadUrl: purchase.bookId.pdfDownloadLink,
                filename: `${purchase.bookId.title}.pdf`,
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

const verifyWebhookAuth = (authorizationHeader) => {
    try {
        const username = process.env.PHONEPE_WEBHOOK_USERNAME;
        const password = process.env.PHONEPE_WEBHOOK_PASSWORD;

        if (!username || !password) {
            console.error('❌ Webhook credentials not configured in .env');
            return false;
        }

        // PhonePe computes SHA256 of "username:password"
        const expectedHash = crypto
            .createHash('sha256')
            .update(`${username}:${password}`)
            .digest('hex');

        // Authorization header from PhonePe = the SHA256 hash
        const receivedHash = authorizationHeader?.replace('Basic ', '').trim();

        const isValid = expectedHash === receivedHash;

        if (!isValid) {
            console.error('❌ Webhook auth mismatch', {
                expected: expectedHash.substring(0, 20) + '...',
                received: receivedHash?.substring(0, 20) + '...'
            });
        }

        return isValid;

    } catch (err) {
        console.error('❌ Webhook auth verification error:', err.message);
        return false;
    }
};

/**
 * S2S Webhook Handler
 * Receives real-time payment status updates from PhonePe servers
 */
exports.handleWebhook = async (req, res) => {
    try {
        console.log('📥 PhonePe V2 Webhook received');

        // ── Step 1: Verify Authorization header ──────────────────────────────
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            console.error('❌ Webhook: Missing Authorization header');
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
        }

        const isAuthValid = verifyWebhookAuth(authHeader);
        if (!isAuthValid) {
            console.error('❌ Webhook: Invalid Authorization header');
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
        }

        // ── Step 2: Parse webhook body ────────────────────────────────────────
        // V2 Webhook payload structure:
        // {
        //   "event": "checkout.order.completed" | "checkout.order.failed" | "pg.refund.accepted",
        //   "payload": { orderId, merchantOrderId, state, amount, metaInfo, paymentDetails }
        // }
        const { event, payload } = req.body;

        if (!event || !payload) {
            console.error('❌ Webhook: Invalid payload structure');
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid payload' 
            });
        }

        console.log('📦 Webhook event:', event, '| Order:', payload.merchantOrderId);

        // ── Step 3: Route by event type ────────────────────────────────────────
        switch (event) {

            case 'checkout.order.completed':
                await handleOrderCompleted(payload);
                break;

            case 'checkout.order.failed':
                await handleOrderFailed(payload);
                break;

            case 'pg.refund.accepted':
                await handleRefundAccepted(payload);
                break;

            default:
                console.log(`⚠️ Unhandled webhook event: ${event}`);
        }

        // ── Step 4: Always respond 200 to PhonePe ─────────────────────────────
        // PhonePe will retry if it doesn't get a 200 response
        res.status(200).json({ success: true, message: 'Webhook processed' });

    } catch (err) {
        console.error('❌ Webhook processing error:', err.message);
        // Still respond 200 to prevent PhonePe retries for server errors
        res.status(200).json({ success: true, message: 'Webhook received' });
    }
};

/**
 * Handle: checkout.order.completed
 */
const handleOrderCompleted = async (payload) => {
    // IMPORTANT: Always rely on payload.state, NOT event name
    const { merchantOrderId, orderId, state, amount, metaInfo, paymentDetails } = payload;

    console.log(`✅ Order completed: ${merchantOrderId} | State: ${state}`);

    const payment = await Payment.findOne({ merchantOrderId });
    if (!payment) {
        console.error('❌ Payment not found for webhook:', merchantOrderId);
        return;
    }

    // Idempotency check - skip if already processed
    if (payment.status === 'SUCCESS') {
        console.log('⚠️ Payment already marked SUCCESS, skipping');
        return;
    }

    // Extract payment details
    const paymentDetail  = paymentDetails?.[0] || {};
    const paymentMode    = paymentDetail.paymentMode;
    const upiTransId     = paymentDetail.splitInstruments?.[0]?.rail?.upiTransactionId;
    const vpa            = paymentDetail.splitInstruments?.[0]?.rail?.vpa;

    // Update payment record
    payment.status           = 'SUCCESS';
    payment.phonePeOrderId   = orderId;
    payment.paymentState     = state;
    payment.paymentMethod    = paymentMode;
    payment.completedAt      = new Date(paymentDetail.timestamp || Date.now());
    payment.webhookReceived  = true;
    payment.paymentInstrument = {
        type: paymentMode,
        upiTransactionId: upiTransId,
        vpa
    };

    await payment.save();

    // Add book to user's library
    await User.findByIdAndUpdate(payment.userId, {
        $addToSet: { purchasedBooks: payment.bookId }
    });

    console.log(`✅ Payment SUCCESS saved for ${merchantOrderId}`);
};

/**
 * Handle: checkout.order.failed
 */
const handleOrderFailed = async (payload) => {
    const { merchantOrderId, orderId, state, paymentDetails } = payload;

    console.log(`❌ Order failed: ${merchantOrderId} | State: ${state}`);

    const payment = await Payment.findOne({ merchantOrderId });
    if (!payment) {
        console.error('❌ Payment not found for failed webhook:', merchantOrderId);
        return;
    }

    if (payment.status === 'FAILED') {
        console.log('⚠️ Payment already marked FAILED, skipping');
        return;
    }

    const paymentDetail = paymentDetails?.[0] || {};

    payment.status          = 'FAILED';
    payment.phonePeOrderId  = orderId;
    payment.paymentState    = state;
    payment.errorCode       = paymentDetail.errorCode;
    payment.errorMessage    = paymentDetail.detailedErrorCode;
    payment.webhookReceived = true;

    await payment.save();

    console.log(`❌ Payment FAILED saved for ${merchantOrderId}`);
};

/**
 * Handle: pg.refund.accepted
 */
const handleRefundAccepted = async (payload) => {
    const { originalMerchantOrderId, merchantRefundId, amount, state } = payload;

    console.log(`💸 Refund accepted: ${merchantRefundId} | State: ${state}`);

    const payment = await Payment.findOne({
        merchantOrderId: originalMerchantOrderId
    });

    if (!payment) {
        console.error('❌ Payment not found for refund webhook:', originalMerchantOrderId);
        return;
    }

    payment.status      = 'REFUNDED';
    payment.refundedAt  = new Date();
    payment.refundId    = payload.paymentDetails?.[0]?.transactionId || merchantRefundId;

    await payment.save();

    // Remove book from user's library
    await User.findByIdAndUpdate(payment.userId, {
        $pull: { purchasedBooks: payment.bookId }
    });

    console.log(`💸 Refund SUCCESS saved for ${originalMerchantOrderId}`);
};


// ============================================================================
// 2. UI REDIRECT CALLBACK HANDLER
//    GET /api/payments/v2/redirect-callback
//    This is the redirectUrl you pass when creating the payment.
//    User's browser lands here after completing payment on PhonePe page.
// ============================================================================


exports.handleRedirectCallback = async (req, res) => {
    try {
        // PhonePe appends merchantOrderId to your redirectUrl as a query param
        const { merchantOrderId } = req.query;

        if (!merchantOrderId) {
            console.error('❌ Redirect callback: Missing merchantOrderId');
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/error?reason=missing_order`
            );
        }

        console.log('🔄 Redirect callback received for:', merchantOrderId);

        // Find local payment record
        const payment = await Payment.findOne({ merchantOrderId });
        if (!payment) {
            console.error('❌ Redirect callback: Payment not found:', merchantOrderId);
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/error?reason=not_found`
            );
        }

        // If webhook already updated status, use it directly
        if (payment.webhookReceived && payment.status === 'SUCCESS') {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/success` +
                `?orderId=${merchantOrderId}` +
                `&bookId=${payment.bookId}`
            );
        }

        if (payment.webhookReceived && payment.status === 'FAILED') {
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/failed` +
                `?orderId=${merchantOrderId}` +
                `&reason=${payment.errorCode || 'payment_failed'}`
            );
        }

        // Webhook not yet received → manually check status via API
        console.log('🔍 Webhook not received yet, checking status via API...');

        const statusResponse = await phonePeV2Client.checkOrderStatus(merchantOrderId);

        if (statusResponse.paymentStatus === 'SUCCESS') {
            // Update payment if not already done
            if (payment.status !== 'SUCCESS') {
                payment.status          = 'SUCCESS';
                payment.paymentState    = statusResponse.state;
                payment.paymentMethod   = statusResponse.paymentInstrument?.type;
                payment.completedAt     = new Date();
                payment.paymentInstrument = statusResponse.paymentInstrument;
                await payment.save();

                await User.findByIdAndUpdate(payment.userId, {
                    $addToSet: { purchasedBooks: payment.bookId }
                });
            }

            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/success` +
                `?orderId=${merchantOrderId}` +
                `&bookId=${payment.bookId}`
            );

        } else if (statusResponse.paymentStatus === 'FAILED') {
            if (payment.status !== 'FAILED') {
                payment.status = 'FAILED';
                await payment.save();
            }

            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/failed` +
                `?orderId=${merchantOrderId}` +
                `&reason=payment_failed`
            );

        } else {
            // PENDING state - redirect to processing page
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/processing` +
                `?orderId=${merchantOrderId}`
            );
        }

    } catch (err) {
        console.error('❌ Redirect callback error:', err.message);
        return res.redirect(
            `${process.env.FRONTEND_URL}/payment/error?reason=server_error`
        );
    }
};


// ============================================================================
// 3. PAYMENT STATUS CHECK API
//    GET /api/payments/v2/status/:merchantOrderId
//    Called from frontend polling when payment is in PENDING state
// ============================================================================

exports.getPaymentStatus = async (req, res) => {
    try {
        const { merchantOrderId } = req.params;
        // const userId = req.user.id;

        const payment = await Payment.findOne({ merchantOrderId })
            .populate('bookId', 'title thumbnail pdfDownloadLink price');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // If not yet confirmed via webhook, check with PhonePe API
        if (payment.status === 'PENDING' && !payment.webhookReceived) {
            const statusResponse = await phonePeV2Client.checkOrderStatus(merchantOrderId);

            if (statusResponse.paymentStatus === 'SUCCESS') {
                payment.status        = 'SUCCESS';
                payment.paymentState  = statusResponse.state;
                payment.completedAt   = new Date();
                payment.paymentInstrument = statusResponse.paymentInstrument;
                await payment.save();

                await User.findByIdAndUpdate(userId, {
                    $addToSet: { purchasedBooks: payment.bookId }
                });

            } else if (statusResponse.paymentStatus === 'FAILED') {
                payment.status = 'FAILED';
                await payment.save();
            }
        }

        res.status(200).json({
            success: true,
            data: {
                status: payment.status,
                merchantOrderId: payment.merchantOrderId,
                phonePeOrderId: payment.phonePeOrderId,
                amount: payment.amount / 100,
                paymentMethod: payment.paymentMethod,
                book: payment.bookId,
                completedAt: payment.completedAt,
                webhookReceived: payment.webhookReceived
            }
        });

    } catch (err) {
        console.error('❌ Status check error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment status',
            error: err.message
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
        const existingDownload = await Payment.findOne({
            userId: userId,
            bookId: bookId
        });

        if (existingDownload) {
            return res.json({
                success: true,
                data: {
                    downloadUrl: bookId.pdfDownloadLink,
                    filename: `${bookId.title}.pdf`,
                    downloadToken: existingDownload.downloadToken
                }
            });
        }

        // Create free download record - FIXED: Use correct enum value
        const merchantOrderId = `FREE${Date.now()}${userId.toString().slice(-6)}`;
        const downloadToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

        await Payment.create({
            userId: userId,
            bookId: bookId,
            merchantOrderId,
            amount: 0,
            status: 'SUCCESS',
            paymentGateway: 'Free', // Changed from 'free' to match enum
            downloadToken,
            downloadExpiresAt: expiresAt,
            maxDownloads: 100,
            paymentState: 'COMPLETED'
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
        const purchases = await Payment.find({
            userId: req.user._id,
            paymentState: 'COMPLETED'
        })
            .populate('bookId', 'title author thumbnail price isPaid')
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
            .populate('userId', 'fullName email mobileNumber') // Populate user details
            .populate('bookId', 'title author thumbnail price category') // Populate book details
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
                .filter(t => t.status === 'COMPLETED')
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
            .populate('userId', 'fullName email')
            .populate('bookId', 'title')
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
        const transaction = await Payment.findById(transactionId)
            .populate('userId', 'fullName email')
            .populate('bookId', 'title');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: 'Transaction not found'
            });
        }

        // Check if transaction can be deleted
        // Only allow deletion of FAILED or PENDING transactions by default
        const deletableStatuses = ['FAILED', 'PENDING'];
        
        if (!deletableStatuses.includes(transaction.status)) {
            // For COMPLETED or REFUNDED transactions, require additional confirmation
            // You might want to add a query parameter like ?force=true
            const forceDelete = req.query.force === 'true';
            
            if (!forceDelete) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot delete ${transaction.status} transaction without force flag. This transaction has been completed.`,
                    data: {
                        transactionId: transaction.transactionId,
                        status: transaction.status,
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
        if (transaction.status === 'COMPLETED' && transaction.book) {
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
        const transactions = await Payment.find({ 
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
            t.status === 'COMPLETED' || t.status === 'REFUNDED'
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
        const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');
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
        const failedTransactions = await Payment.find({
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
            status: 'FAILED',
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