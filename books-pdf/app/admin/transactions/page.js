'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { IndianRupee, CheckCircle, XCircle, Clock, RefreshCw, ChevronLeft, ChevronRight, Search, Download, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

export default function TransactionsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Store the current page URL
        const currenturl = `/admin/transactions`;
        localStorage.setItem('redirectAfterLogin', currenturl);

    useEffect(() => {
        if (user?.isAdmin) {
            loadTransactions();
        } else {
            router.push('/');
        }
    }, [user]);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/payments/transactions');
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and search transactions
    const getFilteredTransactions = () => {
        let filtered = transactions;

        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter(txn => txn.paymentStatus === filter);
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(txn => 
                txn.transactionId?.toLowerCase().includes(query) ||
                txn.user?.fullName?.toLowerCase().includes(query) ||
                txn.book?.title?.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    const filteredTransactions = getFilteredTransactions();

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery]);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'COMPLETED':
                return <CheckCircle className="text-green-600" size={18} />;
            case 'FAILED':
                return <XCircle className="text-red-600" size={18} />;
            case 'PENDING':
                return <Clock className="text-yellow-600" size={18} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Statistics
    const stats = {
        total: transactions.length,
        completed: transactions.filter(t => t.paymentStatus === 'COMPLETED').length,
        pending: transactions.filter(t => t.paymentStatus === 'PENDING').length,
        failed: transactions.filter(t => t.paymentStatus === 'FAILED').length,
        totalRevenue: transactions
            .filter(t => t.paymentStatus === 'COMPLETED')
            .reduce((sum, t) => sum + t.amount, 0)
    };

    
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Responsive */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/admin')}
                                className="text-blue-600 hover:text-blue-800 lg:hidden"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-xl sm:text-2xl text-gray-700 font-bold">
                                <span className="hidden sm:inline">Payment Transactions</span>
                                <span className="sm:hidden">Transactions</span>
                            </h1>
                        </div>
                        <button
                            onClick={loadTransactions}
                            disabled={loading}
                            className="p-2 sm:px-4 sm:py-2 text-purple-600 bg-white rounded-lg hover:bg-gray-100 flex items-center gap-2 border border-gray-200"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden text-purple-600 sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-4 sm:py-8">
                {/* Statistics Cards - Responsive */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Completed</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Pending</p>
                        <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Failed</p>
                        <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.failed}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 col-span-2 lg:col-span-1">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Revenue</p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center gap-1">
                            <IndianRupee size={18} />
                            {stats.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Search Bar - Responsive */}
                <div className="mb-4 sm:mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search transactions, users, books..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 sm:py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        />
                    </div>
                </div>

                {/* Filters - Responsive */}
                <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
                    {['all', 'COMPLETED', 'PENDING', 'FAILED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all text-xs sm:text-sm ${
                                filter === status
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {status === 'all' ? 'All' : status}
                            {status !== 'all' && (
                                <span className="ml-1 sm:ml-2 bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full text-xs">
                                    {status === 'COMPLETED' && stats.completed}
                                    {status === 'PENDING' && stats.pending}
                                    {status === 'FAILED' && stats.failed}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Results Info */}
                <div className="mb-4 text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Transaction ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Book
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="animate-spin text-blue-600" size={32} />
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    currentTransactions.map(txn => (
                                        <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-900">
                                                {txn.transactionId}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {txn.user?.fullName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs truncate">
                                                    {txn.book?.title || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                <div className="flex items-center gap-1">
                                                    <IndianRupee size={14} />
                                                    {txn.amount}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.paymentStatus)}`}>
                                                    {getStatusIcon(txn.paymentStatus)}
                                                    {txn.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(txn.updatedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center">
                            <RefreshCw className="animate-spin text-blue-600" size={32} />
                        </div>
                    ) : currentTransactions.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                            No transactions found
                        </div>
                    ) : (
                        currentTransactions.map(txn => (
                            <div key={txn._id} className="bg-white rounded-lg shadow p-4">
                                {/* Status Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.paymentStatus)}`}>
                                        {getStatusIcon(txn.paymentStatus)}
                                        {txn.paymentStatus}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(txn.purchasedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {/* Transaction Details */}
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500">Transaction ID</p>
                                        <p className="text-sm font-mono text-gray-900 break-all">{txn.transactionId}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">User</p>
                                            <p className="text-sm text-gray-900 truncate">{txn.user?.fullName || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Amount</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                                                <IndianRupee size={12} />
                                                {txn.amount}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">Book</p>
                                        <p className="text-sm text-gray-900 line-clamp-2">{txn.book?.title || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination - Responsive */}
                {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Page Info */}
                        <div className="text-sm text-gray-600 order-2 sm:order-1">
                            Page {currentPage} of {totalPages}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center gap-2 text-gray-700 order-1 sm:order-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            {/* Page Numbers - Desktop */}
                            <div className="hidden sm:flex items-center gap-1">
                                {/* First Page */}
                                {currentPage > 3 && (
                                    <>
                                        <button
                                            onClick={() => goToPage(1)}
                                            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                        >
                                            1
                                        </button>
                                        {currentPage > 4 && <span className="px-2">...</span>}
                                    </>
                                )}

                                {/* Pages around current */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(page => {
                                        return page === currentPage || 
                                               page === currentPage - 1 || 
                                               page === currentPage + 1;
                                    })
                                    .map(page => (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-3 py-2 rounded-lg border transition-colors ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                {/* Last Page */}
                                {currentPage < totalPages - 2 && (
                                    <>
                                        {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                                        <button
                                            onClick={() => goToPage(totalPages)}
                                            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Page Numbers - Mobile (Simplified) */}
                            <div className="sm:hidden flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {currentPage} / {totalPages}
                                </span>
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Items per page info */}
                        <div className="text-xs text-gray-500 order-3">
                            {itemsPerPage} items per page
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}