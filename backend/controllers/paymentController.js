const { phonePeClient } = require('../config/phonepe');
const crypto = require('crypto');
const Purchase = require('../models/Purchase');
const Book = require('../models/Book');

// @route   POST /api/payments/initiate
// @desc    Initiate PhonePe payment
exports.initiatePayment = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        console.log('💳 Payment initiation request:', { bookId, userId });

        // Validate book
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        if (!book.isPaid) {
            return res.status(400).json({
                success: false,
                error: 'This book is free to download'
            });
        }

        // Check if already purchased
        const existingPurchase = await Purchase.findOne({
            user: userId,
            book: bookId,
            paymentStatus: 'COMPLETED'
        });

        if (existingPurchase) {
            return res.status(400).json({
                success: false,
                error: 'You have already purchased this book',
                data: {
                    downloadToken: existingPurchase.downloadToken,
                    transactionId: existingPurchase.transactionId
                }
            });
        }

        // Generate unique transaction ID
        const merchantTransactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        const amount = Math.round(book.price * 100); // Convert to paise

        console.log('📦 Creating purchase record...');

        // Create purchase record - FIXED: Use correct enum value
        const purchase = await Purchase.create({
            user: userId,
            book: bookId,
            transactionId: merchantTransactionId,
            amount: book.price,
            paymentStatus: 'PENDING',
            paymentGateway: 'PhonePe' // Changed from 'phonepe' to match enum
        });

        console.log('✅ Purchase record created:', purchase._id);

        // Prepare payment data
        const paymentData = {
            transactionId: merchantTransactionId,
            userId: `USER${userId}`,
            amount: amount,
            callbackUrl: process.env.PHONEPE_CALLBACK_URL,
            redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}?txnId=${merchantTransactionId}`,
            redirectMode: 'POST',
            mobileNumber: req.user.mobileNumber
        };

        console.log('🔄 Calling PhonePe SDK...');
        console.log('Payment data:', JSON.stringify(paymentData, null, 2));

        // Check if phonePeClient has initiatePayment method
        if (typeof phonePeClient.initiatePayment !== 'function') {
            console.error('❌ phonePeClient.initiatePayment is not a function!');
            console.error('Available methods:', Object.keys(phonePeClient));
            throw new Error('PhonePe SDK not properly initialized');
        }

        // Initiate payment
        const paymentResponse = await phonePeClient.initiatePayment(paymentData);

        console.log('✅ PhonePe response received:', paymentResponse);

        if (paymentResponse.success) {
            console.log('✅ Payment initiated successfully');
            
            return res.json({
                success: true,
                data: {
                    paymentUrl: paymentResponse.data.instrumentResponse.redirectInfo.url,
                    transactionId: merchantTransactionId,
                    merchantId: process.env.PHONEPE_MERCHANT_ID
                }
            });
        } else {
            console.error('❌ Payment initiation failed:', paymentResponse);
            
            await purchase.updateOne({ paymentStatus: 'FAILED' });
            
            return res.status(400).json({
                success: false,
                error: paymentResponse.message || 'Payment initiation failed'
            });
        }

    } catch (error) {
        console.error('💥 Payment initiation error:', error);
        console.error('Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            error: 'Payment initiation failed: ' + error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
        const verification = phonePeClient.verifyWebhook(response, xVerifyHeader);

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
        const purchase = await Purchase.findOne({ transactionId });

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