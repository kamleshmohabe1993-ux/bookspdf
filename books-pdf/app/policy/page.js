'use client';

import React, { useState } from 'react';
import { ArrowLeft, Home, Shield, Lock, Eye, Database, UserCheck, Mail, Cookie, AlertCircle, CheckCircle, FileText, Globe, Users } from 'lucide-react';
import Footer from '@/components/Footer';
export default function PrivacyPolicyPage() {
    const [activeSection, setActiveSection] = useState('introduction');

    const sections = [
        {
            id: 'introduction',
            icon: <Shield size={24} />,
            title: 'Introduction',
            content: {
                text: 'At BooksPDF, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.',
                points: [
                    'We are committed to protecting your personal information',
                    'We comply with applicable data protection laws',
                    'We use industry-standard security measures',
                    'You have control over your personal data'
                ]
            }
        },
        {
            id: 'collection',
            icon: <Database size={24} />,
            title: 'Information We Collect',
            content: {
                text: 'We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from third-party sources.',
                categories: [
                    {
                        title: 'Personal Information',
                        items: [
                            'Full name and contact details',
                            'Email address and phone number',
                            'Billing and shipping address',
                            'Payment information (processed securely)',
                            'Account credentials'
                        ]
                    },
                    {
                        title: 'Usage Information',
                        items: [
                            'Books browsed and purchased',
                            'Search queries and preferences',
                            'Device information and IP address',
                            'Browser type and operating system',
                            'Pages visited and time spent'
                        ]
                    },
                    {
                        title: 'Technical Information',
                        items: [
                            'Cookies and tracking technologies',
                            'Log files and analytics data',
                            'Location data (with permission)',
                            'Device identifiers',
                            'Network information'
                        ]
                    }
                ]
            }
        },
        {
            id: 'usage',
            icon: <UserCheck size={24} />,
            title: 'How We Use Your Information',
            content: {
                text: 'We use the information we collect for various purposes to provide and improve our services.',
                purposes: [
                    {
                        title: 'Service Delivery',
                        description: 'To process transactions, deliver purchased eBooks, and provide customer support'
                    },
                    {
                        title: 'Account Management',
                        description: 'To create and manage your account, including authentication and security'
                    },
                    {
                        title: 'Communication',
                        description: 'To send order confirmations, updates, newsletters, and promotional offers'
                    },
                    {
                        title: 'Personalization',
                        description: 'To recommend books based on your preferences and browsing history'
                    },
                    {
                        title: 'Analytics',
                        description: 'To analyze usage patterns and improve our platform performance'
                    },
                    {
                        title: 'Legal Compliance',
                        description: 'To comply with legal obligations and protect our rights'
                    }
                ]
            }
        },
        {
            id: 'sharing',
            icon: <Users size={24} />,
            title: 'Information Sharing',
            content: {
                text: 'We do not sell your personal information. We may share your information only in the following circumstances:',
                scenarios: [
                    {
                        title: 'Service Providers',
                        description: 'We share information with trusted third-party service providers who assist in operating our platform (payment processors, hosting services, email providers)',
                        icon: '🔧'
                    },
                    {
                        title: 'Legal Requirements',
                        description: 'When required by law, court order, or government request, or to protect our rights and safety',
                        icon: '⚖️'
                    },
                    {
                        title: 'Business Transfers',
                        description: 'In connection with a merger, acquisition, or sale of assets, your information may be transferred',
                        icon: '🤝'
                    },
                    {
                        title: 'With Your Consent',
                        description: 'We may share information with your explicit consent for specific purposes',
                        icon: '✅'
                    }
                ]
            }
        },
        {
            id: 'security',
            icon: <Lock size={24} />,
            title: 'Data Security',
            content: {
                text: 'We implement appropriate technical and organizational security measures to protect your personal information.',
                measures: [
                    'SSL/TLS encryption for data transmission',
                    'Secure payment processing with PCI DSS compliance',
                    'Regular security audits and updates',
                    'Access controls and authentication',
                    'Data encryption at rest and in transit',
                    'Employee training on data protection',
                    'Incident response procedures',
                    'Regular backups and disaster recovery'
                ]
            }
        },
        {
            id: 'cookies',
            icon: <Cookie size={24} />,
            title: 'Cookies & Tracking',
            content: {
                text: 'We use cookies and similar tracking technologies to enhance your browsing experience.',
                types: [
                    {
                        name: 'Essential Cookies',
                        description: 'Required for basic site functionality and security',
                        canDisable: false
                    },
                    {
                        name: 'Performance Cookies',
                        description: 'Help us understand how visitors interact with our site',
                        canDisable: true
                    },
                    {
                        name: 'Functional Cookies',
                        description: 'Remember your preferences and personalize content',
                        canDisable: true
                    },
                    {
                        name: 'Marketing Cookies',
                        description: 'Track your activity to deliver relevant advertisements',
                        canDisable: true
                    }
                ],
                note: 'You can control cookies through your browser settings or our cookie consent tool.'
            }
        },
        {
            id: 'rights',
            icon: <Eye size={24} />,
            title: 'Your Privacy Rights',
            content: {
                text: 'You have certain rights regarding your personal information, subject to applicable laws.',
                rights: [
                    {
                        title: 'Access',
                        description: 'Request a copy of the personal information we hold about you',
                        icon: <FileText size={20} />
                    },
                    {
                        title: 'Correction',
                        description: 'Update or correct inaccurate or incomplete information',
                        icon: <CheckCircle size={20} />
                    },
                    {
                        title: 'Deletion',
                        description: 'Request deletion of your personal information',
                        icon: <AlertCircle size={20} />
                    },
                    {
                        title: 'Portability',
                        description: 'Receive your data in a structured, commonly used format',
                        icon: <Database size={20} />
                    },
                    {
                        title: 'Objection',
                        description: 'Object to processing of your information for certain purposes',
                        icon: <Shield size={20} />
                    },
                    {
                        title: 'Withdrawal',
                        description: 'Withdraw consent for data processing at any time',
                        icon: <UserCheck size={20} />
                    }
                ]
            }
        },
        {
            id: 'international',
            icon: <Globe size={24} />,
            title: 'International Transfers',
            content: {
                text: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.',
                points: [
                    'We use standard contractual clauses approved by regulatory authorities',
                    'Data is transferred only to countries with adequate protection',
                    'We comply with GDPR, CCPA, and other applicable regulations',
                    'Additional safeguards are implemented for sensitive data'
                ]
            }
        },
        {
            id: 'retention',
            icon: <Database size={24} />,
            title: 'Data Retention',
            content: {
                text: 'We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy.',
                periods: [
                    'Account information: Duration of account plus 7 years for legal requirements',
                    'Transaction records: 7 years for accounting and tax purposes',
                    'Marketing data: Until you withdraw consent',
                    'Technical logs: 90 days for security and troubleshooting',
                    'Support tickets: 3 years after resolution'
                ]
            }
        },
        {
            id: 'children',
            icon: <UserCheck size={24} />,
            title: 'Children\'s Privacy',
            content: {
                text: 'Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children.',
                points: [
                    'Users must be 18 years or older to create an account',
                    'If we discover we have collected information from a child, we will delete it',
                    'Parents can contact us to review or delete their child\'s information',
                    'We comply with COPPA and similar children\'s privacy laws'
                ]
            }
        },
        {
            id: 'changes',
            icon: <AlertCircle size={24} />,
            title: 'Policy Updates',
            content: {
                text: 'We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.',
                points: [
                    'We will notify you of material changes via email or website notice',
                    'The "Last Updated" date will be revised at the top of this policy',
                    'Continued use after changes constitutes acceptance',
                    'We encourage you to review this policy periodically'
                ]
            }
        },
        {
            id: 'contact',
            icon: <Mail size={24} />,
            title: 'Contact Us',
            content: {
                text: 'If you have questions or concerns about this Privacy Policy or our data practices, please contact us:',
                contactInfo: [
                    { label: 'Email', value: 'contact@booksnpdf.com', icon: <Mail size={20} /> },
                    { label: 'Phone', value: '+91 98765 43210', icon: '📞' },
                    { label: 'Address', value: '123 Book Street, Mumbai, Maharashtra 400069, India', icon: '📍' },
                    { label: 'Response Time', value: 'We aim to respond within 48 hours', icon: '⏱️' }
                ]
            }
        }
    ];

    const quickLinks = [
        { label: 'Terms of Service', url: '/terms-and-conditions' },
        // { label: 'Cookie Policy', url: '/cookies' },
        { label: 'Refund Policy', url: '/refund-policy' },
        { label: 'Contact Support', url: '/contact' }
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
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Privacy Policy</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 sm:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <Shield size={48} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">Privacy Policy</h2>
                    <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
                        Your privacy is important to us. Learn how we collect, use, and protect your information.
                    </p>
                    <p className="text-sm text-blue-200 mt-4">
                        Last Updated: December 4, 2024
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-4 sticky top-24">
                            <h3 className="font-bold text-gray-900 mb-4 text-sm sm:text-base">Quick Navigation</h3>
                            <nav className="space-y-2">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all text-sm ${
                                            activeSection === section.id
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className={activeSection === section.id ? 'text-white' : 'text-blue-600'}>
                                            {section.icon}
                                        </span>
                                        <span className="font-medium">{section.title}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                            {sections.map((section) => (
                                <div
                                    key={section.id}
                                    className={activeSection === section.id ? 'block' : 'hidden'}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl">
                                            <div className="text-blue-600">
                                                {React.cloneElement(section.icon, { size: 32 })}
                                            </div>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{section.title}</h2>
                                    </div>

                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 text-base sm:text-lg mb-6 leading-relaxed">
                                            {section.content.text}
                                        </p>

                                        {/* Points */}
                                        {section.content.points && (
                                            <div className="space-y-3 mb-6">
                                                {section.content.points.map((point, index) => (
                                                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                        <CheckCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                                        <span className="text-gray-700 text-sm sm:text-base">{point}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Categories */}
                                        {section.content.categories && (
                                            <div className="space-y-6 mb-6">
                                                {section.content.categories.map((category, index) => (
                                                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                                                        <h4 className="font-bold text-lg text-gray-900 mb-3">{category.title}</h4>
                                                        <ul className="space-y-2">
                                                            {category.items.map((item, idx) => (
                                                                <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                                                                    <span className="text-blue-600 mt-1">•</span>
                                                                    <span>{item}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Purposes */}
                                        {section.content.purposes && (
                                            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                                {section.content.purposes.map((purpose, index) => (
                                                    <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-lg">
                                                        <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{purpose.title}</h4>
                                                        <p className="text-gray-600 text-xs sm:text-sm">{purpose.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Scenarios */}
                                        {section.content.scenarios && (
                                            <div className="space-y-4 mb-6">
                                                {section.content.scenarios.map((scenario, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-2xl flex-shrink-0">{scenario.icon}</span>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{scenario.title}</h4>
                                                                <p className="text-gray-600 text-xs sm:text-sm">{scenario.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Measures */}
                                        {section.content.measures && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                                                <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Security Measures:</h4>
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    {section.content.measures.map((measure, index) => (
                                                        <div key={index} className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm">
                                                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                                                            <span>{measure}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cookie Types */}
                                        {section.content.types && (
                                            <div className="space-y-3 mb-6">
                                                {section.content.types.map((type, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{type.name}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                                type.canDisable 
                                                                    ? 'bg-blue-100 text-blue-700' 
                                                                    : 'bg-gray-200 text-gray-700'
                                                            }`}>
                                                                {type.canDisable ? 'Optional' : 'Required'}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 text-xs sm:text-sm">{type.description}</p>
                                                    </div>
                                                ))}
                                                {section.content.note && (
                                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                                                        <p className="text-gray-700 text-xs sm:text-sm flex items-start gap-2">
                                                            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
                                                            <span>{section.content.note}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Rights */}
                                        {section.content.rights && (
                                            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                                {section.content.rights.map((right, index) => (
                                                    <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="text-purple-600">
                                                                {right.icon}
                                                            </div>
                                                            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{right.title}</h4>
                                                        </div>
                                                        <p className="text-gray-600 text-xs sm:text-sm">{right.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Retention Periods */}
                                        {section.content.periods && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                                <h4 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">Retention Periods:</h4>
                                                <ul className="space-y-3">
                                                    {section.content.periods.map((period, index) => (
                                                        <li key={index} className="flex items-start gap-3 text-gray-700 text-xs sm:text-sm">
                                                            <Database className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                                                            <span>{period}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Contact Info */}
                                        {section.content.contactInfo && (
                                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                                                <div className="space-y-4">
                                                    {section.content.contactInfo.map((info, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <div className="text-2xl flex-shrink-0">
                                                                {typeof info.icon === 'string' ? info.icon : info.icon}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-gray-900 text-sm">{info.label}</p>
                                                                <p className="text-gray-700 text-sm sm:text-base">{info.value}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Links */}
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Related Policies</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {quickLinks.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => window.location.href = link.url}
                                className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <Mail className="mx-auto mb-4" size={48} />
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Questions About Your Privacy?</h3>
                    <p className="text-blue-100 text-base sm:text-lg mb-8">
                        Our privacy team is here to help you understand how we protect your data
                    </p>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg text-sm sm:text-base"
                    >
                        Contact Privacy Team
                    </button>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}