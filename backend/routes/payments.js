const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

// Import all controller functions
const {
    initiatePayment,
    getPaymentHistory,
    handleWebhook,
    handleRedirectCallback,
    getPaymentStatus,
    initiateRefund,
    getDownloadLink,
    freeDownload,
    getMyPurchases,
    getAllTransactions,
    getTransactionById,
    getTransactionStats,
    updateTransactionStatus,
    exportTransactions,
    deleteTransaction,
    cleanupFailedTransactions,
    bulkDeleteTransactions
} = require('../controllers/paymentController');

// Public routes
router.post('/webhook', handleWebhook); // PhonePe webhook (no auth)

// UI Redirect: Browser redirect after payment (no auth middleware)
router.get('/redirect-callback', handleRedirectCallback);

// Status polling: Called by frontend (requires auth)
router.get('/status/:merchantOrderId', getPaymentStatus);


// Protected routes (require authentication)
router.post('/initiate', protect, initiatePayment);
// router.get('/status/:transactionId', protect, checkPaymentStatus);
router.post('/downloadfree/:bookId', protect, freeDownload);
router.get('/my-purchases', protect, getMyPurchases);

// router.get('/verify/:merchantOrderId', protect, checkPaymentStatus);
router.get('/history', protect, getPaymentHistory);
router.post('/refund/:merchantOrderId', adminOnly, initiateRefund);

// Admin transaction routes
router.get('/transactions', protect, adminOnly, getAllTransactions);
router.get('/transactions/:id', protect, adminOnly, getTransactionById);
router.get('/stats', protect, adminOnly, getTransactionStats);
router.put('/transactions/:id/status', protect, adminOnly, updateTransactionStatus);
router.get('/export', protect, adminOnly, exportTransactions);

// Token-based download (no auth required, token acts as auth)
router.get('/download/:token', getDownloadLink);

// Admin only routes
// router.post('/refund', protect, adminOnly, initiateRefund);

// ============================================
// TRANSACTION DELETE ROUTES (Admin Only)
// ============================================
router.delete(
    '/transactions/:id',
    protect, adminOnly,
    deleteTransaction
);

// @route   POST /api/payments/admin/transactions/bulk-delete
// @desc    Bulk delete multiple transactions
// @access  Private (Admin)
router.post(
    '/transactions/bulk-delete',
    protect, adminOnly,
    bulkDeleteTransactions
);

// @route   DELETE /api/payments/admin/transactions/cleanup
// @desc    Cleanup old failed transactions
// @access  Private (Admin)
// @query   ?daysOld=30 (default: 30 days)
router.delete(
    '/cleanup',
    protect, adminOnly,
    cleanupFailedTransactions
);
module.exports = router;

