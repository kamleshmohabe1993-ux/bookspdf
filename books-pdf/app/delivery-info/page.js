'use client';

import React, { useState } from 'react';
import { ArrowLeft, Home, Download, Mail, Clock, CheckCircle, AlertCircle, HelpCircle, Zap, Shield, RefreshCw, FileText, Smartphone, Laptop } from 'lucide-react';

export default function DeliveryInfoPage() {
    const [activeTab, setActiveTab] = useState('instant');

    const deliverySteps = [
        {
            icon: <CheckCircle className="text-green-600" size={32} />,
            title: 'Complete Payment',
            description: 'Securely complete your purchase using any payment method',
            time: '30 seconds'
        },
        {
            icon: <Mail className="text-blue-600" size={32} />,
            title: 'Receive Email',
            description: 'Get instant confirmation email with download details',
            time: 'Immediate'
        },
        {
            icon: <Download className="text-purple-600" size={32} />,
            title: 'Download Books',
            description: 'Access your purchased eBooks from email or dashboard',
            time: 'Instant Access'
        },
        {
            icon: <FileText className="text-orange-600" size={32} />,
            title: 'Start Reading',
            description: 'Open your PDF on any device and enjoy reading',
            time: 'Anytime'
        }
    ];

    const faqs = [
        {
            question: 'How quickly will I receive my eBook?',
            answer: 'Immediately! After payment confirmation, you\'ll receive an email with download links within seconds. You can also access your books instantly from your account dashboard.'
        },
        {
            question: 'What if I don\'t receive the download email?',
            answer: 'First, check your spam/junk folder. If you still don\'t see it, log into your account dashboard where all your purchases are available. You can also contact our support team for immediate assistance.'
        },
        {
            question: 'Can I download my eBook multiple times?',
            answer: 'Yes! You can download your purchased eBooks unlimited times from your account dashboard. Your purchases never expire.'
        },
        {
            question: 'What format are the eBooks delivered in?',
            answer: 'All our eBooks are delivered in PDF format, which is compatible with virtually all devices including computers, tablets, smartphones, and e-readers.'
        },
        {
            question: 'Can I access my books on multiple devices?',
            answer: 'Absolutely! Once purchased, you can download and read your eBooks on as many devices as you like. There are no device restrictions.'
        },
        {
            question: 'What if the download link expires?',
            answer: 'Download links in emails may expire after 7 days for security, but your books remain permanently accessible in your account dashboard.'
        }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
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
                        <h1 className="text-lg sm:text-2xl font-bold items-center text-gray-900">Delivery Information</h1>
                        {/* <div className="w-20"></div> */}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <Zap size={48} className="text-yellow-300" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Instant Digital Delivery</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto px-4">
                        No waiting, no shipping fees! Get your eBooks delivered instantly to your email and account within seconds of purchase.
                    </p>
                </div>
            </div>

            {/* Key Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Zap className="text-green-600" size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Instant Access</h3>
                        <p className="text-gray-600 text-sm">Download immediately after payment</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="text-blue-600" size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">100% Secure</h3>
                        <p className="text-gray-600 text-sm">Protected payment & download links</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <RefreshCw className="text-purple-600" size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Unlimited Downloads</h3>
                        <p className="text-gray-600 text-sm">Re-download anytime from dashboard</p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How Digital Delivery Works</h2>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                        Getting your eBooks is quick and simple. Here&apos;s what happens after you purchase:
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {deliverySteps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
                                        {step.icon}
                                    </div>
                                    <span className="text-3xl font-bold text-gray-200">{index + 1}</span>
                                </div>
                                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                                <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
                                    <Clock size={16} />
                                    <span>{step.time}</span>
                                </div>
                            </div>
                            {index < deliverySteps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                    <div className="text-blue-300 text-3xl">→</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Delivery Methods */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Two Ways to Access Your Books</h2>
                        <p className="text-gray-600 text-base sm:text-lg">Choose the method that works best for you</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Email Delivery */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                <Mail className="text-blue-600" size={32} />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Email Delivery</h3>
                            <p className="text-gray-600 mb-6">
                                Receive instant download links directly to your registered email address
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Instant email notification</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Direct download links</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Purchase receipt included</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Valid for 7 days</span>
                                </li>
                            </ul>
                        </div>

                        {/* Dashboard Access */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border-2 border-purple-200">
                            <div className="flex items-center justify-between mb-6">
                                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center">
                                    <Download className="text-purple-600" size={32} />
                                </div>
                                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">RECOMMENDED</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-4">Account Dashboard</h3>
                            <p className="text-gray-600 mb-6">
                                Access all your purchased books anytime from your personal library
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Permanent access - Never expires</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Unlimited re-downloads</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Organized library view</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">Access from any device</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Device Compatibility */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-white">
                    <div className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Read on Any Device</h2>
                        <p className="text-blue-100 text-base sm:text-lg">Our PDF books work perfectly on all your devices</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <Laptop className="mx-auto mb-3" size={40} />
                            <h4 className="font-bold mb-2">Desktop</h4>
                            <p className="text-sm text-blue-100">Windows, Mac, Linux</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <Smartphone className="mx-auto mb-3" size={40} />
                            <h4 className="font-bold mb-2">Mobile</h4>
                            <p className="text-sm text-blue-100">iOS & Android phones</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <FileText className="mx-auto mb-3" size={40} />
                            <h4 className="font-bold mb-2">Tablets</h4>
                            <p className="text-sm text-blue-100">iPad, Android tablets</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                            <Download className="mx-auto mb-3" size={40} />
                            <h4 className="font-bold mb-2">E-Readers</h4>
                            <p className="text-sm text-blue-100">Kindle, Nook, Kobo</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQs */}
            <div className="bg-gray-50 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-600 text-base sm:text-lg">Everything you need to know about digital delivery</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <HelpCircle className="text-blue-600 flex-shrink-0" size={24} />
                                        <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                                    </div>
                                    <div className={`transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </div>
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-4 text-gray-600 text-sm sm:text-base">
                                        <div className="pl-9">{faq.answer}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Important Notes */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Important Notes</h3>
                            <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                                <li>• Check your spam/junk folder if you don&apos;t receive the email within 5 minutes</li>
                                <li>• Ensure your email address is correct during checkout</li>
                                <li>• Download links in emails expire after 7 days, but books remain in your dashboard forever</li>
                                <li>• Contact support immediately if you experience any download issues</li>
                                <li>• We recommend saving downloaded files to your device or cloud storage</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Need Help?</h3>
                    <p className="text-blue-100 text-base sm:text-lg mb-8">
                        Our support team is here to assist you 24/7
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg text-sm sm:text-base"
                        >
                            Contact Support
                        </button>
                        <button
                            onClick={() => window.location.href = '/faqs'}
                            className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg text-sm sm:text-base"
                        >
                            View All FAQs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}