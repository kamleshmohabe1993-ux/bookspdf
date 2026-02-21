const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../services/emailService');
const otpService = require('../services/otpServices');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
exports.register = async (req, res) => {
    try {
        const { email, password, fullName, mobileNumber } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            fullName,
            mobileNumber
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                isAdmin: user.isAdmin,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token
        // const token = generateToken(user._id);
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7h' } // Long expiry for payment flow
        );

        // ✅ SET HTTP-ONLY COOKIE (survives redirects)
        res.cookie('auth_token', token, {
            httpOnly: true,        // Cannot be accessed by JavaScript (XSS protection)
            secure: process.env.NODE_ENV === 'production', // HTTPS only in production
            sameSite: 'lax',       // CSRF protection (allows redirects)
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        res.json({
            success: true,
            data: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                isAdmin: user.isAdmin,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   GET /api/auth/me
// @desc    Get current user
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   PUT /api/auth/update-profile
// @desc    Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullName, mobileNumber, interests } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Update fields
        if (fullName) user.fullName = fullName;
        if (mobileNumber) user.mobileNumber = mobileNumber;
        if (interests) user.interests = interests;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                mobileNumber: user.mobileNumber,
                interests: user.interests,
                avatar: user.avatar,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @route   PUT /api/auth/change-password
// @desc    Change password
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


// @desc    Delete a user
exports.deleteProfile = async (req, res) => {
    try {
        const { password, userId } = req.body;
        const profile = await User.findById(userId);
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        // Check if user owns this rating
        if (User._id == userId.toString() && profile.password == password && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        await profile.deleteOne();

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// STEP 1: Request Password Reset OTP
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email address'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No account found with this email address'
            });
        }

        // Check if OTP already exists and is still valid
        if (otpService.otpExists(email)) {
            const remainingTime = otpService.getRemainingTime(email);
            return res.status(400).json({
                success: false,
                error: `An OTP was already sent. Please wait ${Math.ceil(remainingTime / 60)} minutes before requesting a new one.`,
                remainingTime
            });
        }

        // Generate OTP
        const otp = otpService.generateOTP();
        
        // Store OTP in memory (not in database)
        otpService.storeOTP(email, otp);
        // Send OTP email
        try {
            await sendOTPEmail(user.email, otp, user.fullName);
            
            res.json({
                success: true,
                message: 'OTP has been sent to your email address. Valid for 10 minutes.',
                email: user.email,
                expiresIn: 600 // 10 minutes in seconds
            });
        } catch (emailError) {
            // If email fails, remove OTP from memory
            otpService.deleteOTP(email);
            
            return res.status(500).json({
                success: false,
                error: 'Failed to send OTP email. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while processing your request'
        });
    }
};

// STEP 2: Verify OTP
exports.verifyResetPassword = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Please provide both email and OTP'
            });
        }

        // Verify user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Verify OTP from memory
        const verification = otpService.verifyOTP(email, otp);

        if (!verification.success) {
            return res.status(400).json({
                success: false,
                error: verification.error,
                attemptsLeft: verification.attemptsLeft
            });
        }

        res.json({
            success: true,
            message: 'OTP verified successfully. You can now reset your password.',
            email: user.email
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while verifying OTP'
        });
    }
};

// STEP 3: Reset Password with OTP
exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword, confirmPassword } = req.body;

        // Validate input
        if (!email || !otp || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: 'Passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Verify OTP one final time
        const verification = otpService.verifyOTP(email, otp);

        if (!verification.success) {
            return res.status(400).json({
                success: false,
                error: verification.error,
                attemptsLeft: verification.attemptsLeft
            });
        }

        // Update password in database
        user.password = newPassword;
        await user.save();

        // Delete OTP from memory after successful reset
        otpService.deleteOTP(email);

        res.json({
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while resetting your password'
        });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Please provide an email address'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No account found with this email address'
            });
        }

        // Check if OTP exists and is still valid
        if (otpService.otpExists(email)) {
            const remainingTime = otpService.getRemainingTime(email);
            
            // Allow resend only if less than 2 minutes remaining
            if (remainingTime > 120) {
                return res.status(400).json({
                    success: false,
                    error: `Please wait ${Math.ceil((remainingTime - 120) / 60)} more minutes before requesting a new OTP.`,
                    remainingTime
                });
            }
        }

        // Delete old OTP
        otpService.deleteOTP(email);

        // Generate new OTP
        const otp = otpService.generateOTP();
        otpService.storeOTP(email, otp);

        // Send OTP email
        try {
            await sendOTPEmail(user.email, otp, user.name);
            
            res.json({
                success: true,
                message: 'New OTP has been sent to your email address',
                expiresIn: 600
            });
        } catch (emailError) {
            otpService.deleteOTP(email);
            return res.status(500).json({
                success: false,
                error: 'Failed to send OTP email. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            error: 'An error occurred while resending OTP'
        });
    }
};
