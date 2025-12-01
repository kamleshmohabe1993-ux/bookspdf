'use client';

import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { ChevronDown, ChevronUp, Search, HelpCircle, ArrowLeft, Home} from 'lucide-react';

export default function FAQsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            category: 'General',
            questions: [
                {
                    question: 'What is BookMarket?',
                    answer: 'BookMarket is an online platform where you can browse, purchase, and download premium eBooks across various categories including programming, business, design, and more. We offer both free and paid books with instant download access.'
                },
                {
                    question: 'How do I create an account?',
                    answer: 'Click on the "Sign Up" button in the top right corner, fill in your details (name, email, mobile number, password), and click "Create Account". You\'ll receive a confirmation email to verify your account.'
                },
                {
                    question: 'Is registration mandatory?',
                    answer: 'Yes, you need to register to download books. Registration is free and takes less than a minute. It allows you to access your library, track purchases, and receive updates on new books.'
                },
                {
                    question: 'Are there any free books available?',
                    answer: 'Yes! We offer hundreds of free eBooks across various categories. Look for books marked with a "FREE" badge on the homepage. Free books can be downloaded instantly after login.'
                }
            ]
        },
        {
            category: 'Purchases & Payments',
            questions: [
                {
                    question: 'What payment methods do you accept?',
                    answer: 'We accept all major payment methods through PhonePe including UPI, Credit Cards, Debit Cards, Net Banking, and PhonePe Wallet. All payments are processed securely with 256-bit SSL encryption.'
                },
                {
                    question: 'Is my payment information secure?',
                    answer: 'Absolutely! We use PhonePe\'s secure payment gateway. We never store your card details on our servers. All transactions are encrypted and PCI-DSS compliant.'
                },
                {
                    question: 'Why was my payment declined?',
                    answer: 'Payments can be declined due to insufficient funds, incorrect card details, bank restrictions, or security checks. Please verify your payment details and try again. If the issue persists, contact your bank or try an alternate payment method.'
                },
                {
                    question: 'Will I receive a receipt?',
                    answer: 'Yes! You\'ll receive an email receipt immediately after successful payment. You can also download your receipt from the "My Library" section at any time.'
                },
                {
                    question: 'Can I pay later or use installments?',
                    answer: 'Currently, we only accept full payment at the time of purchase. However, we\'re working on introducing EMI options for purchases above ₹500.'
                }
            ]
        },
        {
            category: 'Downloads & Access',
            questions: [
                {
                    question: 'How do I download a book?',
                    answer: 'After successful payment, you\'ll see a download button on the payment success page. You can also access your book from "My Library" anytime. Free books can be downloaded directly after login.'
                },
                {
                    question: 'How many times can I download a book?',
                    answer: 'You can download each purchased book up to 5 times within 30 days from the date of purchase. This allows you to download on multiple devices or re-download if needed.'
                },
                {
                    question: 'What if my download fails?',
                    answer: 'If your download fails, simply try again from "My Library". The download link remains valid for 30 days. If you continue facing issues, contact our support team with your transaction ID.'
                },
                {
                    question: 'Can I download books on mobile?',
                    answer: 'Yes! Our website is fully mobile-responsive. You can browse, purchase, and download books on any device - smartphone, tablet, or computer.'
                },
                {
                    question: 'What format are the books in?',
                    answer: 'All our books are in PDF format, which can be opened on any device with a PDF reader (Adobe Acrobat, browser, mobile apps, etc.).'
                },
                {
                    question: 'Where can I find my downloaded books?',
                    answer: 'Downloaded books are saved in your device\'s default download folder. On mobile, check your "Downloads" app. You can also access download links anytime from "My Library" section.'
                }
            ]
        },
        {
            category: 'Refunds & Cancellations',
            questions: [
                {
                    question: 'Can I get a refund?',
                    answer: 'Due to the digital nature of our products, refunds are generally not provided once the book is downloaded. However, we offer refunds if the file is corrupted, you were charged multiple times, or you haven\'t downloaded within 48 hours. See our Refund Policy for details.'
                },
                {
                    question: 'How do I request a refund?',
                    answer: 'Contact our support team at support@bookmarket.com within 7 days of purchase with your transaction ID and reason for refund. We\'ll review and process eligible refunds within 7-14 business days.'
                },
                {
                    question: 'How long does refund take?',
                    answer: 'Once approved, refunds are processed within 7-14 business days. The amount will be credited to your original payment method. Bank processing may take additional 3-5 days.'
                },
                {
                    question: 'Can I exchange a book?',
                    answer: 'We don\'t offer direct exchanges. However, you can request a refund for an eligible purchase and then purchase a different book.'
                }
            ]
        },
        {
            category: 'Technical Issues',
            questions: [
                {
                    question: 'The PDF won\'t open. What should I do?',
                    answer: 'Ensure you have a PDF reader installed (Adobe Acrobat Reader, browser PDF viewer). If the file is corrupted, contact support with your transaction ID for a replacement link.'
                },
                {
                    question: 'I forgot my password. How do I reset it?',
                    answer: 'Click "Forgot Password" on the login page, enter your registered email, and you\'ll receive a password reset link. Follow the instructions in the email to set a new password.'
                },
                {
                    question: 'Why can\'t I see my purchased books?',
                    answer: 'Make sure you\'re logged into the correct account. Go to "My Library" to see all your purchases. If books are still missing, contact support with your transaction details.'
                },
                {
                    question: 'The website is not loading properly',
                    answer: 'Try clearing your browser cache, using a different browser, or checking your internet connection. If issues persist, contact our technical support team.'
                }
            ]
        },
        {
            category: 'Account & Privacy',
            questions: [
                {
                    question: 'How do I change my email address?',
                    answer: 'Currently, email addresses cannot be changed. If you need to use a different email, please contact our support team for assistance.'
                },
                {
                    question: 'Can I delete my account?',
                    answer: 'Yes, contact our support team to request account deletion. Please note that you\'ll lose access to all purchased content and this action cannot be undone.'
                },
                {
                    question: 'How is my personal information protected?',
                    answer: 'We use industry-standard security measures including SSL encryption, secure servers, and strict access controls. Read our Privacy Policy for complete details on data protection.'
                },
                {
                    question: 'Can I share my account with others?',
                    answer: 'No, accounts are for individual use only. Sharing accounts or purchased eBooks with others violates our Terms of Service and may result in account suspension.'
                }
            ]
        },
        {
            category: 'Books & Content',
            questions: [
                {
                    question: 'How often do you add new books?',
                    answer: 'We add new books weekly across various categories. Subscribe to our newsletter or enable notifications to stay updated on new releases.'
                },
                {
                    question: 'Can I request a specific book?',
                    answer: 'Yes! Send your book suggestions to suggestions@bookmarket.com. While we can\'t guarantee availability, we consider all requests when adding new content.'
                },
                {
                    question: 'Are the books in English only?',
                    answer: 'Currently, most books are in English. We\'re working on adding books in Hindi and other Indian languages soon.'
                },
                {
                    question: 'Can I preview books before buying?',
                    answer: 'Yes, each book page includes a preview section with sample content, table of contents, and detailed descriptions to help you make an informed decision.'
                }
            ]
        }
    ];

    const filteredFAQs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
            faq =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    const toggleQuestion = (categoryIndex, questionIndex) => {
        const index = `${categoryIndex}-${questionIndex}`;
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <PageLayout
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions"
            breadcrumbs={[
                { label: 'Home', link: '/' },
                { label: 'FAQs' }
            ]}
        >
            {/* Search */}
            <div className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for answers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-lg"
                    />
                </div>
            </div>

            {/* FAQs */}
            {filteredFAQs.length > 0 ? (
                <div className="space-y-8">
                    {filteredFAQs.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <HelpCircle className="text-blue-600" size={28} />
                                {category.category}
                            </h2>
                            <div className="space-y-3">
                                {category.questions.map((faq, questionIndex) => {
                                    const index = `${categoryIndex}-${questionIndex}`;
                                    const isOpen = openIndex === index;

                                    return (
                                        <div
                                            key={questionIndex}
                                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all"
                                        >
                                            <button
                                                onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-semibold text-gray-800 pr-4">
                                                    {faq.question}
                                                </span>
                                                {isOpen ? (
                                                    <ChevronUp className="text-blue-600 flex-shrink-0" size={24} />
                                                ) : (
                                                    <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 animate-slide-down">
                                                    <p className="text-gray-700 leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <HelpCircle size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-6">
                        Try different keywords or browse all categories
                    </p>
                    <button
                        onClick={() => setSearchQuery('')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Clear Search
                    </button>
                </div>
            )}

            {/* Still Need Help */}
            <div className="mt-12 pt-8 border-t">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-xl mb-6">Our support team is here to help!</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className="px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 transition-all"
                        >
                            Contact Support
                        </button>
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className="px-8 py-3 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all"
                        >
                            Visit Help Center
                        </button>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
