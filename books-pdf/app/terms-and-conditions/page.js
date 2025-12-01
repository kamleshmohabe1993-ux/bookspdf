'use client';

import PageLayout from '@/components/PageLayout';
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function TermsAndConditionsPage() {
    return (
        <PageLayout
            title="Terms & Conditions"
            subtitle="Please read these terms carefully before using our services"
            breadcrumbs={[
                { label: 'Home', link: '/' },
                { label: 'Terms & Conditions' }
            ]}
        >
            <div className="prose prose-lg max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                    <p className="text-sm text-gray-600 m-0">
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 m-0">
                        <strong>Effective Date:</strong> January 1, 2024
                    </p>
                </div>

                <section className="mb-8">
                    <p className="text-gray-700 leading-relaxed">
                        Welcome to BookMarket. These Terms and Conditions ("Terms") govern your access to and use of our website, services, and products. By accessing or using BookMarket, you agree to be bound by these Terms.
                    </p>
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-4 rounded-r-lg">
                        <p className="text-sm text-red-800 m-0">
                            <strong>Important:</strong> If you do not agree to these Terms, you must not access or use our services.
                        </p>
                    </div>
                </section>

                {/* Definitions */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Definitions</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>"Service"</strong> refers to the BookMarket website and all related services</li>
                        <li><strong>"User," "you," "your"</strong> refers to the individual accessing or using the Service</li>
                        <li><strong>"Content"</strong> refers to text, images, eBooks, and other materials available on the Service</li>
                        <li><strong>"Purchase"</strong> refers to the transaction of buying an eBook through our platform</li>
                        <li><strong>"Account"</strong> refers to your registered user account on BookMarket</li>
                    </ul>
                </section>

                {/* Acceptance */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Acceptance of Terms</h2>
                    <p className="text-gray-700">
                        By creating an account, making a purchase, or using our Service, you confirm that:
                    </p>
                    <div className="space-y-2 mt-3">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">You are at least 18 years of age or have parental consent</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">You have the legal capacity to enter into binding contracts</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">You will comply with all applicable laws and regulations</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">You have read and agree to our Privacy Policy</span>
                        </div>
                    </div>
                </section>

                {/* Account Registration */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Account Registration</h2>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Account Creation</h3>
                    <p className="text-gray-700">
                        To access certain features, you must create an account. You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and update your information to keep it accurate</li>
                        <li>Maintain the security of your password</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized use</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Account Suspension</h3>
                    <p className="text-gray-700">
                        We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent activity.
                    </p>
                </section>

                {/* Use of Service */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Use of Service</h2>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Permitted Use</h3>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Browse and search for eBooks</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Purchase and download eBooks for personal use</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Access your purchased content through your account</span>
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Prohibited Use</h3>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Redistribute, resell, or share downloaded eBooks</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Remove copyright notices or watermarks</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Use automated systems to scrape content</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Attempt to hack or compromise the Service</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Upload malware or viruses</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <XCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                            <span className="text-gray-700">Engage in fraudulent activities</span>
                        </div>
                    </div>
                </section>

                {/* Purchases and Payments */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Purchases and Payments</h2>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Pricing</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>All prices are in Indian Rupees (INR)</li>
                        <li>Prices are inclusive of applicable taxes</li>
                        <li>We reserve the right to change prices at any time</li>
                        <li>Price changes do not affect completed purchases</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Payment Processing</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Payments are processed securely through PhonePe</li>
                        <li>We do not store your payment card details</li>
                        <li>You must have sufficient funds/credit to complete a purchase</li>
                        <li>Failed transactions may take 5-7 business days to refund</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Delivery</h3>
                    <p className="text-gray-700">
                        Digital products are delivered instantly upon successful payment through:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                        <li>Direct download link on the payment success page</li>
                        <li>Access through "My Library" section</li>
                        <li>Email confirmation with download instructions</li>
                    </ul>
                </section>

                {/* Refunds */}
                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="text-orange-600" size={28} />
                        <h2 className="text-2xl font-bold text-gray-800 m-0">6. Refund Policy</h2>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-600 p-4 mb-4 rounded-r-lg">
                        <p className="text-sm text-orange-800 m-0">
                            <strong>Digital Products:</strong> Due to the nature of digital products, all sales are generally final. However, we offer refunds in specific circumstances.
                        </p>
                    </div>

                    <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Refund Eligibility</h3>
                    <p className="text-gray-700 mb-2">You may request a refund if:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>The file is corrupted or cannot be opened</li>
                        <li>You were charged multiple times for the same purchase</li>
                        <li>The book content significantly differs from the description</li>
                        <li>You did not download the book within 48 hours of purchase</li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Refund Process</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Submit refund request within 7 days of purchase</li>
                        <li>Provide transaction ID and reason for refund</li>
                        <li>Refunds processed within 7-14 business days</li>
                        <li>Amount refunded to original payment method</li>
                    </ul>

                    <p className="text-gray-700 mt-4">
                        For detailed information, please see our <a href="/refund-policy" className="text-blue-600 hover:underline font-semibold">Refund Policy</a>.
                    </p>
                </section>

                {/* Intellectual Property */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Intellectual Property Rights</h2>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Our Content</h3>
                    <p className="text-gray-700">
                        All content on BookMarket, including text, graphics, logos, and software, is owned by us or our licensors and protected by copyright laws.
                    </p>

                    <h3 className="text-xl font-semibold mt-6 mb-3">7.2 eBook License</h3>
                    <p className="text-gray-700 mb-2">
                        When you purchase an eBook, you receive a limited, non-exclusive, non-transferable license to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Download and view the eBook on your personal devices</li>
                        <li>Make backup copies for personal use</li>
                    </ul>

                    <p className="text-gray-700 mt-4">You may NOT:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                        <li>Reproduce, distribute, or publicly display the eBook</li>
                        <li>Create derivative works</li>
                        <li>Transfer or sell your license to others</li>
                        <li>Remove copyright notices</li>
                    </ul>
                </section>

                {/* Limitation of Liability */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Limitation of Liability</h2>
                    
                    <p className="text-gray-700 mb-4">
                        To the maximum extent permitted by law:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>BookMarket is not liable for any indirect, incidental, or consequential damages</li>
                        <li>Our total liability shall not exceed the amount you paid for the specific eBook</li>
                        <li>We do not guarantee uninterrupted or error-free service</li>
                        <li>We are not responsible for third-party content or links</li>
                    </ul>
                </section>

                {/* Disclaimer */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Disclaimer of Warranties</h2>
                    
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
                        <p className="text-gray-700 uppercase font-semibold mb-3">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
                        </p>
                        <p className="text-gray-700">
                            We disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.
                        </p>
                    </div>
                </section>

                {/* Indemnification */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Indemnification</h2>
                    
                    <p className="text-gray-700">
                        You agree to indemnify and hold harmless BookMarket, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses arising from:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                        <li>Your use of the Service</li>
                        <li>Your violation of these Terms</li>
                        <li>Your violation of any third-party rights</li>
                        <li>Any fraudulent activities on your account</li>
                    </ul>
                </section>

                {/* Governing Law */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">11. Governing Law</h2>
                    
                    <p className="text-gray-700">
                        These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
                    </p>
                </section>

                {/* Changes to Terms */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">12. Changes to Terms</h2>
                    <p className="text-gray-700 mb-4">
                    We reserve the right to modify these Terms at any time. When we make changes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>We will update the "Last Updated" date at the top</li>
                    <li>We will notify you via email or website notification</li>
                    <li>Continued use of the Service constitutes acceptance of the new Terms</li>
                    <li>Material changes will be effective 30 days after notification</li>
                </ul>
                
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-4 rounded-r-lg">
                    <p className="text-sm text-blue-800 m-0">
                        <strong>Tip:</strong> We recommend reviewing these Terms periodically to stay informed of any updates.
                    </p>
                </div>
            </section>

            {/* Termination */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">13. Termination</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">13.1 By You</h3>
                <p className="text-gray-700">
                    You may terminate your account at any time by contacting customer support. Upon termination:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>Your account will be deactivated within 48 hours</li>
                    <li>You will lose access to your purchased content</li>
                    <li>We recommend downloading your purchases before termination</li>
                    <li>No refunds will be provided for unused account balance</li>
                </ul>

                <h3 className="text-xl font-semibold mt-6 mb-3">13.2 By Us</h3>
                <p className="text-gray-700">
                    We may suspend or terminate your account if:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 mt-2">
                    <li>You violate these Terms</li>
                    <li>You engage in fraudulent activity</li>
                    <li>Your account remains inactive for over 2 years</li>
                    <li>We are required to do so by law</li>
                </ul>
            </section>

            {/* Dispute Resolution */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">14. Dispute Resolution</h2>
                
                <h3 className="text-xl font-semibold mt-6 mb-3">14.1 Informal Resolution</h3>
                <p className="text-gray-700">
                    Before filing a claim, please contact us at <a href="mailto:support@bookmarket.com" className="text-blue-600 hover:underline font-semibold">support@bookmarket.com</a> to resolve the issue informally.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">14.2 Arbitration</h3>
                <p className="text-gray-700">
                    If informal resolution fails, disputes shall be resolved through binding arbitration in accordance with Indian Arbitration and Conciliation Act, 1996.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3">14.3 Class Action Waiver</h3>
                <p className="text-gray-700">
                    You agree to resolve disputes on an individual basis and waive the right to participate in class action lawsuits.
                </p>
            </section>

            {/* Severability */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">15. Severability</h2>
                
                <p className="text-gray-700">
                    If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
                </p>
            </section>

            {/* Entire Agreement */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">16. Entire Agreement</h2>
                
                <p className="text-gray-700">
                    These Terms, together with our Privacy Policy and Refund Policy, constitute the entire agreement between you and BookMarket regarding your use of the Service.
                </p>
            </section>

            {/* Contact Information */}
            <section className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">17. Contact Information</h2>
                
                <p className="text-gray-700 mb-4">
                    For questions about these Terms, please contact us:
                </p>

                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-bold text-lg mb-3">BookMarket Legal Team</h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Email:</strong> <a href="mailto:legal@bookmarket.com" className="text-blue-600 hover:underline">legal@bookmarket.com</a></p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <p><strong>Address:</strong> 123 Book Street, Andheri East, Mumbai, Maharashtra 400069, India</p>
                        <p className="mt-4 text-sm"><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                    </div>
                </div>
            </section>

            {/* Acknowledgment */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                <div className="flex items-start gap-4">
                    <FileText size={40} className="flex-shrink-0" />
                    <div>
                        <h3 className="text-2xl font-bold mb-3">Acknowledgment</h3>
                        <p className="mb-4">
                            BY USING BOOKMARKET, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS.
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
                        >
                            I Accept the Terms
                        </button>
                    </div>
                </div>
            </section>
        </div>
    </PageLayout>
);
}