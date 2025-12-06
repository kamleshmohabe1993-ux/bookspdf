/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, SetStateAction, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Search, LogIn, Download, Eye, Trash2, ArrowLeft, Filter, AlertCircle, IndianRupee, Library, User, LogOut, Menu, X, LucideHome, LockIcon } from 'lucide-react';
import { bookAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BookCard from '@/components/BookCard';
import LoadingSpinner, { PageLoader, ButtonLoader } from '@/components/LoadingSpinner';
import PageLayout from '@/components/PageLayout';
import showToast from '@/lib/toast';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Award, Zap, BookOpen, ShoppingCart, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Book Classification Categories
const BOOK_CATEGORIES = {
  FEATURED: 'featured',
  BESTSELLER: 'bestseller',
  POPULAR: 'popular',
  NEW_ARRIVALS: 'new_arrivals',
  TRENDING: 'trending'
};

type BookType = {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  discount?: number;
  featured?: boolean;
  bestseller?: boolean;
  popular?: boolean;
  trending?: boolean;
  isPublished?: boolean;
  thumbnail?: {
    data: string;
    contentType: string;
  };
};

// Carousel Component
const BookCarousel = ({ books, title, icon, autoRotate = true, interval = 5000 }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const totalSlides = Math.ceil(books.length / 4);
  const booksPerSlide = 4;

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate || isHovered || books.length <= booksPerSlide) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, isHovered, totalSlides, interval, books.length, booksPerSlide]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getCurrentBooks = () => {
    const start = currentIndex * booksPerSlide;
    const end = start + booksPerSlide;
    return books.slice(start, end);
  };

  if (!books || books.length === 0) {
    return null; // Don't show empty sections
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
            {icon}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        </div>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <div className="hidden md:flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Books Grid */}
      <div className="relative overflow-hidden">
        <div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500"
          style={{ minHeight: '400px' }}
        >
          {getCurrentBooks().map((book: BookType, index: number) => (
            <BookCard key={`${book._id}-${index}`} book={book} />
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-blue-600' 
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-rotate indicator */}
      {autoRotate && !isHovered && totalSlides > 1 && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
          Auto
        </div>
      )}
    </div>
  );
};

export default function Home() {
    const [books, setBooks] = useState<BookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState([]);
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Book classification states
    const [featuredBooks, setFeaturedBooks] = useState<BookType[]>([]);
    const [bestsellerBooks, setBestsellerBooks] = useState<BookType[]>([]);
    const [popularBooks, setPopularBooks] = useState<BookType[]>([]);
    const [newArrivals, setNewArrivals] = useState<BookType[]>([]);
    const [trendingBooks, setTrendingBooks] = useState<BookType[]>([]);

    useEffect(() => {
        loadBooks();
        loadCategories();
    }, [searchQuery, categoryFilter]);

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
    
    // Filter function to remove unpublished books
    const filterPublishedBooks = (booksList: BookType[]) => {
        return booksList.filter(book => book.isPublished !== false);
    };
    
    const loadBooks = async () => {
        try {
            setLoading(true);
            const params: { search?: string; category?: string } = {};

            if (searchQuery) params.search = searchQuery;
            if (categoryFilter) params.category = categoryFilter;
            
            const response = await bookAPI.getAll(params);
            const allBooks = response.data.data || [];
            
            // Filter out unpublished books for regular users
            const publishedBooks = filterPublishedBooks(allBooks);
            
            setBooks(publishedBooks);

            // Classify books into categories
            classifyBooks(publishedBooks);
        } catch (error) {
            console.error('Error loading books:', error);
            showToast.error('Failed to load books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const classifyBooks = (allBooks: BookType[]) => {
        // Filter published books only
        const publishedBooks = filterPublishedBooks(allBooks);
        
        // Featured Books - Books marked as featured or top rated
        const featured = publishedBooks
            .filter(book => book.featured || (book.rating && book.rating >= 4.5))
            .slice(0, 8);
        
        // Bestseller Books - Books marked as bestseller
        const bestseller = publishedBooks
            .filter(book => book.bestseller)
            .slice(0, 8);
        
        // Popular Books - Books marked as popular
        const popular = publishedBooks
            .filter(book => book.popular)
            .slice(0, 8);
        
        // New Arrivals - Recently added books (sorted by _id or createdAt)
        const newBooks = [...publishedBooks]
            .sort((a, b) => {
                // Assuming newer books have higher _id values
                return b._id.localeCompare(a._id);
            })
            .slice(0, 8);
        
        // Trending Books - Books marked as trending
        const trending = publishedBooks
            .filter(book => book.trending)
            .slice(0, 8);

        setFeaturedBooks(featured.length > 0 ? featured : publishedBooks.slice(0, 8));
        setBestsellerBooks(bestseller.length > 0 ? bestseller : publishedBooks.slice(0, 8));
        setPopularBooks(popular.length > 0 ? popular : publishedBooks.slice(0, 8));
        setNewArrivals(newBooks.length > 0 ? newBooks : publishedBooks.slice(0, 8));
        setTrendingBooks(trending.length > 0 ? trending : publishedBooks.slice(0, 8));
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

    // Show carousel sections when no search/filter is applied
    const showCarousels = !searchQuery && !categoryFilter;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header></Header>

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
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
                    <h1 className="text-4xl font-bold mb-2">PDF eBooks Marketplace</h1>
                    <p className="text-xl">Discover, Learn, and Grow with free and Premium eBooks</p>
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

                {/* Book Sections with Carousels */}
                {loading ? (
                    <div className="text-center py-12">
                        <LoadingSpinner 
                            size={50} 
                            type="bounce" 
                            color="#3B82F6"
                            text="Loading books..." 
                        />
                    </div>
                ) : showCarousels ? (
                    <div className="space-y-16">
                        {/* Featured Books */}
                        {featuredBooks.length > 0 && (
                            <section>
                                <BookCarousel
                                    books={featuredBooks}
                                    title="Featured Books"
                                    icon={<Award className="text-yellow-600" size={32} />}
                                    autoRotate={true}
                                    interval={5000}
                                />
                            </section>
                        )}

                        {/* Bestseller Books */}
                        {bestsellerBooks.length > 0 && (
                            <section className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
                                <BookCarousel
                                    books={bestsellerBooks}
                                    title="Bestsellers"
                                    icon={<Star className="text-orange-600" size={32} />}
                                    autoRotate={true}
                                    interval={5000}
                                />
                            </section>
                        )}

                        {/* Popular Books */}
                        {popularBooks.length > 0 && (
                            <section>
                                <BookCarousel
                                    books={popularBooks}
                                    title="Most Popular"
                                    icon={<TrendingUp className="text-green-600" size={32} />}
                                    autoRotate={true}
                                    interval={5000}
                                />
                            </section>
                        )}

                        {/* New Arrivals */}
                        {newArrivals.length > 0 && (
                            <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl shadow-xl p-6 sm:p-8">
                                <BookCarousel
                                    books={newArrivals}
                                    title="New Arrivals"
                                    icon={<Zap className="text-purple-600" size={32} />}
                                    autoRotate={true}
                                    interval={5000}
                                />
                            </section>
                        )}

                        {/* Trending Books */}
                        {trendingBooks.length > 0 && (
                            <section>
                                <BookCarousel
                                    books={trendingBooks}
                                    title="Trending Now"
                                    icon={<TrendingUp className="text-red-600" size={32} />}
                                    autoRotate={true}
                                    interval={5000}
                                />
                            </section>
                        )}
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
            <Footer></Footer>
        </div>
    );
}