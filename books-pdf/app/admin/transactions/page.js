'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { IndianRupee, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import api from '@/lib/api';

export default function TransactionsPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

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
            const response = await api.get('/payments/admin/transactions');
            setTransactions(response.data.data);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(txn => {
        if (filter === 'all') return true;
        return txn.paymentStatus === filter;
    });

    const getStatusIcon = (status) => {
        switch(status) {
            case 'COMPLETED':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'FAILED':
                return <XCircle className="text-red-600" size={20} />;
            case 'PENDING':
                return <Clock className="text-yellow-600" size={20} />;
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

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-bold">Payment Transactions</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Filters */}
                <div className="mb-6 flex gap-3">
                    {['all', 'COMPLETED', 'PENDING', 'FAILED'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {status === 'all' ? 'All' : status}
                        </button>
                    ))}
                    
                    <button
                        onClick={loadTransactions}
                        className="ml-auto px-4 py-2 bg-white rounded-lg hover:bg-gray-100 flex items-center gap-2"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTransactions.map(txn => (
                                <tr key={txn._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-mono">
                                        {txn.transactionId}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {txn.user?.fullName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {txn.book?.title || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold">
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
                                        {new Date(txn.purchasedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}