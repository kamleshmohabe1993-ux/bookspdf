'use client';

import { useRouter } from 'next/navigation';
import { Book, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        company: [
            { label: 'About Us', path: '/about' },
            { label: 'Contact', path: '/contact' },
            { label: 'How It Works', path: '/how-it-works' },
        ],
        support: [
            { label: 'FAQs', path: '/faqs' },
            { label: 'Help Center', path: '/support' },
            { label: 'Delivery Info', path: '/shipping-delivery' },
        ],
        legal: [
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms & Conditions', path: '/terms-and-conditions' },
            { label: 'Refund Policy', path: '/refund-policy' },
        ]
    };

    const socialLinks = [
        { icon: Facebook, url: '#', label: 'Facebook', color: 'hover:text-blue-600' },
        { icon: Twitter, url: '#', label: 'Twitter', color: 'hover:text-sky-500' },
        { icon: Instagram, url: '#', label: 'Instagram', color: 'hover:text-pink-600' },
        { icon: Linkedin, url: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
        { icon: Youtube, url: '#', label: 'YouTube', color: 'hover:text-red-600' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Book className="text-blue-400" size={32} />
                            <span className="text-2xl font-bold">BookMarket</span>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Your trusted destination for premium eBooks. Discover, learn, and grow with thousands of quality digital books.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2 bg-gray-800 rounded-full transition-colors ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => router.push(link.path)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.path}>
                                    <button
                                        onClick={() => router.push(link.path)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-start gap-2">
                                <Mail className="flex-shrink-0 mt-1" size={18} />
                                <a href="mailto:support@bookmarket.com" className="hover:text-white transition-colors">
                                    support@bookmarket.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <Phone className="flex-shrink-0 mt-1" size={18} />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                                    +91 98765 43210
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="flex-shrink-0 mt-1" size={18} />
                                <span>Mumbai, Maharashtra, India</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} BookMarket. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                            {footerLinks.legal.map((link, index) => (
                                <span key={link.path} className="flex items-center gap-4">
                                    <button
                                        onClick={() => router.push(link.path)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </button>
                                    {index < footerLinks.legal.length - 1 && (
                                        <span className="text-gray-700">|</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <p className="text-gray-400 text-sm">
                            Made with ❤️ in India
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;