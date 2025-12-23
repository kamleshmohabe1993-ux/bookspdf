// pages/admin/users/index.js - Updated Admin Users Dashboard
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Users, UserCheck, UserX, DollarSign, 
  Mail, Phone, Calendar, Shield, 
  Search, Filter, Download, Plus,
  ChevronLeft, ChevronRight, MoreVertical,
  Edit, Trash2, Eye, BarChart3, 
  RefreshCw, ArrowLeft, CheckCircle,
  XCircle, Clock, IndianRupee,
  TrendingUp, TrendingDown, UserPlus,
  MessageSquare, CreditCard, Activity,
  ShieldCheck, ShieldOff, AlertCircle
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminUsersDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  
  // Dashboard Statistics
  const [dashboardStats, setDashboardStats] = useState({
    overview: {
      total: 0,
      active: 0,
      inactive: 0,
      verified: 0,
      unverified: 0,
      admins: 0
    },
    revenue: {
      totalRevenue: 0,
      averageRevenuePerUser: 0
    },
    registrationTrends: [],
    topSpenders: [],
    recentUsers: []
  });
  
  // Filters and Search
  const [filters, setFilters] = useState({
    status: 'all',
    verified: 'all',
    search: '',
    sortBy: 'recent'
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 50, // Match backend default
    totalPages: 1,
    totalItems: 0
  });

  // Bulk Actions
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  // Check admin access
  useEffect(() => {
    if (!user?.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch all users data based on backend API
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.verified !== 'all' && { verified: filters.verified }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy
      };

      const response = await api.get('/auth/users', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = response.data;
      
      if (data.success) {
        setAllUsers(data.data || []);
        
        // Update pagination info
        setPagination(prev => ({
          ...prev,
          totalPages: data.pages || 1,
          totalItems: data.total || 0
        }));
        
        // Update stats if provided
        if (data.stats) {
          setDashboardStats(prev => ({
            ...prev,
            overview: data.stats
          }));
        }
      } else {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed statistics from backend
  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/auth/userstats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = response.data;
      
      if (data.success) {
        setDashboardStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllUsers();
      fetchDashboardStats();
    }
  }, [user, pagination.currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    setSelectedUsers(new Set()); // Clear selections
  };

  // Handle user selection
  const handleUserSelect = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedUsers.size === allUsers.length) {
      setSelectedUsers(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = allUsers.map(user => user._id);
      setSelectedUsers(new Set(allIds));
      setShowBulkActions(true);
    }
  };

  // Apply bulk action
  const applyBulkAction = async () => {
    if (!bulkAction || selectedUsers.size === 0) return;
    
    const userIds = Array.from(selectedUsers);
    
    try {
      const response = await api.post('/auth/bulk-action', {
        userIds,
        action: bulkAction
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Refresh data
        fetchAllUsers();
        setSelectedUsers(new Set());
        setShowBulkActions(false);
        setBulkAction('');
        alert(`${response.data.data.modifiedCount} users ${bulkAction} successfully`);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Bulk action error:', error.response?.data || error.message);
      alert('Failed to perform bulk action');
    }
  };

  // Export users to CSV
  const handleExportUsers = async () => {
    try {
      const params = {
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.verified !== 'all' && { verified: filters.verified })
      };

      const response = await api.get('/auth/exportusers', {
        params,
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob' // Important for file download
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-export-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      console.error('Export error:', error.response?.data || error.message);
      alert('Failed to export users');
    }
  };

  // Individual user actions
  const handleViewUserDetails = (userId) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    
    try {
      const response = await api.put(`/auth/${userId}/toggle-status`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchAllUsers();
        alert(response.data.message);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Toggle status error:', error.response?.data || error.message);
      alert('Failed to update user status');
    }
  };

  const handleVerifyUser = async (userId, isVerified) => {
    if (isVerified) {
      alert('User is already verified');
      return;
    }
    
    if (!confirm('Manually verify this user?')) return;
    
    try {
      const response = await api.put(`/auth/${userId}/verify`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchAllUsers();
        alert(response.data.message);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Verify error:', error.response?.data || error.message);
      alert('Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Delete user "${userName}" permanently? This action cannot be undone.`)) return;
    
    try {
      const response = await api.delete(`/auth/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchAllUsers();
        alert(response.data.message);
      } else {
        alert(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      alert('Failed to delete user');
    }
  };

  // Render user status badge
  const renderStatusBadge = (user) => {
    if (!user.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <XCircle size={10} />
          Inactive
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
        <CheckCircle size={10} />
        Active
      </span>
    );
  };

  // Render verification badge
  const renderVerificationBadge = (isVerified) => {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
        isVerified 
          ? 'bg-blue-100 text-blue-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {isVerified ? <ShieldCheck size={10} /> : <AlertCircle size={10} />}
        {isVerified ? 'Verified' : 'Unverified'}
      </span>
    );
  };

  // Render role badge
  const renderRoleBadge = (user) => {
    if (user.isAdmin) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
          <Shield size={10} />
          Admin
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
        <Users size={10} />
        User
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/admin')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                <p className="text-sm text-gray-600">Manage all registered users</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportUsers}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={fetchAllUsers}
                disabled={loading}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.overview.total?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All registered users</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardStats.overview.active?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <UserCheck className="text-green-600" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {dashboardStats.overview.total > 0 
                ? `${Math.round((dashboardStats.overview.active / dashboardStats.overview.total) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardStats.overview.verified?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ShieldCheck className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {dashboardStats.overview.total > 0 
                ? `${Math.round((dashboardStats.overview.verified / dashboardStats.overview.total) * 100)}% of total`
                : '0% of total'
              }
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardStats.overview.inactive?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <UserX className="text-red-600" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Deactivated accounts</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-600 flex items-center gap-1">
                  <IndianRupee size={18} />
                  {dashboardStats.revenue.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <DollarSign className="text-purple-600" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Avg: ₹{dashboardStats.revenue.averageRevenuePerUser || 0}
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, mobile..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              
              <select
                value={filters.verified}
                onChange={(e) => handleFilterChange('verified', e.target.value)}
                className="px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
              
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name (A-Z)</option>
                <option value="purchases">Most Purchases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-blue-900">
                  {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="px-3 py-2 border text-gray-700 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose action...</option>
                  <option value="activate">Activate Users</option>
                  <option value="deactivate">Deactivate Users</option>
                  <option value="verify">Verify Users</option>
                </select>
                
                <button
                  onClick={applyBulkAction}
                  disabled={!bulkAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
                
                <button
                  onClick={() => {
                    setSelectedUsers(new Set());
                    setShowBulkActions(false);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {pagination.totalItems > 0 ? (
              <>
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                of {pagination.totalItems} users
              </>
            ) : (
              'No users found'
            )}
          </div>
          <div className="text-sm text-gray-500">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === allUsers.length && allUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <RefreshCw className="animate-spin text-blue-600" size={32} />
                        <p className="text-gray-600">Loading users...</p>
                      </div>
                    </td>
                  </tr>
                ) : allUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Users className="text-gray-400" size={48} />
                        <div>
                          <p className="text-gray-900 font-medium">No users found</p>
                          <p className="text-gray-600">Try adjusting your filters or search terms</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      {/* Checkbox */}
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(user._id)}
                          onChange={() => handleUserSelect(user._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      
                      {/* User Details */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {user.fullName || 'Unnamed User'}
                              </p>
                              {renderRoleBadge(user)}
                            </div>
                            <div className="text-sm text-gray-500 truncate">{user.email}</div>
                            {user.mobileNumber && (
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Phone size={10} />
                                {user.mobileNumber}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Stats */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            <IndianRupee size={12} />
                            {user.totalSpent?.toLocaleString() || 0} spent
                          </div>
                          <div className="text-xs text-gray-600">
                            {user.purchaseCount || 0} purchase{user.purchaseCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {renderStatusBadge(user)}
                          {renderVerificationBadge(user.isVerified)}
                        </div>
                      </td>
                      
                      {/* Joined */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-900">
                            {formatDate(user.createdAt)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.lastLogin ? `Last login: ${formatDate(user.lastLogin)}` : 'Never logged in'}
                          </div>
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewUserDetails(user._id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                            className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button
                            onClick={() => handleVerifyUser(user._id, user.isVerified)}
                            disabled={user.isVerified}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            title={user.isVerified ? 'Already Verified' : 'Verify User'}
                          >
                            <ShieldCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.fullName)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                  of {pagination.totalItems} users
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                          className={`px-3 py-1 rounded-lg ${
                            pagination.currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Top Spenders Section */}
        {dashboardStats.topSpenders && dashboardStats.topSpenders.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-green-600" />
              Top Spenders
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Total Spent</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Purchases</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardStats.topSpenders.slice(0, 5).map((spender, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{spender.fullName}</div>
                        <div className="text-xs text-gray-500">{spender.email}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-green-600">
                        ₹{spender.totalSpent.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {spender.purchaseCount} purchases
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}