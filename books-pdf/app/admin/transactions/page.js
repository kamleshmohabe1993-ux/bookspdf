'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
    IndianRupee, CheckCircle, XCircle, Clock, RefreshCw, ChevronLeft, 
    ChevronRight, Search, Download, ArrowLeft, Trash2, AlertTriangle, 
    Eye, X, User, Book, Calendar, CreditCard
} from 'lucide-react';
import api from '@/lib/api';
import showToast from '@/lib/toast';

export default function TransactionsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
            setSelectedTransactions([]); // Clear selection on reload
        } catch (error) {
            console.error('Error loading transactions:', error);
            showToast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransaction = async (merchantOrderId, forceDelete = false) => {
        try {
            setActionLoading(true);
            
            const url = forceDelete 
                ? `/payments/transactions/${merchantOrderId}?force=true`
                : `/payments/transactions/${merchantOrderId}`;

            const response = await api.delete(url);

            if (response.data.success) {
                showToast.success(response.data.message);
                setShowDeleteModal(false);
                setDeleteTarget(null);
                loadTransactions();
            } else if (response.data.requiresForce) {
                // Show confirmation for force delete
                const confirmed = window.confirm(
                    `⚠️ WARNING: This is a ${response.data.data.status} transaction.\n\n` +
                    `Amount: ₹${response.data.data.amount}\n` +
                    `User: ${response.data.data.userId}\n` +
                    `Book: ${response.data.data.bookId}\n\n` +
                    `Are you absolutely sure you want to delete this transaction? This action cannot be undone.`
                );
                
                if (confirmed) {
                    await handleDeleteTransaction(merchantOrderId, true);
                }
            }
        } catch (error) {
            console.error('Delete error:', error);
            const errorMsg = error.response?.data?.error || 'Failed to delete transaction';
            showToast.error(errorMsg);
            
            // Check if force is required
            if (error.response?.data?.requiresForce) {
                const confirmed = window.confirm(
                    `⚠️ WARNING: This is a ${error.response.data.data.status} transaction.\n\n` +
                    `Amount: ₹${error.response.data.data.amount}\n` +
                    `User: ${error.response.data.data.userId}\n` +
                    `Book: ${error.response.data.data.bookId}\n\n` +
                    `Are you absolutely sure you want to delete this transaction? This action cannot be undone.`
                );
                
                if (confirmed) {
                    await handleDeleteTransaction(merchantOrderId, true);
                }
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkDelete = async (forceDelete = false) => {
        try {
            setActionLoading(true);

            const response = await api.post('/payments/transactions/bulk-delete', {
                transactionIds: selectedTransactions,
                force: forceDelete
            });

            if (response.data.success) {
                showToast.success(response.data.message);
                setSelectedTransactions([]);
                setShowDeleteModal(false);
                loadTransactions();
            }
        } catch (error) {
            console.error('Bulk delete error:', error);
            const errorData = error.response?.data;
            
            if (errorData?.requiresForce) {
                const confirmed = window.confirm(
                    `⚠️ WARNING: ${errorData.data.protectedCount} of ${errorData.data.totalCount} transactions are COMPLETED or REFUNDED.\n\n` +
                    `Are you absolutely sure you want to delete ALL selected transactions? This action cannot be undone.`
                );
                
                if (confirmed) {
                    await handleBulkDelete(true);
                }
            } else {
                showToast.error(errorData?.error || 'Failed to delete transactions');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleCleanupFailed = async () => {
        const confirmed = window.confirm(
            '🧹 This will delete all FAILED transactions older than 30 days.\n\n' +
            'Are you sure you want to continue?'
        );

        if (!confirmed) return;

        try {
            setActionLoading(true);
            const response = await api.delete('/payments/transactions/cleanup?daysOld=30');
            
            if (response.data.success) {
                showToast.success(response.data.message);
                loadTransactions();
            }
        } catch (error) {
            console.error('Cleanup error:', error);
            showToast.error('Failed to cleanup transactions');
        } finally {
            setActionLoading(false);
        }
    };

    const toggleSelectTransaction = (merchantOrderId) => {
        setSelectedTransactions(prev => 
            prev.includes(merchantOrderId)
                ? prev.filter(id => id !== merchantOrderId)
                : [...prev, merchantOrderId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTransactions.length === currentTransactions.length) {
            setSelectedTransactions([]);
        } else {
            setSelectedTransactions(currentTransactions.map(t => t._id));
        }
    };

    // Filter and search transactions
    const getFilteredTransactions = () => {
        let filtered = transactions;

        if (filter !== 'all') {
            filtered = filtered.filter(txn => txn.status === filter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(txn => 
                txn.merchantOrderId?.toLowerCase().includes(query) ||
                txn.userId?.fullName?.toLowerCase().includes(query) ||
                txn.bookId?.title?.toLowerCase().includes(query)
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
            case 'REFUNDED':
                return <RefreshCw className="text-purple-600" size={18} />;
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
            case 'REFUNDED':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Statistics
    const stats = {
        total: transactions.length,
        completed: transactions.filter(t => t.status === 'COMPLETED').length,
        pending: transactions.filter(t => t.status === 'PENDING').length,
        failed: transactions.filter(t => t.status === 'FAILED').length,
        refunded: transactions.filter(t => t.status === 'REFUNDED').length,
        totalRevenue: transactions
            .filter(t => t.status === 'COMPLETED')
            .reduce((sum, t) => sum + t.amount, 0)
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/admin')}
                                className="text-blue-600 hover:text-blue-800 "
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-xl sm:text-2xl text-gray-700 font-bold">
                                <span className="hidden sm:inline">Payment Transactions</span>
                                <span className="sm:hidden">Transactions</span>
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCleanupFailed}
                                disabled={actionLoading}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={18} />
                                Cleanup
                            </button>
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
                </div>
            </header>

            <main className="container mx-auto px-4 py-4 sm:py-8">
                {/* Statistics Cards */}
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

                {/* Search Bar */}
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

                {/* Filters */}
                <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
                    {['all', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'].map(status => (
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
                                    {status === 'REFUNDED' && stats.refunded}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Selection Actions */}
                {selectedTransactions.length > 0 && (
                    <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                            {selectedTransactions.length} transaction(s) selected
                        </span>
                        <button
                            onClick={() => {
                                setDeleteTarget({ type: 'bulk', ids: selectedTransactions });
                                setShowDeleteModal(true);
                            }}
                            disabled={actionLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Selected
                        </button>
                    </div>
                )}

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
                                    <th className="px-4 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedTransactions.length === currentTransactions.length && currentTransactions.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </th>
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center">
                                            <div className="flex items-center justify-center">
                                                <RefreshCw className="animate-spin text-blue-600" size={32} />
                                            </div>
                                        </td>
                                    </tr>
                                ) : currentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                            No transactions found
                                        </td>
                                    </tr>
                                ) : (
                                    currentTransactions.map(txn => (
                                        <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTransactions.includes(txn._id)}
                                                    onChange={() => toggleSelectTransaction(txn._id)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-900">
                                                {txn.merchantOrderId}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div>
                                                    <p className="font-medium">{txn.userId?.fullName || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{txn.userId?.email || ''}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                <div className="max-w-xs truncate">
                                                    {txn.bookId?.title || 'N/A'}
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
                                                    {getStatusIcon(txn.status)}
                                                    {txn.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(txn.updatedAt).toLocaleDateString('en-IN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTransaction(txn);
                                                            setShowDetailModal(true);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteTarget({ type: 'single', id: txn._id });
                                                            setShowDeleteModal(true);
                                                        }}
                                                        disabled={actionLoading}
                                                        className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Delete Transaction"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </button>
                                                </div>
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
                                {/* Selection & Actions */}
                                <div className="flex items-center justify-between mb-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedTransactions.includes(txn._id)}
                                        onChange={() => toggleSelectTransaction(txn._id)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedTransaction(txn);
                                                setShowDetailModal(true);
                                            }}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeleteTarget({ type: 'single', id: txn._id });
                                                setShowDeleteModal(true);
                                            }}
                                            className="p-2 hover:bg-red-100 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(txn.paymentStatus)}`}>
                                        {getStatusIcon(txn.status)}
                                        {txn.status}
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
                                        <p className="text-sm font-mono text-gray-900 break-all">{txn.merchantOrderId}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">User</p>
                                            <p className="text-sm text-gray-900 truncate">{txn.userId?.fullName || 'N/A'}</p>
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
                                        <p className="text-sm text-gray-900 line-clamp-2">{txn.bookId?.title || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 order-2 sm:order-1">
                            Page {currentPage} of {totalPages}
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 order-1 sm:order-2">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <div className="hidden sm:flex items-center gap-1">
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

                            <div className="sm:hidden flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {currentPage} / {totalPages}
                                </span>
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div className="text-xs text-gray-500 order-3">
                            {itemsPerPage} items per page
                        </div>
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteTarget && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Confirm Deletion</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                {deleteTarget.type === 'bulk' 
                                    ? `Are you sure you want to delete ${deleteTarget.ids.length} transaction(s)? This action cannot be undone.`
                                    : 'Are you sure you want to delete this transaction? This action cannot be undone.'
                                }
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setDeleteTarget(null);
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (deleteTarget.type === 'bulk') {
                                            handleBulkDelete();
                                        } else {
                                            handleDeleteTransaction(deleteTarget.id);
                                        }
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Detail Modal */}
            {showDetailModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-800 mb-1">Transaction ID</p>
                                    <p className="font-mono text-sm text-gray-700 font-medium">{selectedTransaction.merchantOrderId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Status</p>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 text-gray-700 rounded-full text-xs font-semibold ${getStatusColor(selectedTransaction.paymentStatus)}`}>
                                        {getStatusIcon(selectedTransaction.status)}
                                        {selectedTransaction.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                                    <p className="text-xl font-bold text-gray-900 flex items-center gap-1">
                                        <IndianRupee size={18} />
                                        {selectedTransaction.amount}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Gateway</p>
                                    <p className="font-medium text-gray-700">{selectedTransaction.paymentGateway}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3 flex items-center text-gray-700 gap-2">
                                    <User size={18} />
                                    User Information
                                </h4>
                                <div className="space-y-2 bg-gray-50 text-gray-700 p-4 rounded-lg">
                                    <p><span className="text-gray-600">Name:</span> {selectedTransaction.userId?.fullName}</p>
                                    <p><span className="text-gray-600">Email:</span> {selectedTransaction.userId?.email}</p>
                                    <p><span className="text-gray-600">Phone:</span> {selectedTransaction.userId?.mobileNumber}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                    <Book size={18} />
                                    Book Information
                                </h4>
                                <div className="space-y-2 bg-gray-50 text-gray-700 p-4 rounded-lg">
                                    <p><span className="text-gray-600">Title:</span> {selectedTransaction.bookId?.title}</p>
                                    <p><span className="text-gray-600">Author:</span> {selectedTransaction.bookId?.author}</p>
                                    <p className="flex items-center gap-1">
                                        <span className="text-gray-600">Price:</span> 
                                        <IndianRupee size={14} />
                                        {selectedTransaction.bookId?.price}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                                    <Calendar size={18} />
                                    Timeline
                                </h4>
                                <div className="space-y-2 bg-gray-50 text-gray-700 p-4 rounded-lg">
                                    <p><span className="text-gray-600">Purchased:</span> {formatDate(selectedTransaction.createdAt)}</p>
                                    <p><span className="text-gray-600">Updated:</span> {formatDate(selectedTransaction.updatedAt)}</p>
                                </div>
                            </div>

                            {selectedTransaction.downloadToken && (
                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-3">Download Information</h4>
                                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                        <p><span className="text-gray-600">Downloads:</span> {selectedTransaction.downloadCount || 0} / {selectedTransaction.maxDownloads || 3}</p>
                                        <p><span className="text-gray-600">Expires:</span> {formatDate(selectedTransaction.downloadExpiresAt)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}