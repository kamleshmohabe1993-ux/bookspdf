'use client';

import React, { useState } from 'react';
import { ArrowLeft, Home, Search, ShoppingCart, CreditCard, Download, BookOpen, User, Mail, Lock, Star, Clock, CheckCircle, PlayCircle, FileText, Smartphone, Shield, RefreshCw } from 'lucide-react';
import Footer from '@/components/Footer'
export default function HowItWorksPage() {
    const [activeProcess, setActiveProcess] = useState('browse');

    const mainSteps = [
        {
            id: 'browse',
            icon: <Search size={48} />,
            title: 'Browse & Discover',
            subtitle: 'Find Your Perfect Book',
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-100',
            textColor: 'text-blue-600',
            description: 'Explore our vast collection of eBooks across multiple categories',
            steps: [
                'Use the search bar to find specific titles or authors',
                'Browse by categories like Fiction, Business, Technology, etc.',
                'Filter by price, ratings, and popularity',
                'Read detailed descriptions and preview samples',
                'Check ratings and reviews from other readers'
            ]
        },
        {
            id: 'select',
            icon: <ShoppingCart size={48} />,
            title: 'Select & Add to Cart',
            subtitle: 'Build Your Library',
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-100',
            textColor: 'text-green-600',
            description: 'Choose your books and add them to your shopping cart',
            steps: [
                'Click "Add to Cart" on any book you like',
                'Continue shopping or proceed to checkout',
                'Review your cart and apply discount codes',
                'See total price with any applicable discounts',
                'Remove or update quantities if needed'
            ]
        },
        {
            id: 'payment',
            icon: <CreditCard size={48} />,
            title: 'Secure Payment',
            subtitle: 'Safe & Easy Checkout',
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-100',
            textColor: 'text-purple-600',
            description: 'Complete your purchase with our secure payment system',
            steps: [
                'Choose from multiple payment options (Card, UPI, Wallets)',
                'Enter payment details in encrypted checkout',
                'Review order summary before confirming',
                'Get instant payment confirmation',
                'Receive purchase receipt via email'
            ]
        },
        {
            id: 'download',
            icon: <Download size={48} />,
            title: 'Instant Download',
            subtitle: 'Get Your Books Immediately',
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-600',
            description: 'Access your purchased eBooks instantly after payment',
            steps: [
                'Receive download link via email immediately',
                'Access books from your account dashboard',
                'Download to any device (computer, tablet, phone)',
                'No waiting period - instant access',
                'Keep forever - unlimited re-downloads'
            ]
        },
        {
            id: 'read',
            icon: <BookOpen size={48} />,
            title: 'Read & Enjoy',
            subtitle: 'Start Your Reading Journey',
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-100',
            textColor: 'text-red-600',
            description: 'Enjoy reading your books on any device, anytime, anywhere',
            steps: [
                'Open PDF files on any device or e-reader',
                'Read offline - no internet required',
                'Use built-in PDF features (bookmarks, highlights)',
                'Sync across devices via cloud storage',
                'Access your entire library anytime from dashboard'
            ]
        }
    ];

    const features = [
        {
            icon: <Clock className="text-blue-600" size={32} />,
            title: 'Instant Access',
            description: 'Download your books immediately after purchase'
        },
        {
            icon: <Shield className="text-green-600" size={32} />,
            title: 'Secure Payments',
            description: 'Protected transactions with industry-standard encryption'
        },
        {
            icon: <RefreshCw className="text-purple-600" size={32} />,
            title: 'Unlimited Downloads',
            description: 'Re-download your books anytime from your account'
        },
        {
            icon: <Smartphone className="text-orange-600" size={32} />,
            title: 'Any Device',
            description: 'Read on computers, tablets, phones, and e-readers'
        },
        {
            icon: <FileText className="text-red-600" size={32} />,
            title: 'PDF Format',
            description: 'Universal format compatible with all devices'
        },
        {
            icon: <Star className="text-yellow-600" size={32} />,
            title: 'Quality Content',
            description: 'Curated collection of high-quality eBooks'
        }
    ];

    const accountBenefits = [
        'Personal library of all purchased books',
        'Order history and invoices',
        'Unlimited re-downloads',
        'Wishlist to save books for later',
        'Exclusive member discounts',
        'Early access to new releases',
        'Personalized recommendations'
    ];

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
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">How It Works</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <PlayCircle size={48} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simple. Fast. Secure.</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto px-4">
                        Get access to thousands of eBooks in just a few clicks. Here&apos;s how our platform makes reading easier than ever.
                    </p>
                </div>
            </div>

            {/* Quick Overview Timeline */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-16 pb-12 sm:pb-16">
                <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8">
                        {mainSteps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <button
                                    onClick={() => setActiveProcess(step.id)}
                                    className={`flex-1 w-full lg:w-auto transition-all ${
                                        activeProcess === step.id ? 'scale-105' : 'opacity-60 hover:opacity-80'
                                    }`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`${step.bgColor} p-4 rounded-full mb-3 transition-transform ${
                                            activeProcess === step.id ? 'scale-110' : ''
                                        }`}>
                                            <div className={step.textColor}>
                                                {step.icon}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-sm sm:text-base text-gray-900">{step.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                                    </div>
                                </button>
                                {index < mainSteps.length - 1 && (
                                    <div className="hidden lg:block text-gray-300 text-2xl">→</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {mainSteps.map((step) => (
                    <div
                        key={step.id}
                        className={`transition-all duration-500 ${
                            activeProcess === step.id ? 'block' : 'hidden'
                        }`}
                    >
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className={`bg-gradient-to-r ${step.color} p-6 sm:p-10 text-white`}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                        {step.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{step.title}</h2>
                                        <p className="text-lg text-white/90 mt-1">{step.subtitle}</p>
                                    </div>
                                </div>
                                <p className="text-base sm:text-lg text-white/90">{step.description}</p>
                            </div>
                            
                            <div className="p-6 sm:p-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Step-by-Step Guide:</h3>
                                <div className="space-y-4">
                                    {step.steps.map((stepDetail, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className={`${step.bgColor} ${step.textColor} w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-700 text-sm sm:text-base pt-1">{stepDetail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Key Features Grid */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose BooksPDF?</h2>
                        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                            Experience the best features designed for book lovers
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Account Benefits */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div>
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            <User className="text-blue-600" size={32} />
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                            Create Your Free Account
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg mb-6">
                            Sign up for free and unlock exclusive benefits that enhance your reading experience.
                        </p>
                        <button
                            onClick={() => window.location.href = '/register'}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                        >
                            Get Started Free
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Member Benefits:</h3>
                        <div className="space-y-4">
                            {accountBenefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                                    <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Security & Privacy */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-white text-center">
                        <div>
                            <Lock className="mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
                            <p className="text-blue-100 text-sm">
                                All payments protected with SSL encryption
                            </p>
                        </div>
                        <div>
                            <Mail className="mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-bold mb-2">Privacy Protected</h3>
                            <p className="text-blue-100 text-sm">
                                Your data is safe and never shared with third parties
                            </p>
                        </div>
                        <div>
                            <Shield className="mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-bold mb-2">Money-Back Guarantee</h3>
                            <p className="text-blue-100 text-sm">
                                30-day refund policy if you&apos;re not satisfied
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Tutorial Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl sm:rounded-3xl p-6 sm:p-12 text-center">
                    <PlayCircle className="mx-auto text-purple-600 mb-6" size={64} />
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Watch Our Quick Tutorial
                    </h2>
                    <p className="text-gray-700 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                        See how easy it is to browse, purchase, and download books from BooksPDF in under 2 minutes.
                    </p>
                    <button
                        onClick={() => alert('Video tutorial coming soon!')}
                        className="px-8 py-4 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base inline-flex items-center gap-2"
                    >
                        <PlayCircle size={20} />
                        Watch Tutorial
                    </button>
                </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
                    <p className="text-gray-600 text-base sm:text-lg">We&apos;re here to help you get started</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => window.location.href = '/faqs'}
                        className="px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-semibold hover:bg-blue-200 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                        📚 View FAQs
                    </button>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-semibold hover:bg-purple-200 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                        💬 Contact Support
                    </button>
                    <button
                        onClick={() => window.location.href = '/delivery-info'}
                        className="px-6 py-3 bg-green-100 text-green-700 rounded-full font-semibold hover:bg-green-200 transition-all shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                        📦 Delivery Info
                    </button>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Ready to Start Reading?</h3>
                    <p className="text-blue-100 text-base sm:text-lg mb-8">
                        Join thousands of happy readers and build your digital library today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = '/browse'}
                            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg text-sm sm:text-base"
                        >
                            Browse Books
                        </button>
                        <button
                            onClick={() => window.location.href = '/register'}
                            className="px-8 py-4 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg text-sm sm:text-base"
                        >
                            Sign Up Free
                        </button>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}