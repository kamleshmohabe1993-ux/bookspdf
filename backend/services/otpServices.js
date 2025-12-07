// In-memory OTP storage (temporarily stores OTPs)
const otpStorage = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in memory with 10-minute expiration
exports.storeOTP = (email, otp) => {
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStorage.set(email.toLowerCase(), {
        otp,
        expiresAt,
        attempts: 0 // Track verification attempts
    });
    // Auto-delete after 10 minutes
    setTimeout(() => {
        otpStorage.delete(email.toLowerCase());
    }, 10 * 60 * 1000);
};

// Verify OTP
exports.verifyOTP = (email, otp) => {
    const stored = otpStorage.get(email.toLowerCase());
    
    if (!stored) {
        return { success: false, error: 'OTP not found or expired' };
    }
    
    // Check if expired
    if (Date.now() > stored.expiresAt) {
        otpStorage.delete(email.toLowerCase());
        return { success: false, error: 'OTP has expired' };
    }
    
    // Check attempts (max 5 attempts)
    if (stored.attempts >= 5) {
        otpStorage.delete(email.toLowerCase());
        return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
    }
    
    // Verify OTP
    if (stored.otp !== otp) {
        stored.attempts += 1;
        return { success: false, error: 'Invalid OTP', attemptsLeft: 5 - stored.attempts };
    }
    
    return { success: true };
};

// Delete OTP after successful verification
exports.deleteOTP = (email) => {
    otpStorage.delete(email.toLowerCase());
};

// Check if OTP exists (for resend logic)
exports.otpExists = (email) => {
    const stored = otpStorage.get(email.toLowerCase());
    if (!stored) return false;
    
    // Check if expired
    if (Date.now() > stored.expiresAt) {
        otpStorage.delete(email.toLowerCase());
        return false;
    }
    
    return true;
};

// Get remaining time for OTP
exports.getRemainingTime = (email) => {
    const stored = otpStorage.get(email.toLowerCase());
    if (!stored) return 0;
    
    const remaining = Math.floor((stored.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
};

// Export generateOTP function
exports.generateOTP = generateOTP;
