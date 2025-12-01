/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Search, LogIn, Download, Eye, Trash2, ArrowLeft, Filter, AlertCircle, IndianRupee, Library, User, LogOut, Menu, X, LucideHome, LockIcon } from 'lucide-react';
import { bookAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BookCard from '@/components/BookCard';
import LoadingSpinner, { PageLoader, ButtonLoader } from '@/components/LoadingSpinner';
import Image from "next/image";
import PageLayout from '@/components/PageLayout'
import showToast from '@/lib/toast';
type BookType = {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  description?: string;
};
  
export default function Home() {
    // const [books, setBooks] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const { user, logout } = useAuth();
    const router = useRouter();
    const [books, setBooks] = useState<BookType[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadBooks();
        loadCategories();
    }, [searchQuery, categoryFilter]);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
     const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
      };
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
      };
    const handleNavigation = (path: string) => {
        router.push(path);
        closeMobileMenu();
      };
    
    const loadBooks = async () => {
        try {
            setLoading(true);
            const params: { search?: string; category?: string } = {};

                if (searchQuery) params.search = searchQuery;
                if (categoryFilter) params.category = categoryFilter;
            
            const response = await bookAPI.getAll(params);
            setBooks(response.data.data);
        } catch (error) {
            console.error('Error loading books:', error);
            showToast.error('Failed to load books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await bookAPI.getCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error loading categories:', error);
            showToast.error('Failed to load categories.');
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

    const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryFilter = (category: SetStateAction<string>) => {
        setCategoryFilter(category);
    };

    // Show page loader while initial data is loading
    if (loading && books.length === 0 && categories.length === 0) {
        return <PageLoader text="Loading books..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => handleNavigation("/")}
                        >
                            <Book className="text-cyan-700" size={30} />
                            {/* <Image 
                                src="/public/logo.png" 
                                alt="BooksPDF logo" 
                                width={35} 
                                height={35} 
                                className="rounded-md"
                                priority
                            /> */}
                            <span className="text-xl sm:text-2xl font-bold text-cyan-700">
                                BooksPDF
                            </span>
                        </div>
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-4">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => handleNavigation("/my-library")}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-purple-500 rounded-lg transition"
                                    >
                                        <Book size={20} />
                                        <span>My Library</span>
                                    </button>

                                    {user.isAdmin && (
                                        <button
                                            onClick={() => handleNavigation("/admin")}
                                            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            <LockIcon size={25} />
                                            <span>Admin</span>
                                        </button>
                                    )}

                                    {user.isAdmin && (
                                        <button
                                            onClick={() => handleNavigation("/profile")}
                                            className="flex items-center gap-2 px-3 py-2 bg-amber-700 text-white rounded-lg hover:bg-purple-700 transition"
                                        >
                                            <User size={20} />
                                            <span>Profile</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-purple-500 rounded-lg transition"
                                    >
                                        <LogOut size={20} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleNavigation("/login")}
                                        className="flex items-center gap-2 px-3 py-2  bg-yellow-600 text-white-700 hover:bg-purple-500 rounded-lg transition"
                                    >
                                        <LogIn size={20} />
                                        <span>Login</span>
                                    </button>

                                    <button
                                        onClick={() => handleNavigation("/register")}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </nav>
                        {/* Left: Back Button (Desktop) / Logo (Mobile) */}
                        <div className="flex items-center gap-3">
                            {/* Mobile: Hamburger Menu */}
                            <button
                                onClick={toggleMobileMenu}
                                className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
                                aria-label="Toggle menu" >
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                    <nav className="container mx-auto px-4 py-4">
                    <div className="space-y-2">
                       { user ? (
                        <>
                        {/* Home */}
                        <button
                        onClick={() => handleNavigation('/')}
                        className="w-full flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg"
                        >
                        <LucideHome size={20} />
                        <span className="font-medium">Home</span>
                        </button>
                         {/* My Library */}
                        <button
                        onClick={() => handleNavigation('/my-library')}
                        className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                        >
                        <Library size={20} />
                        <span className="font-medium">My Library</span>
                        </button>
                        {/* Admin Profile */}
                        {user.isAdmin && (
                            <button
                        onClick={() => handleNavigation('/admin')}
                        className="w-full flex items-center gap-3 text-gray-700 hover:bg-purple-700 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                        >
                        <LockIcon size={20} />
                        <span className="font-medium">Admin</span>
                        </button>
                        )}
                    
                        {/* Profile */}
                        <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center gap-3 text-gray-700 hover:bg-purple-700 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
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
                            logout();
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
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        )}
                        </>
                       ): (
                            <>
                                <button
                                    onClick={() => handleNavigation("/login")}
                                    className="flex w-full gap-3 px-4 py-2  bg-yellow-600 text-white-700 hover:bg-purple-500 rounded-lg"
                                >
                                    <LogIn size={20} /> Login
                                </button>

                                <button
                                    onClick={() => handleNavigation("/register")}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-purple-500"
                                >
                                    Sign Up
                                </button>
                            </>
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
            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
                    <h1 className="text-4xl font-bold mb-2">PDF Book Marketplace</h1>
                    <p className="text-xl">Discover, Learn, and Grow with Premium eBooks</p>
                </div>

                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search books by title, author, or description..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => handleCategoryFilter('')}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                                categoryFilter === '' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-white text-gray-700 hover:bg-purple-500 border border-gray-300'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryFilter(category)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                                    categoryFilter === category 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white text-gray-700 hover:bg-purple-500 border border-gray-300'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <LoadingSpinner 
                            size={50} 
                            type="bounce" 
                            color="#3B82F6"
                            text="Loading books..." 
                        />
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book._id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Book size={64} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-xl text-gray-600">No books found</p>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </main>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        {/* Company */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">BooksPDF</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/about')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        About Us
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/contact')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Contact
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/how-it-works')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        How It Works
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/faqs')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        FAQs
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/contact')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Help Center
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/delivery-info')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Delivery Info
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/privacy-policy')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Privacy Policy
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/terms-and-conditions')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Terms & Conditions
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => handleNavigation('/refund-policy')} 
                                        className="hover:text-blue-400 transition-colors"
                                    >
                                        Refund Policy
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>📧 support@bookspdf.com</li>
                                <li>📱 +91 98765 43210</li>
                                <li>📍 Mumbai, India</li>
                            </ul>
                            <div className="mt-4 flex gap-3">
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} BooksPDF. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}