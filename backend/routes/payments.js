const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

// Import all controller functions
const {
    initiatePayment,
    paymentCallback,
    checkPaymentStatus,
    initiateRefund,
    getDownloadLink,
    freeDownload,
    getMyPurchases
} = require('../controllers/paymentController');

// Public routes
router.post('/callback', paymentCallback); // PhonePe webhook (no auth)

// Protected routes (require authentication)
router.post('/initiate', protect, initiatePayment);
router.get('/status/:transactionId', protect, checkPaymentStatus);
router.post('/free-download/:bookId', protect, freeDownload);
router.get('/my-purchases', protect, getMyPurchases);

// Token-based download (no auth required, token acts as auth)
router.get('/download/:token', getDownloadLink);

// Admin only routes
router.post('/refund', protect, adminOnly, initiateRefund);

module.exports = router;

// backend/routes/payments.js

// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/auth'); // Your auth middleware
// const {
//     initiatePayment,
//     paytmCallback,
//     checkPaymentStatus,
//     freeDownload
// } = require('../controllers/paymentController');

// // @route   POST /api/payments/initiate
// // @desc    Initiate Paytm payment
// // @access  Private
// router.post('/initiate', protect, initiatePayment);

// // @route   POST /api/payments/paytm/callback
// // @desc    Handle Paytm callback
// // @access  Public (Paytm will call this)
// router.post('/paytm/callback', paytmCallback);

// // @route   POST /api/payments/status
// // @desc    Check payment status
// // @access  Private
// router.post('/status', protect, checkPaymentStatus);

// // @route   POST /api/payments/free-download
// // @desc    Download free book
// // @access  Private
// router.post('/free-download', protect, freeDownload);

// module.exports = router;