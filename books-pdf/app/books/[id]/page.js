'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Download, ShoppingCart, ArrowLeft, IndianRupee, Star, MessageSquare, User, X, Trash2 } from 'lucide-react';
import { bookAPI, paymentAPI } from '@/lib/api';
import PaymentModal from '@/components/PaymentModal';
import QRCodeModal from '@/components/QRCodeModal';
import SocialShareButton from '@/components/ShareCard';
import DebugPanel from '@/components/DebugPanel';
import showToast from '@/lib/toast';
import axios from 'axios';
import CompactCommunityButtons from '@/components/communityCards';

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

    // Rating System States
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userReview, setUserReview] = useState('');
    const [submittingRating, setSubmittingRating] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [userExistingRating, setUserExistingRating] = useState(null);
    const [deletingRating, setDeletingRating] = useState(false);

    // Debug flow tracking
    const [flowSteps, setFlowSteps] = useState([]);

    const addFlowStep = (name, data = null, completed = true) => {
        setFlowSteps(prev => [...prev, { name, data, completed, timestamp: new Date().toISOString() }]);
        console.log(`📍 FLOW STEP: ${name}`, data);
    };

    useEffect(() => {
        loadBook();
        loadRatings();
        addFlowStep('Page Loaded');
    }, [params.id]);

    useEffect(() => {
        if (user) {
            loadUserRating();
        }
    }, [user, params.id]);

    const loadBook = async () => {
        try {
            const response = await bookAPI.getOne(params.id);
            const bookData = response.data.data;
            setBook(bookData);
            addFlowStep('Book Loaded', { title: bookData.title });

            // Check if user has purchased this book
            if (user) {
                const purchased = user.purchasedBooks?.includes(params.id) || false;
                setHasPurchased(purchased);
            }
        } catch (error) {
            showToast.error('Error loading book: ' + error.message);
            addFlowStep('Book Load Failed', { error: error.message }, false);
        } finally {
            setLoading(false);
        }
    };

    const loadRatings = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ratings/${params.id}`
            );
            if (response.data.success) {
                const ratingsData = response.data.data.ratings || [];
                setRatings(ratingsData);
                // Calculate average rating
                if (ratingsData.length > 0) {
                    const sum = ratingsData.reduce((acc, r) => acc + r.rating, 0);
                    setAverageRating((sum / ratingsData.length).toFixed(1));
                }
            }
        } catch (error) {
            console.error('Error loading ratings:', error);
        }
    };

    const loadUserRating = async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ratings/user/${params.id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success && response.data.data) {
                const existingRating = response.data.data;
                setUserExistingRating(existingRating);
                setUserRating(existingRating.rating);
                setUserReview(existingRating.review || '');
            }
        } catch (error) {
            // No existing rating found - this is ok
            console.log('No existing rating found');
        }
    };

    // RATING FUNCTIONS
    const handleOpenRatingModal = () => {
    if (!user) {
        // Save current page before redirecting to login
        localStorage.setItem('redirectAfterLogin', `/books/${params.id}`);
        showToast.error('Please login to rate this book');
        router.push('/login');
        return;
    }

    if (!hasPurchased && book.isPaid) {
        showToast.error('Please purchase this book to rate it');
        return;
    }

    setShowRatingModal(true);
};

    const handleSubmitRating = async () => {
        if (userRating === 0) {
            showToast.error('Please select a rating');
            return;
        }

        setSubmittingRating(true);
        try {
            const token = localStorage.getItem('token');
            const ratingData = {
                bookId: params.id,
                rating: userRating,
                review: userReview.trim()
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:/api'}/ratings`,
                ratingData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        
            if (response.data.success) {
                showToast.success('Rating submitted successfully!');
                setShowRatingModal(false);
                
                // Reload ratings and user rating
                await loadRatings();
                await loadUserRating();
            }
        } catch (error) {
            console.error('Rating error:', error);
            showToast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to submit rating');
        } finally {
            setSubmittingRating(false);
        }
    };

    const handleDeleteRating = async () => {
        if (!userExistingRating) return;

        if (!confirm('Are you sure you want to delete your rating?')) {
            return;
        }

        setDeletingRating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ratings/${userExistingRating._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                showToast.success('Rating deleted successfully!');
                setUserExistingRating(null);
                setUserRating(0);
                setUserReview('');
                
                // Reload ratings
                await loadRatings();
            }
        } catch (error) {
            console.error('Delete rating error:', error);
            showToast.error(error.response?.data?.error || 'Failed to delete rating');
        } finally {
            setDeletingRating(false);
        }
    };

    // PAYMENT FUNCTIONS
    const handleMainButtonClick = () => {
    addFlowStep('💳 PAY BUTTON CLICKED', { isPaid: book.isPaid });

    if (!user) {
        addFlowStep('User Not Logged In - Redirecting to Login');
        
        // Store the current book page URL
        const bookPageUrl = `/books/${params.id}`;
        localStorage.setItem('redirectAfterLogin', bookPageUrl);
        
        // Show message
        showToast.info('Please login to continue');
        
        // Redirect to login
        router.push('/login');
        return;
    }

    if (book.isPaid) {
        addFlowStep('📱 OPENING PAYMENT MODAL', { bookPrice: book.price });
        setShowPaymentModal(true);
        addFlowStep('✅ PAYMENT MODAL DISPLAYED');
    } else {
        addFlowStep('Free Book - Direct Download');
        handleFreeDownload();
    }
};


    const handlePaymentConfirm = async (paymentMethod, upiId) => {
        console.log('💳 Payment method selected:', paymentMethod);
        
        try {
            setProcessing(true);

            // Initiate payment first
            console.log('🔄 Initiating payment...');
            const response = await paymentAPI.initiate(book._id);


            setPaymentData(response.data.data);

            if (paymentMethod === 'qr') {
                // Show QR code modal
                console.log('📱 Showing QR code...');
                setShowPaymentModal(false);
                setShowQRModal(true);
                setProcessing(false);
            } else if (paymentMethod === 'upi') {
                // Create UPI deep link
                console.log('📱 Creating UPI link for:', upiId);
                const upiString = `upi://pay?pa=${upiId}&pn=BookMarket&am=${book.price}&cu=INR&tn=Payment for ${book.title}&tr=${response.data.data.transactionId}`;
                
                // Show confirmation
                const confirmed = window.confirm(
                    `Payment Details:\n\n` +
                    `UPI ID: ${upiId}\n` +
                    `Amount: ₹${book.price}\n` +
                    `Book: ${book.title}\n\n` +
                    `Click OK to open your UPI app`
                );

                if (confirmed) {
                    // Try to open UPI app
                    window.location.href = upiString;
                    
                    // Also redirect to PhonePe as fallback
                    setTimeout(() => {
                        window.location.href = response.data.data.paymentUrl;
                    }, 1000);
                }
            } else {
                // PhonePe app payment - redirect
                console.log('🔄 Redirecting to PhonePe...');
                setTimeout(() => {
                    window.location.href = response.data.data.paymentUrl;
                }, 500);
            }
        } catch (error) {
            console.error('❌ Payment error:', error);
            alert('Payment initiation failed: ' + (error.response?.data?.error || error.message));
            setProcessing(false);
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
            addFlowStep('Starting Free Download');

            const response = await paymentAPI.freeDownload(book._id);
            // const response = await axios.post(
            //     `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/payments/downloadfree`, {bookId: book._id}
            // );
            
            window.open(response.data.data.downloadUrl, '_blank');
            
            addFlowStep('Free Download Complete', { url: response.data.data.downloadUrl });
            showToast.success('Download started! Check your downloads folder.');
            
            setHasPurchased(true);
            router.push('/my-library');
        } catch (error) {
            addFlowStep('Download Failed', { error: error.message }, false);
            showToast.error('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessing(false);
        }
    };

    // const handlePaymentConfirm = async (paymentMethod, upiId) => {
    //     addFlowStep('✅ USER CONFIRMED PAYMENT', { method: paymentMethod, upiId });
        
    //     try {
    //         setProcessing(true);
    //         addFlowStep('🔄 Initiating Payment Request to Backend');

    //         const response = await paymentAPI.initiate(book._id);
            
    //         addFlowStep('✅ Payment Initiated Successfully', {
    //             transactionId: response.data.data.transactionId,
    //             paymentUrl: response.data.data.paymentUrl
    //         });

    //         setPaymentData(response.data.data);

    //         if (paymentMethod === 'qr') {
    //             addFlowStep('📱 Showing QR Code Modal');
    //             setShowPaymentModal(false);
    //             setShowQRModal(true);
    //             setProcessing(false);
    //             addFlowStep('✅ QR Modal Displayed');
    //         } else if (paymentMethod === 'upi') {
    //             addFlowStep('📱 Creating UPI Deep Link', { upiId });
                
    //             const upiString = `upi://pay?pa=${upiId}&pn=BookMarket&am=${book.price}&cu=INR&tn=Payment for ${book.title}&tr=${response.data.data.transactionId}`;
                
    //             const confirmed = window.confirm(
    //                 `Payment Details:\n\n` +
    //                 `UPI ID: ${upiId}\n` +
    //                 `Amount: ₹${book.price}\n` +
    //                 `Book: ${book.title}\n` +
    //                 `Transaction: ${response.data.data.transactionId}\n\n` +
    //                 `Click OK to open your UPI app`
    //             );

    //             if (confirmed) {
    //                 addFlowStep('🔄 Opening UPI App');
    //                 window.location.href = upiString;
                    
    //                 setTimeout(() => {
    //                     addFlowStep('🔄 Fallback: Redirecting to PhonePe');
    //                     window.location.href = response.data.data.paymentUrl;
    //                 }, 1000);
    //             } else {
    //                 addFlowStep('❌ User Cancelled UPI Payment', null, false);
    //                 setProcessing(false);
    //             }
    //         } else {
    //             addFlowStep('🔄 Redirecting to PhonePe Payment Page');
    //             setTimeout(() => {
    //                 window.location.href = response.data.data.paymentUrl;
    //                 addFlowStep('✅ Redirected to PhonePe');
    //             }, 500);
    //         }
    //     } catch (error) {
    //         addFlowStep('❌ Payment Initiation Failed', { error: error.message }, false);
    //         console.error('❌ Payment error:', error);
    //         showToast.error('Payment initiation failed: ' + (error.response?.data?.error || error.message));
    //         setProcessing(false);
    //     }
    // };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">Book not found</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const reviewCount = ratings.length;

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header - Responsive */}
                <div className="bg-white shadow-sm sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-3 sm:py-4">
                        <button
                            onClick={() => router.push('/')}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-semibold text-sm sm:text-base"
                        >
                            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                            <span className="hidden sm:inline">Back to Marketplace</span>
                            <span className="sm:hidden">Back</span>
                        </button>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-4 sm:py-8">
                    {/* Book Details Card - Responsive */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Book Image - Responsive */}
                            <div className="w-full lg:w-1/3 bg-linear-to-br from-green-100 to-yellow-200 p-6 sm:p-8 flex items-center justify-center">
                                <img
                                    src={
                                        book.thumbnail?.data
                                            ? `data:${book.thumbnail.contentType};base64,${book.thumbnail.data}`
                                            : '/placeholder-book.jpg'
                                    }
                                    alt={book.title}
                                    className="w-full max-w-[250px] sm:max-w-xs rounded-lg shadow-2xl"
                                />
                            </div>

                            {/* Book Details - Responsive */}
                            <div className="w-full lg:w-2/3 p-4 sm:p-6 lg:p-8">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl text-cyan-700 font-bold mb-2 sm:mb-3">{book.title}</h1>
                                {book.author && (
                                    <p className="text-gray-600 text-lg sm:text-xl mb-3 sm:mb-4">by {book.author}</p>
                                )}

                                {/* Rating Display - Responsive */}
                                <div className="flex flex-col sm:flex-row sm:items-center text-yellow-500 gap-3 sm:gap-4 mb-4 sm:mb-6">
                                    <div className="flex items-center  gap-2">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={20}
                                                    className={`sm:w-6 sm:h-6 ${star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                                            {averageRating > 0 ? averageRating : '0.0'}
                                        </span>
                                        <span className="text-sm sm:text-base text-gray-600">
                                            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                                        </span>
                                    </div>
                                    
                                    {/* Rate Button - Responsive */}
                                    {user && (hasPurchased || !book.isPaid) && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleOpenRatingModal}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm sm:text-base"
                                            >
                                                <Star size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                <span className="hidden sm:inline">
                                                    {userExistingRating ? 'Update Rating' : 'Rate This Book'}
                                                </span>
                                                <span className="sm:hidden">Rate</span>
                                            </button>
                                            
                                            {userExistingRating && (
                                                <button
                                                    onClick={handleDeleteRating}
                                                    disabled={deletingRating}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete rating"
                                                >
                                                    {deletingRating ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    ) : (
                                                        <Trash2 size={16} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Price Badge - Responsive */}
                                <div className="mb-4 sm:mb-6">
                                    <span className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xl sm:text-2xl font-bold ${
                                        book.isPaid ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {book.isPaid ? (
                                            <span className="flex items-center gap-2">
                                                <IndianRupee size={20} className="sm:w-6 sm:h-6" />
                                                {book.price}
                                            </span>
                                        ) : (
                                            'FREE'
                                        )}
                                    </span>
                                </div>

                                {/* Category - Responsive */}
                                {book.category && (
                                    <div className="mb-4 sm:mb-6">
                                        <span className="inline-block bg-purple-100 text-purple-700 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                                            {book.category}
                                        </span>
                                    </div>
                                )}
                            {/* <SocialShareButton></SocialShareButton> */}
                                {/* Description - Responsive */}
                                <div className="mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl text-gray-700 font-semibold mb-2 sm:mb-3">Description</h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                        {book.description}
                                    </p>
                                </div>

                                {/* Language - Responsive */}
                                {book.language && (
                                    <div className="mb-4 sm:mb-6 bg-gray-50 p-4 sm:p-6 rounded-lg">
                                        <span className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Language</span>
                                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {book.language}
                                        </span>
                                    </div>
                                )}
                                {/* Pages - Responsive */}
                                {book.pages && (
                                    <div className="mb-4 sm:mb-6 bg-gray-50 p-4 sm:p-6 rounded-lg">
                                        <span className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Total Pages</span>
                                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {book.pages}
                                        </span>
                                    </div>
                                )}
                                {/* Formate - Responsive */}
                                { (
                                    <div className="mb-4 sm:mb-6 text-gray-800 bg-green-100 p-4 sm:p-6 rounded-lg">
                                        <span className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Book Formate: </span>
                                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            PDF / Ebook
                                        </span>
                                    </div>
                                )}
                                {/* Genre - Responsive */}
                                {book.genre && (
                                    <div className="mb-4 sm:mb-6 bg-green-50 p-4 sm:p-6 rounded-lg">
                                        <span className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Book Genre: </span>
                                        <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {book.genre}
                                        </span>
                                    </div>
                                )}

                                {/* Tags - Responsive */}
                                {book.tags?.length > 0 && (
                                    <div className="sr-only">
                                        <h3>Tags</h3>
                                        <ul>
                                        {book.tags.map((tag, index) => (
                                            <li key={index}>{tag}</li>
                                        ))}
                                        </ul>
                                    </div>
                                    )}


                                {/* MAIN ACTION BUTTON - Responsive */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleDownloadClick}
                                        disabled={processing}
                                        className={`w-full py-4 sm:py-5 rounded-lg sm:rounded-xl font-bold text-lg sm:text-xl flex items-center justify-center gap-2 sm:gap-3 transition-all shadow-lg ${
                                            processing
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : book.isPaid
                                                ? 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:shadow-2xl transform hover:-translate-y-1'
                                                : 'bg-linear-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white hover:shadow-2xl transform hover:-translate-y-1'
                                        }`}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                                                <span className="text-base sm:text-xl">Processing...</span>
                                            </>
                                        ) : book.isPaid ? (
                                            <>
                                                <ShoppingCart size={24} className="sm:w-7 sm:h-7" />
                                                <span className="hidden sm:inline">Click to See Payment Details</span>
                                                <span className="sm:hidden">Buy Now</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download size={24} className="sm:w-7 sm:h-7" />
                                                <span className="hidden sm:inline">Download Free PDF</span>
                                                <span className="sm:hidden">Download</span>
                                            </>
                                        )}
                                    </button>
                                    {/* Visual Indicator - Responsive */}
                                    {book.isPaid && !processing && (
                                        <div className="bg-linear-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-3 sm:p-4 text-center">
                                            <div>
                                            <span className="font-md text-red-700">Note: The Payment Page Under Maintenance!</span>
                                            </div>
                                            <p className="text-xs sm:text-sm font-semibold text-purple-900 mb-2">
                                                💳 Quick & Secure Checkout
                                            </p>
                                            <div className="hidden sm:flex items-center justify-center gap-4 text-xs text-purple-700">
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Review Details
                                                </span>
                                                <span>→</span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Choose Payment
                                                </span>
                                                <span>→</span>
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Instant Download
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Security Info - Responsive */}
                                {book.isPaid && (
                                    <div className="mt-4 sm:mt-6 text-center space-y-2">
                                        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
                                            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></span>
                                            <span>100% Secure Payment</span>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs text-gray-500">
                                            <span>🔒 SSL Encrypted</span>
                                            <span>✓ PhonePe Protected</span>
                                            <span>📧 Instant Receipt</span>
                                        </div>
                                    </div>
                                )}

                                {!user && (
                                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                        Please{' '}
                                        <button
                                            onClick={handleMainButtonClick}
                                            className="text-blue-600 hover:underline font-semibold"
                                        >
                                            login
                                        </button>{' '}
                                        to continue
                                    </p>
                                )}
                            <CompactCommunityButtons></CompactCommunityButtons>
                            </div>
                        </div>
                    </div>
                    {/* Customer Reviews Section - Responsive */}
                    {reviewCount > 0 && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mt-4 sm:mt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <MessageSquare size={24} className="sm:w-7 sm:h-7" />
                                    <span className="hidden sm:inline">Customer Reviews</span>
                                    <span className="sm:hidden">Reviews</span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                                    <span className="text-xl sm:text-2xl font-semibold">{averageRating}</span>
                                    <span className="text-sm sm:text-base text-gray-600">out of 5</span>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                {ratings.map((rating) => (
                                    <div key={rating._id} className="border-b border-gray-200 pb-4 sm:pb-6 last:border-0">
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="bg-blue-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                                                <User size={20} className="sm:w-6 sm:h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                    <span className="font-semibold text-sm sm:text-base text-gray-900 truncate">
                                                        {rating.user?.fullName || 'Anonymous User'}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    size={14}
                                                                    className={star <= rating.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs sm:text-sm text-gray-500">
                                                            {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                {rating.review && (
                                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">
                                                        {rating.review}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => {
                        addFlowStep('❌ User Closed Payment Modal', null, false);
                        setShowPaymentModal(false);
                        setProcessing(false);
                    }}
                    book={book}
                    user={user}
                    onConfirm={handlePaymentConfirm}
                    loading={processing}
                />
            )}

            {/* QR Code Modal */}
            {showQRModal && paymentData && (
                <QRCodeModal
                    isOpen={showQRModal}
                    onClose={() => {
                        addFlowStep('❌ User Closed QR Modal', null, false);
                        setShowQRModal(false);
                        setPaymentData(null);
                        setProcessing(false);
                    }}
                    paymentData={paymentData}
                    book={book}
                />
            )}

            {/* Rating Modal - Responsive */}
            {showRatingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {userExistingRating ? 'Update Your Rating' : 'Rate This Book'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowRatingModal(false);
                                    setHoverRating(0);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        {/* Star Rating - Responsive */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setUserRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        size={36}
                                        className={`sm:w-10 sm:h-10 ${
                                            star <= (hoverRating || userRating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        
                        {userRating > 0 && (
                            <p className="text-center text-gray-600 mb-4 font-medium text-sm sm:text-base">
                                {userRating === 1 && '⭐ Poor'}
                                {userRating === 2 && '⭐⭐ Fair'}
                                {userRating === 3 && '⭐⭐⭐ Good'}
                                {userRating === 4 && '⭐⭐⭐⭐ Very Good'}
                                {userRating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                            </p>
                        )}

                        {/* Review Comment - Responsive */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review (Optional)
                            </label>
                            <textarea
                                value={userReview}
                                onChange={(e) => setUserReview(e.target.value)}
                                rows={4}
                                className="w-full px-3 sm:px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                                placeholder="Share your thoughts about this book..."
                                maxLength={100}
                            />
                            <p className="text-xs text-gray-500 mt-1 text-right">
                                {userReview.length}/100 characters
                            </p>
                        </div>

                        {/* Actions - Responsive */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSubmitRating}
                                disabled={userRating === 0 || submittingRating}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
                                {submittingRating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Star size={18} />
                                        <span>{userExistingRating ? 'Update' : 'Submit'} Rating</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRatingModal(false);
                                    setHoverRating(0);
                                }}
                                disabled={submittingRating}
                                className="sm:flex-shrink-0 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Debug Panel */}
            {/* <DebugPanel flowSteps={flowSteps} /> */}
        </>
    );
}