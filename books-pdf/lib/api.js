// frontend/src/lib/api.js

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    deleteProfile: (data) => api.delete('/auth/account', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    verifyResetPassword: (data) => api.post('/auth/verify-reset-otp', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    getAllUsers: () => api.get('/auth/users'),
    getUserStats: () => api.get('/auth/userstats'),
    exportUsers: () => api.get('//auth/exportusers'),
    getUserById: (data) => api.get('/auth/:id', data),
    toggleUserStatus: (data) => api.put('/auth/:id/toggle-status', data),
    verifyUser: (data) => api.put('/auth/:id/verify', data),
    deleteUser: (data) => api.delete('/auth/:id', data),
    bulkUserAction: (data) => api.post('/auth/bulk-action', data),
};

// Books API
export const bookAPI = {
    // Get all books
    getAll: (params) => api.get('/books', { params }),
    
    // Get single book
    getOne: (id) => api.get(`/books/${id}`),
    
    // Get book by ID (alias for compatibility)
    getById: (id) => api.get(`/books/${id}`),
    
    // Get categories
    getCategories: () => api.get('/books/categories'),
    
    // Get user's library
    getMyLibrary: () => api.get('/books/my-library'),
    
    // Download book
    downloadBook: (id) => api.get(`/books/${id}/download`, { 
        responseType: 'blob' 
    }),
    
    // Remove from library
    removeFromLibrary: (id) => api.delete(`/books/${id}/library`),
    
    // ⭐ RATING ENDPOINTS ⭐
    
    // Add or update review/rating
    addReview: (bookId, data) => api.post(`/books/${bookId}/reviews`, data),
    
    // Get all reviews for a book
    getReviews: (bookId) => api.get(`/books/${bookId}/reviews`),
    
    // Delete user's own review
    deleteReview: (bookId, reviewId) => api.delete(`/books/${bookId}/reviews/${reviewId}`),
    
    // Update existing review (same as addReview - backend handles both)
    updateReview: (bookId, data) => api.post(`/books/${bookId}/reviews`, data)
};

// Payment API
export const paymentAPI = {
    // Initiate payment
    initiate: (bookId) => api.post('/payments/initiate', { bookId }),
    
    // Free download
    freeDownload: (bookId) => api.post(`/payments/downloadfree/${bookId}`),
    
    // Verify payment
    verify: (transactionId) => api.post('/payments/verify', { transactionId }),
    
    // Get payment status
    getStatus: (transactionId) => api.get(`/payments/status/${transactionId}`),
    getMyPurchases: () => api.get('/payments/my-purchases'),

    // Get all payments
    getAllTransactions: () => api.get('/payments/transactions'),
    deleteTransaction: (data) => api.delete('/payments/:id', data),
    cleanupFailedTransactions: (data) => api.delete('/payments/bulk-delete', data),
    bulkDeleteTransactions: (data) => api.delete('/payments/cleanup', data),
};

// Orders API
export const orderAPI = {
    // Create order
    create: (data) => api.post('/orders', data),
    
    // Get user's orders
    getMyOrders: () => api.get('/orders/my-orders'),
    
    // Get order by ID
    getById: (id) => api.get(`/orders/${id}`)
};

// Admin API
export const adminAPI = {
    // Create book
    createBook: (data) => api.post('/books', data),
    
    // Update book
    updateBook: (id, data) => api.put(`/books/${id}`, data),
    
    // Delete book
    deleteBook: (id) => api.delete(`/books/${id}`),
    
    // Get all orders
    getAllOrders: () => api.get('/orders'),
    
    // Get statistics
    getStats: () => api.get('/stats')
};

export const ratingsAPI = {
    // Get all ratings for a book (public)
    getBookRatings: (bookId) => api.get(`/ratings/${bookId}`),
    
    // Get user's rating for a book (protected)
    getUserRating: (bookId) => api.get(`/ratings/user/${bookId}`),
    
    // Add new rating (protected)
    addRating: (data) => api.post('/ratings', data),
    
    // Delete rating (protected)
    deleteRating: (ratingId) => api.delete(`/ratings/${ratingId}`)
};
export default api;