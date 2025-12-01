'use client';

import { useState } from 'react';
import { X, IndianRupee, User, Calendar, Clock, CreditCard, ShoppingBag, AlertCircle, Mail, Phone } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, book, user, onConfirm, loading }) => {
    const [paymentMethod, setPaymentMethod] = useState('phonepe');
    const [upiId, setUpiId] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (paymentMethod === 'upi' && !upiId) {
            alert('Please enter UPI ID');
            return;
        }
        
        console.log('✅ User confirmed payment');
        onConfirm(paymentMethod, upiId);
    };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = currentDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in modal-overlay">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto animate-scale-in">
                {/* Header */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white relative sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
                        disabled={loading}
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-3xl font-bold mb-2">Payment Confirmation</h2>
                    <p className="text-blue-100">Please review and confirm your purchase</p>
                </div>

                {/* Payment Details */}
                <div className="p-6 space-y-6">
                    {/* Customer Details */}
                    <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-200">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-800">
                            <User size={20} className="text-blue-600" />
                            Customer Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Full Name</p>
                                <p className="font-semibold text-gray-800">{user?.fullName || 'Guest User'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Email Address</p>
                                <p className="font-semibold text-gray-800 text-sm">{user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1">Mobile Number</p>
                                <p className="font-semibold text-gray-800">{user?.mobileNumber || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1">User ID</p>
                                <p className="font-semibold text-gray-800 font-mono text-sm">
                                    {user?._id?.slice(-8) || 'GUEST'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Book Info */}
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-purple-600" />
                            Order Details
                        </h3>
                        <div className="flex gap-4">
                            <img
                                src={
                                    book.thumbnail?.data
                                        ? `data:${book.thumbnail.contentType};base64,${book.thumbnail.data}`
                                        : '/placeholder-book.jpg'
                                }
                                alt={book.title}
                                className="w-24 h-32 object-cover rounded-lg shadow-md"
                            />
                            <div className="flex-1">
                                <h4 className="font-bold text-xl mb-1">{book.title}</h4>
                                {book.author && (
                                    <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
                                )}
                                {book.category && (
                                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {book.category}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                        <h4 className="font-semibold text-gray-800 mb-3">Transaction Details</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-2">
                                <Calendar className="text-yellow-600 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-gray-600">Date</p>
                                    <p className="font-semibold text-sm">{formattedDate}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                                <Clock className="text-yellow-600 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-gray-600">Time</p>
                                    <p className="font-semibold text-sm">{formattedTime}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                                <CreditCard className="text-yellow-600 mt-0.5" size={18} />
                                <div>
                                    <p className="text-xs text-gray-600">Payment Gateway</p>
                                    <p className="font-semibold text-sm">PhonePe UPI</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="border-2 border-gray-200 rounded-lg p-5 bg-white">
                        <h3 className="font-semibold text-lg mb-4 text-gray-800">Payment Summary</h3>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-700">
                                <span>Book Price</span>
                                <span className="font-semibold">₹{book.price}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Payment Gateway Fee</span>
                                <span className="font-semibold text-green-600">₹0.00</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Taxes & Charges</span>
                                <span className="font-semibold">₹0.00</span>
                            </div>
                            <div className="h-px bg-gray-300 my-3"></div>
                            <div className="flex justify-between text-xl font-bold">
                                <span className="text-gray-800">Total Amount</span>
                                <span className="text-green-600 flex items-center gap-1">
                                    <IndianRupee size={22} />
                                    {book.price}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-lg text-gray-800 mb-3">Select Payment Method</h4>
                        
                        {/* PhonePe App Option (Default - Recommended) */}
                        <div
                            onClick={() => setPaymentMethod('phonepe')}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                paymentMethod === 'phonepe'
                                    ? 'border-purple-600 bg-purple-50 shadow-md'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    checked={paymentMethod === 'phonepe'}
                                    onChange={() => setPaymentMethod('phonepe')}
                                    className="w-5 h-5 text-purple-600"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-lg">PhonePe Payment Page</p>
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                            Recommended
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">Secure payment via PhonePe gateway</p>
                                </div>
                                <img
                                    src="https://www.phonepe.com/webstatic/6.4.3/static/media/logo.c2185fb3.svg"
                                    alt="PhonePe"
                                    className="h-10"
                                />
                            </div>
                        </div>

                        {/* UPI ID Option */}
                        <div
                            onClick={() => setPaymentMethod('upi')}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                paymentMethod === 'upi'
                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    checked={paymentMethod === 'upi'}
                                    onChange={() => setPaymentMethod('upi')}
                                    className="w-5 h-5 text-blue-600"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-lg">Pay with UPI ID</p>
                                    <p className="text-sm text-gray-600">Enter your UPI ID directly</p>
                                </div>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png"
                                    alt="UPI"
                                    className="h-8"
                                />
                            </div>
                            
                            {paymentMethod === 'upi' && (
                                <div className="mt-3 animate-slide-down">
                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID (e.g., username@paytm)"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        {/* QR Code Option */}
                        <div
                            onClick={() => setPaymentMethod('qr')}
                            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                paymentMethod === 'qr'
                                    ? 'border-green-600 bg-green-50 shadow-md'
                                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    checked={paymentMethod === 'qr'}
                                    onChange={() => setPaymentMethod('qr')}
                                    className="w-5 h-5 text-green-600"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-lg">Scan QR Code</p>
                                    <p className="text-sm text-gray-600">Scan with any UPI app</p>
                                </div>
                                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8 0h2V3h-2v2zm0 2h2V5h-2v2zm2 2h-2v2h2V9zm2-4h2V3h-2v2zm0 4h2V7h-2v2zm-4 4h2v-2h-2v2zm6-2v2h2v-2h-2zm0 4h2v-2h-2v2zm-8 4h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={22} />
                        <div className="text-sm text-blue-900">
                            <p className="font-semibold mb-2">Important Information:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-800">
                                <li>Payment is 100% secure and encrypted</li>
                                <li>Download link valid for 30 days</li>
                                <li>You can download up to 5 times</li>
                                <li>Receipt will be sent to your email</li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`flex-1 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-lg ${
                                loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <IndianRupee size={24} />
                                    Confirm & Pay ₹{book.price}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center pt-2">
                        By proceeding, you agree to our{' '}
                        <span className="text-blue-600 cursor-pointer hover:underline font-semibold">Terms & Conditions</span>
                        {' '}and{' '}
                        <span className="text-blue-600 cursor-pointer hover:underline font-semibold">Privacy Policy</span>
                    </p>
                </div>
            </div>
        </div>
    )}

export default PaymentModal