'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Book, Search, Download, Eye, Trash2, ArrowLeft, Filter, AlertCircle, Calendar, IndianRupee, Library, User, LogOut, Menu, X, Home, LayoutDashboard } from 'lucide-react';
import { paymentAPI } from '@/lib/api';
import showToast from '@/lib/toast';
import { PageLoader, ButtonLoader } from '@/components/LoadingSpinner';
import Footer from '@/components/Footer';

export default function MyLibraryPage() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const handleNavigation = (path) => {
        router.push(path);
        closeMobileMenu();
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadPurchases();
        }
    }, [user]);

    const loadPurchases = async () => {
        try {
            const response = await paymentAPI.getMyPurchases();
            setPurchases(response.data.data);
            console.log("response", response);
        } catch (error) {
            console.error('Error loading purchases:', error);
            showToast.error('Failed to load your library');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (purchase) => {
        try {
            const response = await paymentAPI.getDownloadLink(purchase.downloadToken);
            
            // Open download in new tab
            window.open(response.data.data.downloadUrl, '_blank');
            
            alert(`Download started!\nRemaining downloads: ${response.data.data.remainingDownloads}`);
            showToast.success('Download started successfully!');
            
            // Reload purchases to update download count
            loadPurchases();
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            showToast.success('Logged out successfully!');
        } catch (error) {
            showToast.error('Failed to logout. Please try again.');
        }
    };

    // Safe function to get book thumbnail
    const getBookThumbnail = (book) => {
    // Multiple null checks
    if (!book) return '/placeholder-book.jpg';
    
    // Check for base64 thumbnail
    if (book.thumbnail?.data && book.thumbnail?.contentType) {
        return `data:${book.thumbnail.contentType};base64,${book.thumbnail.data}`;
    }
    
    // Check for alternative fields
    if (book.coverImage) return book.coverImage;
    if (book.image) return book.image;
    
    // Fallback to placeholder
    return '/placeholder-book.jpg';
};

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (loading) {
        return <PageLoader text="Loading your library..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Left: Back Button (Desktop) / Logo (Mobile) */}
                        <div className="flex items-center gap-3">
                            {/* Mobile: Hamburger Menu */}
                            <button
                                onClick={toggleMobileMenu}
                                className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>

                            {/* Desktop: Back Button */}
                            <button
                                onClick={() => handleNavigation('/')}
                                className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Home</span>
                            </button>

                            {/* Mobile: Logo */}
                            <div className="flex items-center gap-2 lg:hidden">
                                <Book className="text-blue-600" size={24} />
                                <span className="text-lg font-bold text-gray-800">My Library</span>
                            </div>
                        </div>

                        {/* Center: Title (Desktop Only) */}
                        <div className="hidden lg:flex items-center gap-2">
                            <Book className="text-blue-600" size={28} />
                            <span className="text-2xl font-bold text-gray-800">My Library</span>
                        </div>

                        {/* Right: Navigation (Desktop) / User Menu (Mobile) */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => handleNavigation('/profile')}
                                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                            >
                                <User size={20} />
                                <span>Profile</span>
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMobileMenu();
                                }}
                                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile: User Avatar/Icon */}
                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
                        >
                            <User size={24} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                        <nav className="container mx-auto px-4 py-4">
                            <div className="space-y-2">
                                {/* Home */}
                                <button
                                    onClick={() => handleNavigation('/')}
                                    className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                                >
                                    <Home size={20} />
                                    <span className="font-medium">Home</span>
                                </button>

                                {/* My Library */}
                                <button
                                    onClick={() => handleNavigation('/my-library')}
                                    className="w-full flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg"
                                >
                                    <Library size={20} />
                                    <span className="font-medium">My Library</span>
                                </button>

                                {/* Profile */}
                                <button
                                    onClick={() => handleNavigation('/profile')}
                                    className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                                >
                                    <User size={20} />
                                    <span className="font-medium">Profile</span>
                                </button>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-2"></div>

                                {/* Logout */}
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeMobileMenu();
                                    }}
                                    className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>

                                {/* User Info */}
                                {user && (
                                    <div className="pt-4 border-t border-gray-200 mt-4">
                                        <div className="px-4 py-2">
                                            <p className="text-sm text-gray-500">Signed in as</p>
                                            <p className="font-semibold text-gray-900">{user.name || user.fullName}</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Overlay when menu is open */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={closeMobileMenu}
                ></div>
            )}

            <main className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Welcome back, {user?.fullName || user?.name}! 👋
                            </h2>
                            <p className="text-white text-opacity-90">
                                You have {purchases.length} {purchases.length === 1 ? 'book' : 'books'} in your library
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-4xl font-bold text-indigo-600">
                                        {(user?.fullName || user?.name)?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your library...</p>
                    </div>
                ) : purchases.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {purchases.map((purchase) => {
                            // Safe check for purchase and book
                            if (!purchase || !purchase.book) {
                        console.warn('Invalid purchase data:', purchase);
                        return null;
                    }

                            return (
                                <div
                                    key={purchase._id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex">
                                        <div className="w-1/3 bg-gray-100 p-4 flex items-center justify-center">
                                           <img
                                              src={getBookThumbnail(purchase.book)}
                                              alt={purchase.book?.title || 'Book cover'}
                                              onError={(e) => {
                                                  e.target.src = '/placeholder-book.jpg';
                                              }}
                                          />
                                        </div>

                                        <div className="w-2/3 p-4">
                                            <h3 className="text-xl font-bold mb-2">
                                                {purchase.book?.title || 'Untitled Book'}
                                            </h3>
                                            {purchase.book?.author && (
                                                <p className="text-gray-600 text-sm mb-3">
                                                    by {purchase.book.author}
                                                </p>
                                            )}

                                            <div className="space-y-2 mb-4 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={16} />
                                                    <span>
                                                        Purchased: {new Date(purchase.purchasedAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {purchase.book?.isPaid && (
                                                    <div className="flex items-center gap-2 text-green-600">
                                                        <IndianRupee size={16} />
                                                        <span>Paid: ₹{purchase.amount || 0}</span>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Download size={16} />
                                                    <span>
                                                        Downloads: {purchase.downloadCount || 0} / {purchase.maxDownloads || 3}
                                                    </span>
                                                </div>
                                            </div>

                                            {purchase.downloadCount >= purchase.maxDownloads ? (
                                                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
                                                        <p className="text-red-800 text-sm">
                                                            Download limit reached. Please contact support for assistance.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : new Date() > new Date(purchase.downloadExpiresAt) ? (
                                                <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                                                    <div className="flex items-start gap-2">
                                                        <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={18} />
                                                        <p className="text-orange-800 text-sm">
                                                            Download link expired. Please contact support.
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleDownload(purchase)}
                                                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold transition-colors"
                                                >
                                                    <Download size={18} />
                                                    Download PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                        <Book size={64} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">
                            Your library is empty
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Start building your collection by browsing our marketplace
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                        >
                            Browse Books
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}