'use client';

import PageLayout from '@/components/PageLayout';

export default function RefundPolicyPage() {
    return (
        <PageLayout
            title="Refund & Cancellation Policy"
            subtitle="Clear and fair refund terms"
            breadcrumbs={[
                { label: 'Home', link: '/' },
                { label: 'Refund Policy' }
            ]}
        >
            <div className="prose prose-lg max-w-none">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                    <p className="text-sm text-gray-600 m-0">
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-IN')}
                    </p>
                </div>

                <section className="mb-8">
                    <p className="text-gray-700">
                        At BookMarket, we want you to be completely satisfied with your purchase. 
                        This Refund Policy outlines the conditions under which refunds are provided.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Digital Products Refund Policy</h2>
                    <p className="text-gray-700 mb-4">
                        Due to the nature of digital products, all sales are generally final once the eBook has been downloaded. 
                        However, we understand that issues may arise, and w&apos;re committed to fair treatment of our customers.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Eligible Refund Cases</h2>
                    <p className="text-gray-700 mb-4">You may request a refund within 7 days if:</p>
                    
                    <div className="space-y-3">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✓ Corrupted or Damaged File</p>
                            <p className="text-gray-600 text-sm">The PDF file is corrupted and cannot be opened or read properly</p>
                        </div>
                        
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✓ Duplicate Charges</p>
                            <p className="text-gray-600 text-sm">You were charged multiple times for the same book</p>
                        </div>
                        
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✓ Significant Mismatch</p>
                            <p className="text-gray-600 text-sm">The book content significantly differs from the description</p>
                        </div>
                        
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✓ Not Downloaded</p>
                            <p className="text-gray-600 text-sm">You haven&apos;t downloaded the book within 48 hours of purchase</p>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Non-Refundable Cases</h2>
                    <p className="text-gray-700 mb-4">Refunds will NOT be provided if:</p>
                    
                    <div className="space-y-3">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✗ Already Downloaded</p>
                            <p className="text-gray-600 text-sm">You have already downloaded and accessed the book</p>
                        </div>
                        
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✗ Change of Mind</p>
                            <p className="text-gray-600 text-sm">You simply changed your mind after purchase</p>
                        </div>
                        
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✗ Incompatibility</p>
                            <p className="text-gray-600 text-sm">Your device cannot open PDF files (technical issue on your end)</p>
                        </div>
                        
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                            <p className="text-gray-800 font-semibold mb-1">✗ Beyond 7 Days</p>
                            <p className="text-gray-600 text-sm">More than 7 days have passed since purchase</p>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">4. How to Request a Refund</h2>
                    <div className="bg-blue-50 rounded-lg p-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                            <div>
                                <p className="font-semibold text-gray-800">Contact Support</p>
                                <p className="text-gray-600 text-sm">Email support@bookspdf.com with subject &quot;Refund Request&quot;</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                            <div>
                                <p className="font-semibold text-gray-800">Provide Details</p>
                                <p className="text-gray-600 text-sm">Include: Transaction ID, Book Title, Purchase Date, Reason for Refund</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                            <div>
                                <p className="font-semibold text-gray-800">Review Process</p>
                                <p className="text-gray-600 text-sm">W&apos;ll review your request within 2-3 business days</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                            <div>
                                <p className="font-semibold text-gray-800">Refund Processing</p>
                                <p className="text-gray-600 text-sm">If approved, refund processed within 7-14 business days</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Refund Timeline</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Request Review:</strong> 2-3 business days</li>
                        <li><strong>Approval Notification:</strong> Within 24 hours of review</li>
                        <li><strong>Refund Processing:</strong> 7-14 business days</li>
                        <li><strong>Bank Credit:</strong> Additional 3-5 business days (depends on your bank)</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Refund Method</h2>
                    <p className="text-gray-700">
                        Refunds will be processed to your original payment method:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                        <li>Credit/Debit Card: Credited to the same card</li>
                        <li>UPI: Refunded to the same UPI ID</li>
                        <li>Net Banking: Credited to your bank account</li>
                        <li>PhonePe Wallet: Credited to your wallet</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Cancellation Policy</h2>
                    <p className="text-gray-700 mb-4">
                        You can cancel your order before downloading the book:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Before Download:</strong> Full refund within 48 hours</li>
                        <li><strong>After Download:</strong> Subject to refund eligibility criteria</li>
                        <li><strong>Cancellation Process:</strong> Contact support immediately</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Partial Refunds</h2>
                    <p className="text-gray-700">
                        In some cases, we may offer partial refunds:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mt-3">
                        <li>Minor content discrepancies</li>
                        <li>Temporary technical issues (resolved within 24 hours)</li>
                        <li>Customer goodwill gestures</li>
                    </ul>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Contact Information</h2>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-700 mb-4">For refund requests or questions:</p>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Email:</strong> <a href="mailto:refunds@bookspdf.com" className="text-blue-600 hover:underline">refunds@bookspdf.com</a></p>
                            <p><strong>Phone:</strong> +91 98765 43210</p>
                            <p><strong>Support Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
                        </div>
                    </div>
                </section>

                <div className="bg-linear-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
                    <h3 className="text-2xl font-bold mb-3">Our Commitment</h3>
                    <p className="mb-4">
                        We&apos;re committed to customer satisfaction. If you encounter any issues with your purchase, 
                        w&apos;ll work with you to find a fair solution.
                    </p>
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </PageLayout>
    );
}