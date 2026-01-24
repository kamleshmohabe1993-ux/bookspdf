'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import showToast from '@/lib/toast';
import { X, FileText, CheckCircle, AlertCircle, Shield, Lock, Eye, Download } from 'lucide-react';
export default function RegisterPage({isOpen, onClose, onAccept, businessName = "BooksnPDF"}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber:'',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleScroll = (e) => {
    const element = e.target;
    const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 10;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

const handleAccept = () => {
    if (agreedToTerms && agreedToPrivacy && hasScrolledToBottom) {
      if (typeof onAccept === 'function') {
        onAccept();
        onClose();
      }
      if (typeof onClose === 'function') {
        onClose();
      }
    }
  };

  const canAccept = agreedToTerms && agreedToPrivacy && hasScrolledToBottom;

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/profile');
    }
  }, [router]);

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }
    if (password.length < 6) {
      setPasswordStrength('weak');
    } else if (password.length < 10) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');

    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.mobileNumber.length >= 10 && formData.mobileNumber.length < 11) {
      setError('Mobile number must be 10 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        password: formData.password
      });
      // Store token
      localStorage.setItem('token', response.data.token);
      showToast.success('User Creted Successfully!');
      // Redirect to dashboard
      if(response){
        router.push('/');
      }
    } catch (error) {
      setError(error.response?.data?.message);
      showToast.error('User Not Created!');
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return 'w-1/3';
      case 'medium': return 'w-2/3';
      case 'strong': return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Back to Home Link */}
        <div className="text-center mb-4">
          <Link
            href="/"
            className="text-white hover:text-gray-200 text-sm font-medium inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-md font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your Fullname!"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-md font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="mobileNumber" className="block text-md font-medium text-gray-700 mb-2">
                Mob No.
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 5z"
                  />
                </svg>
                </div>
                <input
                  type="string"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="08978689054"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-md font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength:</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'weak' ? 'text-red-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()} ${getPasswordStrengthWidth()}`}></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-md font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Checkbox Section */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                required
              />

              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="text-indigo-600 hover:text-indigo-500 underline"
                >
                  Terms and Conditions
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          {/* Modal */}
          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white/20 p-3 rounded-lg">
                            <FileText size={28} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold">Terms & Conditions</h2>
                            <p className="text-white/90 text-sm">Please read carefully before proceeding</p>
                          </div>
                          <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            aria-label="Close"
                          >
                            <X size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
            
                    {/* Scroll Indicator */}
                    {!hasScrolledToBottom && (
                      <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3 flex items-center gap-2">
                        <AlertCircle size={18} className="text-yellow-600 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                          Please scroll down to read all terms and conditions
                        </p>
                      </div>
                    )}
            
                    {/* Content */}
                    <div 
                      className="flex-1 overflow-y-auto p-6 space-y-6"
                      onScroll={handleScroll}
                    >
                      {/* Last Updated */}
                      <div className="text-sm text-gray-600 italic">
                        Last Updated: January 24, 2026
                      </div>
            
                      {/* Introduction */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle size={20} className="text-blue-600" />
                          1. Introduction & Acceptance
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p>
                            Welcome to {businessName}. By creating an account and using our services, you agree to be bound by these Terms and Conditions.
                          </p>
                          <p>
                            These terms constitute a legally binding agreement between you and {businessName}. If you do not agree to these terms, please do not register or use our services.
                          </p>
                        </div>
                      </section>
            
                      {/* User Account */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Lock size={20} className="text-blue-600" />
                          2. User Account & Registration
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p className="font-semibold">2.1 Account Creation</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>You must be at least 18 years old to create an account</li>
                            <li>You must provide accurate and complete information</li>
                            <li>You are responsible for maintaining the confidentiality of your password</li>
                            <li>You are responsible for all activities under your account</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">2.2 Account Security</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Keep your login credentials secure and confidential</li>
                            <li>Notify us immediately of any unauthorized access</li>
                            <li>We are not liable for losses due to unauthorized account use</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Content & Licenses */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Download size={20} className="text-blue-600" />
                          3. Digital Content & Licenses
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p className="font-semibold">3.1 Content Access</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>All eBooks and digital content are licensed, not sold</li>
                            <li>You receive a non-exclusive, non-transferable license to use the content</li>
                            <li>Content is for personal, non-commercial use only</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">3.2 Restrictions</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Do not copy, distribute, or share purchased content</li>
                            <li>Do not resell or commercially exploit any content</li>
                            <li>Do not remove copyright or watermarks from content</li>
                            <li>Do not use content for AI training or data scraping</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">3.3 Download Limits</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Each purchase allows a limited number of downloads (typically 3-5)</li>
                            <li>Downloads expire after 30 days from purchase date</li>
                            <li>Contact support for re-download requests after expiry</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Payments & Refunds */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield size={20} className="text-blue-600" />
                          4. Payments, Pricing & Refunds
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p className="font-semibold">4.1 Pricing</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>All prices are in Indian Rupees (INR) unless stated otherwise</li>
                            <li>Prices may change without notice</li>
                            <li>Your payment amount is locked at checkout</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">4.2 Payment Processing</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>We use PhonePe and other secure payment gateways</li>
                            <li>Your payment information is processed securely</li>
                            <li>We do not store credit card information</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">4.3 Refund Policy</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Digital products are generally non-refundable after download</li>
                            <li>Refunds may be issued for technical issues preventing access</li>
                            <li>Refund requests must be made within 7 days of purchase</li>
                            <li>Refunds are processed within 7-10 business days</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Privacy & Data */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Eye size={20} className="text-blue-600" />
                          5. Privacy & Data Protection
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p className="font-semibold">5.1 Information Collection</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>We collect personal information you provide during registration</li>
                            <li>We collect usage data to improve our services</li>
                            <li>Payment information is handled by our payment processors</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">5.2 Data Usage</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Your data is used to provide and improve our services</li>
                            <li>We may send promotional emails (you can unsubscribe anytime)</li>
                            <li>We will never sell your personal information to third parties</li>
                          </ul>
                          
                          <p className="font-semibold mt-3">5.3 Data Security</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>We use industry-standard encryption and security measures</li>
                            <li>We cannot guarantee 100% security of data transmission</li>
                            <li>You are responsible for maintaining your password security</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Prohibited Activities */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertCircle size={20} className="text-red-600" />
                          6. Prohibited Activities
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p>You agree NOT to:</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Violate any laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Share or distribute copyrighted content</li>
                            <li>Attempt to hack, breach, or compromise our systems</li>
                            <li>Use automated systems (bots, scrapers) on our platform</li>
                            <li>Create multiple accounts to abuse promotions</li>
                            <li>Engage in fraudulent payment activities</li>
                            <li>Harass or abuse other users or our staff</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Intellectual Property */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          7. Intellectual Property Rights
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p>
                            All content, including but not limited to eBooks, images, logos, text, and software, is protected by copyright and other intellectual property laws.
                          </p>
                          <p>
                            The {businessName} trademark, logo, and all related marks are our property. You may not use them without written permission.
                          </p>
                        </div>
                      </section>
            
                      {/* Termination */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          8. Account Termination
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p className="font-semibold">8.1 By You</p>
                          <p>You may close your account at any time by contacting our support team.</p>
                          
                          <p className="font-semibold mt-3">8.2 By Us</p>
                          <p>We reserve the right to suspend or terminate accounts that:</p>
                          <ul className="list-disc ml-5 space-y-1">
                            <li>Violate these Terms and Conditions</li>
                            <li>Engage in fraudulent activities</li>
                            <li>Abuse our refund policy</li>
                            <li>Distribute copyrighted content illegally</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Limitation of Liability */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          9. Limitation of Liability
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p>
                            To the maximum extent permitted by law, {businessName} shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                          </p>
                          <p>
                            Our total liability to you for any claims shall not exceed the amount you paid to us in the 12 months preceding the claim.
                          </p>
                        </div>
                      </section>
            
                      {/* Changes to Terms */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          10. Changes to Terms
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p>
                            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting.
                          </p>
                          <p>
                            Continued use of our services after changes constitutes acceptance of the modified terms.
                          </p>
                          <p>
                            We will notify users of significant changes via email or platform notification.
                          </p>
                        </div>
                      </section>
            
                      {/* Governing Law */}
                      <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          11. Governing Law & Jurisdiction
                        </h3>
                        <div className="text-gray-700 space-y-2 ml-7">
                          <p>
                            These Terms and Conditions are governed by the laws of India.
                          </p>
                          <p>
                            Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your City], India.
                          </p>
                        </div>
                      </section>
            
                      {/* Contact */}
                      <section className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          12. Contact Information
                        </h3>
                        <div className="text-gray-700 space-y-2">
                          <p>For questions about these Terms and Conditions, please contact us:</p>
                          <ul className="space-y-1">
                            <li>📧 Email: contact@booksnpdf.com</li>
                            <li>📞 Phone: +91 7999742458</li>
                          </ul>
                        </div>
                      </section>
            
                      {/* Scroll to bottom indicator */}
                      {!hasScrolledToBottom && (
                        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 text-center">
                          <div className="animate-bounce text-blue-600">
                            <p className="text-sm font-semibold">↓ Scroll down to continue ↓</p>
                          </div>
                        </div>
                      )}
                    </div>
            
                    {/* Footer - Checkboxes & Accept */}
                    <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl">
                      {/* Checkboxes */}
                      <div className="space-y-3 mb-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            disabled={!hasScrolledToBottom}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className={`text-sm ${hasScrolledToBottom ? 'text-gray-900' : 'text-gray-400'}`}>
                            I have read and agree to the <strong>Terms and Conditions</strong>
                          </span>
                        </label>
            
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={agreedToPrivacy}
                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                            disabled={!hasScrolledToBottom}
                            className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className={`text-sm ${hasScrolledToBottom ? 'text-gray-900' : 'text-gray-400'}`}>
                            I acknowledge the <strong>Privacy Policy</strong> and consent to data collection as described
                          </span>
                        </label>
                      </div>
            
                      {/* Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => setOpen(false)}
                          disabled={!canAccept}
                          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                            canAccept
                              ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {canAccept ? (
                            <>
                              <CheckCircle size={20} />
                              Accept & Continue
                            </>
                          ) : (
                            <>
                              <AlertCircle size={20} />
                              Read & Check All
                            </>
                          )}
                        </button>
                      </div>
            
                      {!hasScrolledToBottom && (
                        <p className="text-xs text-center text-gray-500 mt-3">
                          Please scroll to the bottom to enable acceptance
                        </p>
                      )}
                    </div>
                  </div>
                </div>
          )}
          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}