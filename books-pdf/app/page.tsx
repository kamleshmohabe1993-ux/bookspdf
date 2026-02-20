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

// Enhanced Carousel Component with Continuous Sliding
const BookCarousel = ({ books, title, icon, autoRotate = true, interval = 5000 }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [booksPerSlide, setBooksPerSlide] = useState(4);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const autoRotateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive books per slide
  useEffect(() => {
    const updateBooksPerSlide = () => {
      if (window.innerWidth < 640) {
        setBooksPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setBooksPerSlide(2);
      } else {
        setBooksPerSlide(4);
      }
    };

    updateBooksPerSlide();
    window.addEventListener('resize', updateBooksPerSlide);
    return () => window.removeEventListener('resize', updateBooksPerSlide);
  }, []);

  // Calculate how many times we need to duplicate books for infinite scroll
  const minSlidesForInfinite = 3;
  const duplicateCount = Math.max(minSlidesForInfinite, Math.ceil(booksPerSlide * 2 / books.length));
  const extendedBooks = [...books, ...books, ...books]; // Triple the books for smooth infinite scroll
  const totalSlides = extendedBooks.length;

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (autoRotateTimerRef.current) {
      clearTimeout(autoRotateTimerRef.current);
      autoRotateTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  // Start progress animation
  const startProgress = useCallback(() => {
    const startTime = Date.now();
    
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / interval) * 100, 100);
      setProgress(newProgress);
    }, 50);
  }, [interval]);

  // Pause carousel
  const pauseCarousel = useCallback((resumeAfter = 3000) => {
    clearAllTimers();
    setIsPaused(true);
    setProgress(0);

    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, resumeAfter);
  }, [clearAllTimers]);

  // Move to next book (one at a time)
  const moveNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      // Loop back to the start when reaching the end of first set
      if (next >= books.length) {
        return 0;
      }
      return next;
    });
    setProgress(0);
  }, [books.length]);

  // Move to previous book
  const movePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev - 1;
      // Loop to end when going below 0
      if (next < 0) {
        return books.length - 1;
      }
      return next;
    });
    setProgress(0);
  }, [books.length]);

  // Manual navigation
  const nextSlide = useCallback(() => {
    moveNext();
    pauseCarousel(3000);
  }, [moveNext, pauseCarousel]);

  const prevSlide = useCallback(() => {
    movePrev();
    pauseCarousel(3000);
  }, [movePrev, pauseCarousel]);

  // Auto-scroll (continuous)
  useEffect(() => {
    if (!autoRotate || isHovered || isPaused || books.length <= booksPerSlide) {
      clearAllTimers();
      setProgress(0);
      return;
    }

    clearAllTimers();
    startProgress();

    autoRotateTimerRef.current = setTimeout(() => {
      moveNext();
    }, interval);

    return () => clearAllTimers();
  }, [currentIndex, isHovered, isPaused, autoRotate, books.length, booksPerSlide, interval, clearAllTimers, startProgress, moveNext]);

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      // Swiped left - next
      nextSlide();
    } else {
      // Swiped right - previous
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Mouse drag handlers (for desktop)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragEnd(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const distance = dragStart - dragEnd;
    const minDragDistance = 50;

    if (Math.abs(distance) < minDragDistance) {
      setDragStart(0);
      setDragEnd(0);
      return;
    }

    if (distance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }

    setDragStart(0);
    setDragEnd(0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragStart(0);
    setDragEnd(0);
  };

  // Calculate visible books
  const getVisibleBooks = () => {
    const startIdx = currentIndex;
    const endIdx = startIdx + booksPerSlide;
    return extendedBooks.slice(startIdx, endIdx);
  };

  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
            {autoRotate && books.length > booksPerSlide && (
              <div className="flex items-center gap-2 mt-1">
                <div className={`text-xs font-medium ${
                  isPaused ? 'text-yellow-600' : isHovered ? 'text-gray-400' : 'text-blue-600'
                }`}>
                  {isPaused ? '⏸️ Paused (resuming...)' : isHovered ? '⏸️ Paused' : '▶️ Auto-sliding'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {books.length > booksPerSlide && (
          <div className="hidden md:flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-110 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all hover:scale-110 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {autoRotate && books.length > booksPerSlide && !isHovered && !isPaused && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Books Grid - Draggable/Swipeable */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="flex transition-transform duration-[800ms] ease-out"
          style={{ 
            transform: `translateX(calc(-${currentIndex * (100 / booksPerSlide)}% - ${currentIndex * (booksPerSlide === 1 ? 0 : 16)}px))`
          }}
        >
          {extendedBooks.map((book: BookType, index: number) => (
            <div
              key={`${book._id}-${index}`}
              className="flex-shrink-0 px-2"
              style={{ 
                width: `${100 / booksPerSlide}%`,
                minHeight: '420px'
              }}
            >
              <div className="transform transition-all duration-300 hover:scale-105 h-full">
                <BookCard book={book} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      {books.length > booksPerSlide && (
        <div className="flex md:hidden justify-center gap-4 mt-6">
          <button
            onClick={prevSlide}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all active:scale-95"
            aria-label="Next"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      )}

      {/* Position Indicator */}
      {books.length > booksPerSlide && (
        <div className="flex justify-center gap-1 mt-6">
          {books.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex % books.length
                  ? 'w-8 bg-blue-600' 
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* Status Badge */}
      {autoRotate && books.length > booksPerSlide && (
        <div className="absolute top-4 right-4 z-20">
          {isPaused ? (
            <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Resuming...
            </div>
          ) : isHovered ? (
            <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              Paused
            </div>
          ) : (
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Auto
            </div>
          )}
        </div>
      )}

      {/* Swipe Hint (Mobile only, shows on first load) */}
      {books.length > booksPerSlide && (
        <div className="md:hidden text-center mt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <span>👈</span> Swipe to browse <span>👉</span>
          </p>
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
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Price Type</h3>
      
      {/* Desktop View */}
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

      {/* Mobile View */}
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
      <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
      
      {/* Desktop View */}
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

      {/* Mobile View */}
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

    const filterPublishedBooks = (booksList: BookType[]) => {
        return booksList.filter(book => book.isPublished !== false);
    };

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
            
            const publishedBooks = filterPublishedBooks(allBooks);
            const filteredBooks = filterBooksByPrice(publishedBooks);
            
            setBooks(filteredBooks);
            classifyBooks(filteredBooks);
        } catch (error) {
            console.error('Error loading books:', error);
            showToast.error('Failed to load books. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const classifyBooks = (allBooks: BookType[]) => {
        const publishedBooks = filterPublishedBooks(allBooks);
        
        const featured = publishedBooks
            .filter(book => book.featured || (book.rating && book.rating >= 4.5))
            .slice(0, 8);
        
        const bestseller = publishedBooks
            .filter(book => book.bestseller)
            .slice(0, 8);
        
        const popular = publishedBooks
            .filter(book => book.popular)
            .slice(0, 8);
        
        const newBooks = [...publishedBooks]
            .sort((a, b) => b._id.localeCompare(a._id))
            .slice(0, 8);
        
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

    const showCarousels = !searchQuery && !categoryFilter && priceFilter === PRICE_FILTER_TYPES.ALL;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header></Header>

            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={closeMobileMenu}
                ></div>
            )}

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg mb-8">
                    <h1 className="text-4xl font-bold mb-2">PDF eBooks Marketplace</h1>
                    <p className="text-xl">Discover, Learn, and Grow with free and Premium eBooks</p>
                </div>

                {/* Search and Filter Section */}
                <div className="mb-8 space-y-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search books by title, author, or description..."
                            className="w-full pl-12 pr-4 py-3.5 border border-gray-300 text-gray-500 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="space-y-8 bg-white rounded-2xl p-6 shadow-lg">
                        <PriceFilterCarousel 
                            activeFilter={priceFilter}
                            onFilterChange={handlePriceFilter}
                        />

                        <div className="border-t border-gray-200"></div>

                        <CategoryFilterCarousel 
                            categories={categories}
                            activeCategory={categoryFilter}
                            onCategoryChange={handleCategoryFilter}
                        />
                    </div>

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

                {/* Book Sections */}
                {loading ? (
                    <div className="min-h-screen flex items-center justify-center">
                        <LoadingSpinner type="book" size={100} text="loading books..." fullScreen />
                    </div>
                ) : showCarousels ? (
                    <div className="space-y-16">
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
            <Footer></Footer>
        </div>
    );
}