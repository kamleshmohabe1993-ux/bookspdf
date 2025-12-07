const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    updateProfile, 
    deleteProfile, 
    changePassword,
    forgotPassword, 
    verifyResetPassword,
    resetPassword, 
    resendOTP 
 } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetPassword);
router.post('/resend-otp', resendOTP);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.delete('/account', protect, deleteProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;