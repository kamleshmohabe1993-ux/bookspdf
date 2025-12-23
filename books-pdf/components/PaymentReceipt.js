'use client';

import { Download, CheckCircle, IndianRupee, Calendar, Clock, User, Mail, Phone } from 'lucide-react';

const PaymentReceipt = ({ purchase, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // In production, generate actual PDF
        alert('PDF receipt will be downloaded');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white text-center">
                    <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-600" size={48} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
                    <p className="text-green-100">Your transaction has been completed</p>
                </div>

                {/* Receipt Content */}
                <div className="p-8 space-y-6">
                    {/* Transaction ID */}
                    <div className="text-center pb-6 border-b">
                        <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
                        <p className="font-mono text-lg font-bold text-gray-800">
                            {purchase.transactionId}
                        </p>
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-2">Amount Paid</p>
                        <div className="flex items-center justify-center gap-2 text-4xl font-bold text-green-600">
                            <IndianRupee size={32} />
                            <span>{purchase.amount}</span>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                    <User size={16} />
                                    Customer Name
                                </p>
                                <p className="font-semibold">{purchase.user?.fullName}</p>
                            </div>
                            
                            <div>
                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                    <Mail size={16} />
                                    Email
                                </p>
                                <p className="font-semibold">{purchase.user?.email}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                    <Phone size={16} />
                                    Mobile
                                </p>
                                <p className="font-semibold">{purchase.user?.mobileNumber}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                    <Calendar size={16} />
                                    Date
                                </p>
                                <p className="font-semibold">
                                    {new Date(purchase.purchasedAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                                    <Clock size={16} />
                                    Time
                                </p>
                                <p className="font-semibold">
                                    {new Date(purchase.purchasedAt).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                                <p className="font-semibold">PhonePe UPI</p>
                            </div>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="bg-gray-50 rounded-lg p-4 border-t">
                        <p className="text-sm font-semibold text-gray-600 mb-3">Book Details</p>
                        <div className="flex items-center gap-4">
                            <img
                                src={
                                    purchase.book?.thumbnail?.data
                                        ? `data:${purchase.book.thumbnail.contentType};base64,${purchase.book.thumbnail.data}`
                                        : '/placeholder-book.jpg'
                                }
                                alt={purchase.book?.title}
                                className="w-16 h-24 object-cover rounded shadow"
                            />
                            <div className="flex-1">
                                <p className="font-bold text-lg">{purchase.book?.title}</p>
                                {purchase.book?.author && (
                                    <p className="text-gray-600 text-sm">by {purchase.book.author}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="border-t pt-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Book Price</span>
                                <span className="font-semibold">₹{purchase.amount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Payment Gateway Fee</span>
                                <span className="font-semibold">₹0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Taxes</span>
                                <span className="font-semibold">₹0.00</span>
                            </div>
                            <div className="h-px bg-gray-200 my-3"></div>
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total Paid</span>
                                <span className="text-green-600">₹{purchase.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Download Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="font-semibold text-blue-900 mb-2">Download Information</p>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>✓ Download link sent to your email</li>
                            <li>✓ Access from " My Library" anytime</li>
                            <li>✓ Valid for 30 days</li>
                            <li>✓ Maximum 5 downloads allowed</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-6">
                        <button
                            onClick={handlePrint}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                        >
                            Print Receipt
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={20} />
                            Download PDF
                        </button>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                        Go to My Library
                    </button>

                    {/* Footer */}
                    <div className="text-center pt-6 border-t">
                        <p className="text-sm text-gray-600">
                            Thank you for your purchase!
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            For support, contact: support@bookmarket.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReceipt;