'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';

const PageLayout = ({ title, subtitle, children, breadcrumbs = [] }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            <Home size={20} />
                            <span className="hidden sm:inline">Back to Home</span>
                        </button>

                        {/* Breadcrumbs */}
                        {breadcrumbs.length > 0 && (
                            <nav className="hidden md:flex items-center gap-2 text-sm">
                                {breadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {index > 0 && <span className="text-gray-400">/</span>}
                                        <button
                                            onClick={() => crumb.link && router.push(crumb.link)}
                                            className={`${
                                                crumb.link
                                                    ? 'text-blue-600 hover:underline'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {crumb.label}
                                        </button>
                                    </div>
                                ))}
                            </nav>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
                    {subtitle && <p className="text-xl text-blue-100">{subtitle}</p>}
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Company</h3>
                            <ul className="space-y-2">
                                <li><button onClick={() => router.push('/about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
                                <li><button onClick={() => router.push('/contact')} className="hover:text-blue-400 transition-colors">Contact</button></li>
                                <li><button onClick={() => router.push('/how-it-works')} className="hover:text-blue-400 transition-colors">How It Works</button></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li><button onClick={() => router.push('/faqs')} className="hover:text-blue-400 transition-colors">FAQs</button></li>
                                <li><button onClick={() => router.push('/support')} className="hover:text-blue-400 transition-colors">Help Center</button></li>
                                <li><button onClick={() => router.push('/shipping-delivery')} className="hover:text-blue-400 transition-colors">Delivery Info</button></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li><button onClick={() => router.push('/privacy-policy')} className="hover:text-blue-400 transition-colors">Privacy Policy</button></li>
                                <li><button onClick={() => router.push('/terms-and-conditions')} className="hover:text-blue-400 transition-colors">Terms & Conditions</button></li>
                                <li><button onClick={() => router.push('/refund-policy')} className="hover:text-blue-400 transition-colors">Refund Policy</button></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>📧 support@bookmarket.com</li>
                                <li>📱 +91 98765 43210</li>
                                <li>📍 Mumbai, India</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 BookMarket. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PageLayout;