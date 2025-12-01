'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Download, ShoppingCart, ArrowLeft } from 'lucide-react';
import { bookAPI, paymentAPI } from '@/lib/api';
import PaymentModal from '@/components/PaymentModal';
import QRCodeModal from '@/components/QRCodeModal';

export default function BookDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadBook();
    }, [params.id]);

    const loadBook = async () => {
        try {
            const response = await bookAPI.getOne(params.id);
            setBook(response.data.data);
        } catch (error) {
            alert('Error loading book: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadClick = () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (book.isPaid) {
            // Show payment modal
            setShowPaymentModal(true);
        } else {
            handleFreeDownload();
        }
    };

    const handleFreeDownload = async () => {
        try {
            setProcessing(true);
            const response = await paymentAPI.freeDownload(book._id);
            
            // Open download in new tab
            window.open(response.data.data.downloadUrl, '_blank');
            
            alert('Download started! Check your downloads folder.');
            router.push('/my-library');
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessing(false);
        }
    };

    const handlePaymentConfirm = async (paymentMethod, upiId) => {
        try {
            setProcessing(true);

            if (paymentMethod === 'qr') {
                // Show QR code modal
                const response = await paymentAPI.initiate(book._id);
                setPaymentData(response.data.data);
                setShowPaymentModal(false);
                setShowQRModal(true);
            } else if (paymentMethod === 'upi') {
                // Initiate UPI payment
                const response = await paymentAPI.initiate(book._id);
                setPaymentData(response.data.data);
                
                // Show UPI intent or redirect
                alert(`Payment initiated!\nUPI ID: ${upiId}\nAmount: ₹${book.price}\n\nRedirecting to payment gateway...`);
                
                // Redirect to PhonePe
                window.location.href = response.data.data.paymentUrl;
            } else {
                // PhonePe app payment
                const response = await paymentAPI.initiate(book._id);
                
                // Redirect to PhonePe
                window.location.href = response.data.data.paymentUrl;
            }
        } catch (error) {
            alert('Payment initiation failed: ' + (error.response?.data?.error || error.message));
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Book not found</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={() => router.push('/')}
                        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-semibold"
                    >
                        <ArrowLeft size={20} />
                        Back to Marketplace
                    </button>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="md:flex">
                            {/* Book Image */}
                            <div className="md:w-1/3 bg-linear-to-br from-gray-100 to-gray-200 p-8 flex items-center justify-center">
                                <img
                                    src={
                                        book.thumbnail?.data
                                            ? `data:${book.thumbnail.contentType};base64,${book.thumbnail.data}`
                                            : '/placeholder-book.jpg'
                                    }
                                    alt={book.title}
                                    className="w-full max-w-xs rounded-lg shadow-2xl"
                                />
                            </div>

                            {/* Book Details */}
                            <div className="md:w-2/3 p-8">
                                <h1 className="text-4xl font-bold mb-3">{book.title}</h1>
                                {book.author && (
                                    <p className="text-gray-600 text-xl mb-6">by {book.author}</p>
                                )}

                                {/* Price Badge */}
                                <div className="mb-6">
                                    <span className={`inline-block px-6 py-3 rounded-full text-2xl font-bold ${
                                        book.isPaid ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {book.isPaid ? `₹${book.price}` : 'FREE'}
                                    </span>
                                </div>

                                {/* Category */}
                                {book.category && (
                                    <div className="mb-6">
                                        <span className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                                            {book.category}
                                        </span>
                                    </div>
                                )}

                                {/* Description */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold mb-3">Description</h2>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {book.description}
                                    </p>
                                </div>

                                {/* Preview */}
                                {book.previewText && (
                                    <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                                        <h2 className="text-xl font-semibold mb-3">Preview</h2>
                                        <p className="text-gray-700 leading-relaxed">
                                            {book.previewText}
                                        </p>
                                    </div>
                                )}

                                {/* Tags */}
                                {book.tags && book.tags.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Tags:</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {book.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Download/Purchase Button */}
                                <button
                                    onClick={handleDownloadClick}
                                    disabled={processing}
                                    className={`w-full py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${
                                        processing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : book.isPaid
                                            ? 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1'
                                            : 'bg-linear-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1'
                                    }`}
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : book.isPaid ? (
                                        <>
                                            <ShoppingCart size={28} />
                                            Buy & Download - ₹{book.price}
                                        </>
                                    ) : (
                                        <>
                                            <Download size={28} />
                                            Download Free PDF
                                        </>
                                    )}
                                </button>

                                {/* Security Info */}
                                {book.isPaid && (
                                    <p className="text-center text-sm text-gray-600 mt-4">
                                        🔒 Secure payment powered by PhonePe
                                    </p>
                                )}

                                {!user && (
                                    <p className="text-center text-sm text-gray-600 mt-4">
                                        Please{' '}
                                        <button
                                            onClick={() => router.push('/login')}
                                            className="text-blue-600 hover:underline font-semibold"
                                    >
                                    login
                                    </button>{' '}
                                    to download this book
                                    </p>
                                    )}
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    {/* Payment Confirmation Modal */}
        <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            book={book}
            onConfirm={handlePaymentConfirm}
            loading={processing}
        />

        {/* QR Code Modal */}
        {paymentData && (
            <QRCodeModal
                isOpen={showQRModal}
                onClose={() => {
                    setShowQRModal(false);
                    setPaymentData(null);
                }}
                paymentData={paymentData}
                book={book}
            />
        )}
    </>
);
}
