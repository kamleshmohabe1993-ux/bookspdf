'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, ArrowLeft, Home } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitting(false);
            
            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
            {/* Header/Breadcrumb */}
            <Header></Header>
            {/* <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline">Back to Home</span>
                            <Home size={20} className="sm:hidden" />
                        </button>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Contact Us</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </div> */}

            {/* Hero Section */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Get In Touch</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto px-4">
                        We&apos;re here to help! Reach out anytime and we&apos;ll get back to you within 24 hours
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-8 z-50 max-w-md">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
                        <div className="shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold">Message Sent!</p>
                            <p className="text-sm">We&apos;ll respond within 24 hours.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Information */}
                    <div className="order-2 lg:order-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Contact Information</h2>
                            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
                                Have a question or need assistance? Our support team is ready to help you with any inquiries.
                            </p>

                            <div className="space-y-4 sm:space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors">
                                    <div className="bg-blue-100 p-2 sm:p-3 rounded-lg shrink-0">
                                        <Mail className="text-blue-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold mb-1 text-sm text-gray-800 sm:text-base">Email Us</h3>
                                        <p className="text-gray-600 text-sm sm:text-base break-all">contact@booksnpdf.com</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">We&apos;ll respond within 24 hours</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl hover:bg-green-50 transition-colors">
                                    <div className="bg-green-100 p-2 sm:p-3 rounded-lg shrink-0">
                                        <Phone className="text-green-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold mb-1 text-sm text-gray-800 sm:text-base">Call Us</h3>
                                        <p className="text-gray-600 text-sm sm:text-base">+91 98765 43210</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Mon-Sat, 9AM-6PM IST</p>
                                    </div>
                                </div>

                                {/* Live Chat */}
                                {/* <div className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl hover:bg-purple-50 transition-colors">
                                    <div className="bg-purple-100 p-2 sm:p-3 rounded-lg shrink-0">
                                        <MessageCircle className="text-purple-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold mb-1 text-sm text-gray-800 sm:text-base">Live Chat</h3>
                                        <p className="text-gray-600 text-sm sm:text-base">Available on our website</p>
                                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Instant support during business hours</p>
                                    </div>
                                </div> */}

                                {/* Address */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors">
                                    <div className="bg-orange-100 p-2 sm:p-3 rounded-lg shrink-0">
                                        <MapPin className="text-orange-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold mb-1 text-sm text-gray-800 sm:text-base">Office Address</h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                            123 Book Street, Andheri East<br />
                                            Mumbai, Maharashtra 400069<br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 rounded-xl hover:bg-red-50 transition-colors">
                                    <div className="bg-red-100 p-2 sm:p-3 rounded-lg shrink-0">
                                        <Clock className="text-red-600" size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold mb-1 text-sm text-gray-800 sm:text-base">Business Hours</h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                            Monday - Friday: 9:00 AM - 6:00 PM<br />
                                            Saturday: 10:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="order-1 lg:order-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Send Us a Message</h2>
                            <div className="space-y-4 sm:space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        Your Name <span className="text-red-500 ">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 text-sm sm:text-base border-2 text-gray-800 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 text-sm sm:text-base border-2 text-gray-700 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 text-sm sm:text-base border-2 text-gray-700 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none bg-white"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="payment">Payment Issue</option>
                                        <option value="download">Download Problem</option>
                                        <option value="refund">Refund Request</option>
                                        <option value="technical">Technical Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 text-sm sm:text-base border-2 text-gray-700 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none"
                                        placeholder="Tell us how we can help you..."
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className={`w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 transition-all ${
                                        submitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                                    }`}
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-xs sm:text-sm text-gray-500 text-center">
                                    We typically respond within 24 hours during business days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Quick Links */}
                <div className="mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-gray-900">
                        Looking for Quick Answers?
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <button
                            onClick={() => window.location.href = '/faqs'}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        >
                            📚 View FAQs
                        </button>
                        <button
                            onClick={() => window.location.href = '/how-it-works'}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-100 text-purple-700 rounded-full font-semibold hover:bg-purple-200 transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        >
                            ⚙️ How It Works
                        </button>
                        <button
                            onClick={() => window.location.href = '/support'}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition-all text-sm sm:text-base shadow-sm hover:shadow-md"
                        >
                            💬 Help Center
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                        Still Have Questions?
                    </h3>
                    <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-6 sm:mb-8">
                        Our customer support team is available to help you anytime
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = 'tel:+919876543210'}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg text-sm sm:text-base"
                        >
                            📞 Call Now
                        </button>
                        <button
                            onClick={() => window.location.href = 'mailto:support@bookmarket.com'}
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg text-sm sm:text-base"
                        >
                            ✉️ Email Us
                        </button>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}