'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Upload, Trash2, Edit, Eye, EyeOff, Menu, X } from 'lucide-react';
import { bookAPI } from '@/lib/api';
import { adminAPI } from '@/lib/api';
import ImageUpload from '@/components/ImageUpload';
import showToast from '@/lib/toast';

export default function AdminPanel() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        thumbnailBase64: '',
        pdfDriveLink: '',
        previewText: '',
        price: '0',
        isPaid: false,
        category: 'Other',
        tags: '',
        isPublished: true
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (!authLoading && (!user || !user.isAdmin)) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user?.isAdmin) {
            loadBooks();
        }
    }, [user]);

    const loadBooks = async () => {
        try {
            const response = await bookAPI.getAll();
            setBooks(response.data.data);
        } catch (error) {
            alert('Error loading books: ' + error.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageSelect = (base64) => {
        setFormData(prev => ({ ...prev, thumbnailBase64: base64 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.pdfDriveLink) {
            alert('Please fill all required fields');
            return;
        }

        if (!formData.thumbnailBase64 && !editingId) {
            alert('Please upload a thumbnail image');
            return;
        }

        try {
            setLoading(true);
            
            const submitData = {
                ...formData,
                price: parseFloat(formData.price)
            };

            if (editingId) {
                await adminAPI.updateBook(editingId, submitData);
                showToast.success('Book updated successfully!')
                setEditingId(null);
            } else {
                await adminAPI.createBook(submitData);
                showToast.success('Book Created successfully!')
            }

            // Reset form
            setFormData({
                title: '',
                author: '',
                description: '',
                thumbnailBase64: '',
                pdfDriveLink: '',
                previewText: '',
                price: '0',
                isPaid: false,
                category: 'Other',
                tags: '',
                isPublished: true
            });

            loadBooks();
            setShowMobileMenu(false);
        } catch (error) {
            alert('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (book) => {
        setFormData({
            title: book.title,
            author: book.author || '',
            description: book.description,
            thumbnailBase64: book.thumbnail?.data || '',
            pdfDriveLink: book.pdfDriveLink,
            previewText: book.previewText || '',
            price: book.price.toString(),
            isPaid: book.isPaid,
            category: book.category,
            tags: book.tags?.join(', ') || '',
            isPublished: book.isPublished !== undefined ? book.isPublished : true
        });
        setEditingId(book._id);
        setShowMobileMenu(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            await adminAPI.deleteBook(id);
            showToast.success('Book deleted successfully!')
            loadBooks();
        } catch (error) {
            alert('Error deleting book: ' + error.message);
            showToast.error('Error deleting book: ' + error.message)
        }
    };

    const togglePublish = async (bookId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await adminAPI.updateBook(bookId, { isPublished: newStatus });
            
            showToast.success(
                newStatus 
                    ? 'Book published successfully!' 
                    : 'Book unpublished successfully!'
            );
            
            // Update local state
            setBooks(books.map(book => 
                book._id === bookId 
                    ? { ...book, isPublished: newStatus }
                    : book
            ));
        } catch (error) {
            showToast.error('Error updating book status: ' + error.message);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '',
            author: '',
            description: '',
            thumbnailBase64: '',
            pdfDriveLink: '',
            previewText: '',
            price: '0',
            isPaid: false,
            category: 'Other',
            tags: '',
            isPublished: true
        });
        setShowMobileMenu(false);
    };

    if (authLoading || !user?.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const publishedCount = books.filter(book => book.isPublished !== false).length;
    const unpublishedCount = books.length - publishedCount;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-cyan-800">Admin Panel</h1>
                            <div className="flex flex-wrap gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs sm:text-sm">
                                <span className="text-green-600 font-semibold">
                                    Published: {publishedCount}
                                </span>
                                <span className="text-gray-600 font-semibold">
                                    Unpublished: {unpublishedCount}
                                </span>
                                <span className="text-purple-600 font-semibold">
                                    Total: {books.length}
                                </span>
                            </div>
                        </div>
                        
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                        >
                            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        
                        {/* Desktop Back Button */}
                        <button
                            onClick={() => router.push('/')}
                            className="hidden md:block px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-4 sm:py-8">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Upload Form */}
                    <div className={`bg-white text-gray-800 p-4 sm:p-6 rounded-lg shadow-lg ${
                        showMobileMenu ? 'block' : 'hidden md:block'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold">
                                {editingId ? 'Edit Book' : 'Upload New Book'}
                            </h2>
                            <button
                                onClick={() => router.push('/')}
                                className="md:hidden px-3 py-1 text-sm bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
                            >
                                Home
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Book Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Enter book title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Enter author name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Enter book description"
                                ></textarea>
                            </div>

                            <ImageUpload
                                onImageSelect={handleImageSelect}
                                currentImage={formData.thumbnailBase64}
                            />

                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Google Drive PDF Link *
                                </label>
                                <input
                                    type="text"
                                    name="pdfDriveLink"
                                    value={formData.pdfDriveLink}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="https://drive.google.com/file/d/..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Paste the shareable Google Drive link
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Preview Text
                                </label>
                                <textarea
                                    name="previewText"
                                    value={formData.previewText}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Enter preview text"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                >
                                    <option value="Education">Education</option>
                                    <option value="Business">Business</option>
                                    <option value="Design">Design</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Religious">Religious</option>
                                    <option value="Spiritual">Spiritual</option>
                                    <option value="Relationship">Relationship</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="javascript, react, frontend"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                />
                                <label className="text-xs sm:text-sm text-gray-800 font-semibold">
                                    This is a paid book
                                </label>
                            </div>

                            {formData.isPaid && (
                                <div>
                                    <label className="block text-sm sm:text-md text-gray-800 font-semibold mb-2">
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                        placeholder="0"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                />
                                <label className="text-xs sm:text-sm text-gray-800 font-semibold">
                                    Publish book immediately
                                </label>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm sm:text-base ${
                                        loading
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                                >
                                    <Upload size={18} />
                                    {editingId ? 'Update Book' : 'Upload Book'}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-6 py-2.5 sm:py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm sm:text-base font-semibold"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Books List */}
                    <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-lg ${
                        showMobileMenu ? 'hidden md:block' : 'block'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl sm:text-2xl text-gray-600 font-bold">
                                Books ({books.length})
                            </h2>
                            <button
                                onClick={() => setShowMobileMenu(true)}
                                className="md:hidden px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-1"
                            >
                                <Upload size={16} />
                                Add Book
                            </button>
                        </div>
                        
                        <div className="space-y-3 text-gray-600 max-h-[calc(100vh-200px)] sm:max-h-[800px] overflow-y-auto">
                            {books.map((book) => {
                                const isPublished = book.isPublished !== false;
                                
                                return (
                                    <div
                                        key={book._id}
                                        className={`border p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all ${
                                            isPublished 
                                                ? 'border-gray-200 bg-white hover:bg-gray-50' 
                                                : 'border-gray-300 bg-gray-50 opacity-75'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 flex-1 w-full sm:w-auto">
                                            <img
                                                src={
                                                    book.thumbnail?.data
                                                        ? `data:${book.thumbnail.contentType};base64,${book.thumbnail.data}`
                                                        : '/placeholder-book.jpg'
                                                }
                                                alt={book.title}
                                                className="w-12 h-16 sm:w-12 sm:h-16 object-cover rounded flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2 flex-wrap">
                                                    <h3 className="font-semibold text-sm sm:text-base break-words">
                                                        {book.title}
                                                    </h3>
                                                    {!isPublished && (
                                                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded whitespace-nowrap">
                                                            Unpublished
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                                    {book.isPaid ? `₹${book.price}` : 'FREE'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Downloads: {book.downloadCount || 0}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                                            <button
                                                onClick={() => togglePublish(book._id, isPublished)}
                                                className={`p-2 rounded transition-colors ${
                                                    isPublished
                                                        ? 'text-orange-600 hover:bg-orange-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                }`}
                                                title={isPublished ? 'Unpublish' : 'Publish'}
                                            >
                                                {isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleEdit(book)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}