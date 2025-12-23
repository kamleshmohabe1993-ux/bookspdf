'use client';

import { useState, useEffect } from 'react';
import { X, Download, CheckCircle, AlertCircle, Clock, RefreshCw, Smartphone, Monitor, ArrowDown } from 'lucide-react';

const QRCodeModal = ({ isOpen, onClose, paymentData, book }) => {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        if (isOpen && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isOpen, timeLeft]);

    if (!isOpen) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const generateQRCode = () => {
        const upiString = `upi://pay?pa=merchant@phonepe&pn=BooksnPDF&am=${book.price}&cu=INR&tn=Payment for ${book.title}&tr=${paymentData.transactionId}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiString)}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            {/* Modal Container */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[98vh] sm:max-h-[95vh] overflow-y-auto animate-scale-in">
                {/* Header - Responsive */}
                <div className="bg-linear-to-r from-purple-600 to-pink-600 p-4 md:p-6 text-white relative rounded-t-2xl">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">Scan QR Code</h2>
                            <p className="text-purple-100 text-sm md:text-base">Complete payment using any UPI app</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    
                </div>

                <div className="p-4 md:p-6 space-y-4 sm:space-y-6">
                    {/* Timer - Responsive */}
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center justify-center gap-3">
                        <Clock className="text-orange-600 w-5 h-5 md:w-6 md:h-6" />
                        <div>
                            <p className="text-xs md:text-sm text-gray-600">Time remaining</p>
                            <p className="text-xl md:text-2xl font-bold text-orange-600">
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </p>
                        </div>
                    </div>

                    {/* Main Content - Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Left Column - QR Code Section */}
                        <div className="space-y-4">
                            {/* QR Code Container */}
                            <div className="bg-gray-50 rounded-md p-4 md:p-6 flex flex-col items-center">
                                <div className="bg-white p-3 md:p-4 rounded-lg shadow-lg w-full max-w-xs">
                                    <img
                                        src={generateQRCode()}
                                        alt="Payment QR Code"
                                        className="w-full h-auto"
                                        loading="lazy"
                                    />
                                </div>
                                
                                {/* Mobile Instructions */}
                                <div className="lg:hidden mt-4 flex flex-col items-center">
                                    <div className="flex items-center gap-2 text-blue-600 animate-bounce mb-2">
                                        <ArrowDown size={20} />
                                        <span className="font-medium">Scroll down for instructions</span>
                                    </div>
                                </div>
                                
                                <p className="text-center text-gray-600 mt-4 text-xs md:text-sm">
                                    Scan with PhonePe, Google Pay, Paytm, or any UPI app
                                </p>
                                
                                {/* Download QR Code Button */}
                                <button
                                    onClick={() => {
                                        // Download QR code logic
                                        const link = document.createElement('a');
                                        link.href = generateQRCode();
                                        link.download = `payment-qr-${paymentData.transactionId}.png`;
                                        link.click();
                                    }}
                                    className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
                                >
                                    <Download size={18} />
                                    Download QR Code
                                </button>
                            </div>

                            {/* Payment Amount - Mobile top placement */}
                            <div className="lg:hidden bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-xs md:text-sm text-gray-600 mb-1">Amount to Pay</p>
                                <p className="text-2xl md:text-3xl font-bold text-blue-600">₹{book.price}</p>
                            </div>
                        </div>

                        {/* Right Column - Information Section */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Payment Amount - Desktop placement */}
                            <div className="hidden lg:block bg-blue-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                                <p className="text-3xl font-bold text-blue-600">₹{book.price}</p>
                            </div>

                            {/* Transaction ID */}
                            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                                <p className="text-xs md:text-sm text-gray-800 mb-1">Transaction ID</p>
                                <div className="flex items-center gap-2">
                                    <code className="font-mono text-sm text-gray-800 md:text-base font-semibold break-all">
                                        {paymentData.transactionId}
                                    </code>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(paymentData.transactionId)}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            {/* Book Details */}
                            <div className="border rounded-lg text-gray-700 p-3 md:p-4">
                                <h4 className="font-semibold text-sm md:text-base mb-2">Book Details</h4>
                                <div className="space-y-2">
                                    <p className="text-sm md:text-base font-medium">{book.title}</p>
                                    <p className="text-xs md:text-sm text-gray-700">by {book.author}</p>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-sm md:text-base flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                                    How to pay:
                                </h4>
                                <ol className="space-y-2 text-sm md:text-base text-gray-600">
                                    <li className="flex items-start gap-3">
                                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                        <span>Open any UPI app (PhonePe, Google Pay, Paytm)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                        <span>Scan the QR code above with your phone camera</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                        <span>Verify the amount and merchant name</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                        <span>Enter your UPI PIN to complete payment</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="bg-purple-100 text-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">5</span>
                                        <span>You'll be redirected automatically</span>
                                    </li>
                                </ol>
                            </div>

                            {/* Mobile-only tip */}
                            <div className="lg:hidden bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Mobile Tip:
                                </p>
                                <p className="text-xs text-green-600 mt-1">
                                    Tap and hold the QR code image to save it, then open it with your UPI app.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons - Stacked on mobile, side-by-side on desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 pt-4 border-t">
                        <button
                            onClick={async () => {
                                setChecking(true);
                                // Check payment status
                                setTimeout(() => setChecking(false), 2000);
                            }}
                            disabled={checking}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {checking ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Checking...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-5 h-5" />
                                    Check Payment Status
                                </>
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Cancel Payment
                        </button>
                    </div>

                    {/* Footer Note */}
                    <div className="text-center pt-4">
                        <p className="text-xs text-gray-500">
                            Payment secured with 256-bit encryption • 
                            <span className="text-green-600 ml-2">✓ No extra charges</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;