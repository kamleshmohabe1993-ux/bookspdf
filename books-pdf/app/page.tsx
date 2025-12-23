/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, SetStateAction, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Search, LogIn, Download, Eye, Trash2, ArrowLeft, Filter, AlertCircle, IndianRupee, Library, User, LogOut, Menu, X, LucideHome, LockIcon } from 'lucide-react';
import { bookAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import BookCard from '@/components/BookCard';
import LoadingSpinner  from '@/components/LoadingSpinner';
import showToast from '@/lib/toast';
import { ChevronLeft, ChevronRight, Star, TrendingUp, Award, Zap, BookOpen, ShoppingCart, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CompactCommunityButtons from '@/components/communityCards';
// Book Classification Categories
const BOOK_CATEGORIES = {
  FEATURED: 'featured',
  BESTSELLER: 'bestseller',
  POPULAR: 'popular',
  NEW_ARRIVALS: 'new_arrivals',
  TRENDING: 'trending'
};

// Price filter types
const PRICE_FILTER_TYPES = {
  ALL: 'all',
  FREE: 'free',
  PREMIUM: 'premium'
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
const BookCarousel = ({ books, title, icon, autoRotate = true, interval = 10000 }: any) => {
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

// Price Filter Carousel Component
const PriceFilterCarousel = ({ activeFilter, onFilterChange }: { 
  activeFilter: string; 
  onFilterChange: (filterType: string) => void 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const priceFilters = [
    {
      id: PRICE_FILTER_TYPES.ALL,
      label: 'All Books',
      icon: <BookOpen size={18} />,
      color: 'bg-purple-600',
      hoverColor: 'bg-purple-700',
      textColor: 'text-white',
      borderColor: 'border-purple-600'
    },
    {
      id: PRICE_FILTER_TYPES.FREE,
      label: 'Free Books',
      icon: <Library size={18} />,
      color: 'bg-green-600',
      hoverColor: 'bg-green-700',
      textColor: 'text-white',
      borderColor: 'border-green-600'
    },
    {
      id: PRICE_FILTER_TYPES.PREMIUM,
      label: 'Premium Books',
      icon: <LockIcon size={18} />,
      color: 'bg-yellow-600',
      hoverColor: 'bg-yellow-700',
      textColor: 'text-white',
      borderColor: 'border-yellow-600'
    }
  ];

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Price Type</h3>
      
      {/* Desktop View - Simple Grid */}
      <div className="hidden md:grid grid-cols-3 gap-3">
        {priceFilters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              activeFilter === filter.id 
                ? `${filter.color} ${filter.textColor} shadow-lg transform scale-[1.02]` 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {filter.icon}
            <span className="font-medium">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile View - Horizontal Scrollable Carousel */}
      <div className="md:hidden relative">
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}
        
        <div 
          ref={containerRef}
          className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
          onScroll={checkScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {priceFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 flex-shrink-0 min-w-fit ${
                activeFilter === filter.id 
                  ? `${filter.color} ${filter.textColor} shadow-lg` 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {filter.icon}
              <span className="font-medium whitespace-nowrap">{filter.label}</span>
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

// Category Filter Carousel Component
const CategoryFilterCarousel = ({ categories, activeCategory, onCategoryChange }:{ 
  categories: string[]; 
  activeCategory: string; 
  onCategoryChange: (category: string) => void 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
      
      {/* Desktop View - Wrap Layout */}
      <div className="hidden md:flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            activeCategory === '' 
              ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
          }`}
        >
          All Categories
        </button>
        {categories.map((category: string) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeCategory === category 
                ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Mobile View - Horizontal Scrollable Carousel */}
      <div className="md:hidden relative">
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
        )}
        
        <div 
          ref={containerRef}
          className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide"
          onScroll={checkScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => onCategoryChange('')}
            className={`px-6 py-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
              activeCategory === '' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
            }`}
          >
            All Categories
          </button>
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-2 rounded-xl transition-all duration-300 flex-shrink-0 whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-100"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function Home() {
    const [books, setBooks] = useState<BookType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [priceFilter, setPriceFilter] = useState(PRICE_FILTER_TYPES.ALL);
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
    }, [searchQuery, categoryFilter, priceFilter]);

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    // Filter function to remove unpublished books
    const filterPublishedBooks = (booksList: BookType[]) => {
        return booksList.filter(book => book.isPublished !== false);
    };

    // Filter books by price type
    const filterBooksByPrice = (booksList: BookType[]) => {
        switch (priceFilter) {
            case PRICE_FILTER_TYPES.FREE:
                return booksList.filter(book => !book.price || book.price === 0);
            case PRICE_FILTER_TYPES.PREMIUM:
                return booksList.filter(book => book.price && book.price > 0);
            case PRICE_FILTER_TYPES.ALL:
            default:
                return booksList;
        }
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
            
            // Apply price filter
            const filteredBooks = filterBooksByPrice(publishedBooks);
            
            setBooks(filteredBooks);

            // Classify books into categories (with price filtering applied)
            classifyBooks(filteredBooks);
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

    const handlePriceFilter = (filterType: string) => {
        setPriceFilter(filterType);
    };

    // Show page loader while initial data is loading
    // if (loading && books.length === 0 && categories.length === 0) {
    //     return <PageLoader text="Loading books..." />;
    // }

    // Show carousel sections when no search/filter is applied
    const showCarousels = !searchQuery && !categoryFilter && priceFilter === PRICE_FILTER_TYPES.ALL;

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

                {/* Search and Filter Section */}
                <div className="mb-8 space-y-8">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search books by title, author, or description..."
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Filters Container */}
                    <div className="space-y-8 bg-white rounded-2xl p-6 shadow-lg">
                        {/* Price Filter Section - Comes FIRST */}
                        <PriceFilterCarousel 
                            activeFilter={priceFilter}
                            onFilterChange={handlePriceFilter}
                        />

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Category Filter Section - Comes SECOND */}
                        <CategoryFilterCarousel 
                            categories={categories}
                            activeCategory={categoryFilter}
                            onCategoryChange={handleCategoryFilter}
                        />
                    </div>

                    {/* Active Filters Display */}
                    {(categoryFilter || priceFilter !== PRICE_FILTER_TYPES.ALL) && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Filter size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Active Filters</h4>
                                        <p className="text-sm text-gray-600">Currently applied filters</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 flex-1">
                                    {priceFilter !== PRICE_FILTER_TYPES.ALL && (
                                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-purple-200">
                                            <div className={`w-3 h-3 rounded-full ${
                                                priceFilter === PRICE_FILTER_TYPES.FREE ? 'bg-green-500' : 'bg-yellow-500'
                                            }`}></div>
                                            <span className="font-medium text-gray-700">
                                                {priceFilter === PRICE_FILTER_TYPES.FREE ? 'Free Books' : 'Premium Books'}
                                            </span>
                                        </div>
                                    )}
                                    {categoryFilter && (
                                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-200">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="font-medium text-gray-700">{categoryFilter}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        setCategoryFilter('');
                                        setPriceFilter(PRICE_FILTER_TYPES.ALL);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                                >
                                    <X size={18} />
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Book Sections with Carousels */}
                {loading ? (
                    <div className="min-h-screen flex items-center justify-center">
                        <LoadingSpinner type="book" size={100} text="loading books..." fullScreen />
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
                    <>
                        {/* Results Header */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {searchQuery ? `Search results for "${searchQuery}"` : 'Filtered Books'}
                                    </h2>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {books.length} book{books.length !== 1 ? 's' : ''}
                                        </span>
                                        {priceFilter === PRICE_FILTER_TYPES.FREE && (
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                Free Only
                                            </span>
                                        )}
                                        {priceFilter === PRICE_FILTER_TYPES.PREMIUM && (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                                Premium Only
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCategoryFilter('');
                                        setPriceFilter(PRICE_FILTER_TYPES.ALL);
                                    }}
                                    className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium hover:underline transition-colors"
                                >
                                    Reset filters
                                </button>
                            </div>
                        </div>

                        {/* Books Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                        <div className="max-w-md mx-auto">
                            <div className="relative w-32 h-32 mx-auto mb-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                                <Book size={64} className="relative mx-auto text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No books found</h3>
                            <p className="text-gray-600 mb-6">
                                We couldn&apos;t find any books matching your criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('');
                                    setPriceFilter(PRICE_FILTER_TYPES.ALL);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
                            >
                                View All Books
                            </button>
                        </div>
                    </div>
                )}
                <CompactCommunityButtons></CompactCommunityButtons>
            </main>
            {/* Footer */}
            <Footer></Footer>
        </div>
    );
}