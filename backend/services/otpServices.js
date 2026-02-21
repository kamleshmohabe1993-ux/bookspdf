const OTP = require('../models/OTP');
const crypto = require('crypto');

exports.generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.storeOTP = async (email, otp) => {
    await OTP.deleteOne({ email: email.toLowerCase() });
    await OTP.create({ email: email.toLowerCase(), otp, attempts: 0 });
};

exports.verifyOTP = async (email, otp) => {
    const stored = await OTP.findOne({ email: email.toLowerCase() });
    if (!stored) return { success: false, error: 'OTP not found or expired' };

    if (stored.attempts >= 5) {
        await OTP.deleteOne({ email: email.toLowerCase() });
        return { success: false, error: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (stored.otp !== otp) {
        stored.attempts += 1;
        await stored.save();
        return { success: false, error: 'Invalid OTP', attemptsLeft: 5 - stored.attempts };
    }

    return { success: true };
};

exports.deleteOTP = async (email) => {
    await OTP.deleteOne({ email: email.toLowerCase() });
};

exports.otpExists = async (email) => {
    const stored = await OTP.findOne({ email: email.toLowerCase() });
    return !!stored;
};

exports.getRemainingTime = async (email) => {
    const stored = await OTP.findOne({ email: email.toLowerCase() });
    if (!stored) return 0;
    const expiresAt = new Date(stored.createdAt).getTime() + 10 * 60 * 1000;
    const remaining = Math.floor((expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : 0;
};