'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import showToast from '@/lib/toast';
export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Timer for resend OTP
    React.useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Step 1: Request OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                email: formData.email
                  });
            localStorage.setItem('token', response.data.token);
            showToast.success('OTP sent to your email!');
            console.log('OTP Request Response:', response.data);
            setSuccess(response.data.message || 'OTP sent to your email!');
            setStep(2);
            setResendTimer(60); // 60 seconds timer
        } catch (err) {
            console.error('OTP Request Error:', err);
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
                email: formData.email
            });

            console.log('Resend OTP Response:', response.data);
            setSuccess('OTP resent successfully!');
            setResendTimer(60);
        } catch (err) {
            console.error('Resend OTP Error:', err);
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-otp`, {
                email: formData.email,
                otp: formData.otp
            });

            console.log('OTP Verification Response:', response.data);
            setSuccess('OTP verified successfully!');
            setStep(3);
        } catch (err) {
            console.error('OTP Verification Error:', err);
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }
        

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            console.log('Password Reset Response:', response.data);
            setSuccess('Password reset successfully!');
            setStep(4);
        } catch (err) {
            console.error('Password Reset Error:', err);
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => window.location.href = '/login'}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Login</span>
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-white text-center">
                        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={32} />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                            {step === 1 && 'Forgot Password?'}
                            {step === 2 && 'Verify OTP'}
                            {step === 3 && 'Reset Password'}
                            {step === 4 && 'Success!'}
                        </h1>
                        <p className="text-blue-100 text-sm sm:text-base">
                            {step === 1 && 'Enter your email to receive a verification code'}
                            {step === 2 && 'Enter the 6-digit code sent to your email'}
                            {step === 3 && 'Create a new password for your account'}
                            {step === 4 && 'Your password has been reset successfully'}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    {step < 4 && (
                        <div className="px-6 pt-6">
                            <div className="flex items-center justify-between mb-2">
                                {[1, 2, 3].map((num) => (
                                    <React.Fragment key={num}>
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                                            step >= num 
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                                                : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {step > num ? <CheckCircle size={20} /> : num}
                                        </div>
                                        {num < 3 && (
                                            <div className={`flex-1 h-1 mx-2 rounded ${
                                                step > num ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                                            }`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Email</span>
                                <span>Verify</span>
                                <span>Reset</span>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                <p className="text-red-700 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                <p className="text-green-700 text-sm">{success}</p>
                            </div>
                        )}

                        {/* Step 1: Email Input */}
                        {step === 1 && (
                            <div>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            className="w-full pl-10 pr-4 py-3 border-2 text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleRequestOTP}
                                    disabled={loading || !formData.email}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 text-gray-800 border-white"></div>
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        'Send OTP'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <div>
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleChange}
                                        placeholder="Enter 6-digit OTP"
                                        maxLength={6}
                                        className="w-full px-4 py-3 border-2 text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none text-center text-2xl tracking-widest font-bold"
                                        required
                                    />
                                    <p className="text-sm text-gray-500 mt-2 text-center">
                                        OTP sent to {formData.email}
                                    </p>
                                </div>

                                <button
                                    onClick={handleVerifyOTP}
                                    disabled={loading || formData.otp.length !== 6}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl mb-4"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 text-gray-800 border-white"></div>
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        onClick={handleResendOTP}
                                        disabled={loading || resendTimer > 0}
                                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {resendTimer > 0 
                                            ? `Resend OTP in ${resendTimer}s` 
                                            : 'Resend OTP'
                                        }
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="Enter new password"
                                            className="w-full pl-10 pr-12 py-3 border-2 text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Must be at least 6 characters</p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm new password"
                                            className="w-full pl-10 pr-12 py-3 border-2 text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading || !formData.newPassword || !formData.confirmPassword}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Resetting...</span>
                                        </div>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <div className="text-center py-8">
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-600" size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
                                <p className="text-gray-600 mb-8">
                                    Your password has been successfully reset. You can now login with your new password.
                                </p>
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Go to Login
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {step < 4 && (
                        <div className="bg-gray-50 px-6 py-4 text-center border-t">
                            <p className="text-sm text-gray-600">
                                Remember your password?{' '}
                                <button
                                    onClick={() => window.location.href = '/login'}
                                    className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                    Login here
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need help?{' '}
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            Contact Support
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}