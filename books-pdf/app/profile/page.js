/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Trash2, Lock } from 'lucide-react';
import { Book, Search, Download, Eye, ArrowLeft, Filter, AlertCircle, IndianRupee, Library, User, LogOut, Menu, Home } from 'lucide-react';
import axios from 'axios';
import LoadingSpinner, { PageLoader, ButtonLoader } from '@/components/LoadingSpinner';
import showToast from '@/lib/toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Delete Account Component
const DeleteAccountModal = ({ isOpen, onClose }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const handleDelete = async () => {
    if (confirmText.toLowerCase() === 'delete') {
      setIsDeleting(true);
      setError('');
      let userId = user._id;
      if (!password) {
        setError('Please enter your password');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
        'http://localhost:5000/api/auth/account',
        {
          data: { password, userId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
        localStorage.removeItem('token');
        showToast.success('Account Deleted successfully!');
        window.location.href = '/login';
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete account');
        setIsDeleting(false);
        showToast.error('Account deletion Failed. Please try again.');
      }
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-red-600">Delete Account</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-semibold mb-2">⚠️ Warning: This action is irreversible!</p>
            <ul className="text-red-700 text-sm space-y-1 ml-4">
              <li>• All your data will be permanently deleted</li>
              <li>• Your profile will be removed immediately</li>
              <li>• You will lose access to all services</li>
            </ul>
          </div>
          
          <p className="text-gray-600 mb-4">
            Type <span className="font-bold text-gray-900">DELETE</span> to confirm account deletion:
          </p>
          <div>
            <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ">
              Enter your password to confirm
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText.toLowerCase() !== 'delete' || isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
// Change Password Component
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isChanging, setIsChanging] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwords.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validatePassword()) {
      setIsChanging(true);
      setErrors({});
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          'http://localhost:5000/api/auth/change-password',
          {
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setSuccessMessage('Password changed Successfully!');
        setTimeout(() => {
          onClose();
          setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setSuccessMessage('');
          showToast.success('Password Updated Successfully!');
        }, 2000);
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Failed to change password' });
        showToast.error('Password not Changed. Please try again.');
      } finally {
        setIsChanging(false);
      }
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        {successMessage && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.submit}
          </div>
        )}
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isChanging}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            {isChanging ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Profile Page Component
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { logout, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: ''
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => {
      setMobileMenuOpen(!mobileMenuOpen);
      };

      const closeMobileMenu = () => {
        setMobileMenuOpen(false);
      };

      const handleNavigation = (path) => {
        router.push(path);
        closeMobileMenu();
      };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.data);
      setFormData({
        fullName: response.data.fullName,
        email: response.data.email,
        mobileNumber: response.data.mobileNumber || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUser(response.data);
      setIsEditing(false);
      fetchProfile();
      showNotification('Profile updated successfully!');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber || ''
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
            try {
                await logout();
                showToast.success('Logged out successfully!');
            } catch (error) {
                showToast.error('Failed to logout. Please try again.');
            }
        };


  const handleBack = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-fade-in`}>
          {notification.message}
        </div>
      )}

      {/* Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  {/* Left: Back Button (Desktop) / Logo (Mobile) */}
                  <div className="flex items-center gap-3">
                    {/* Mobile: Hamburger Menu */}
                    <button
                      onClick={toggleMobileMenu}
                      className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
                      aria-label="Toggle menu" >
                      {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Desktop: Back Button */}
                    <button
                      onClick={() => handleNavigation('/')}
                      className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <ArrowLeft size={20} />
                      <span>Back to Home</span>
                    </button>

                    {/* Mobile: Logo */}
                    <div className="flex items-center gap-2 lg:hidden">
                      <Book className="text-blue-600" size={24} />
                      <span className="text-lg font-bold text-gray-800">My Profile</span>
                    </div>
                  </div>

                  {/* Center: Title (Desktop Only) */}
                  <div className="hidden lg:flex items-center gap-2">
                    <Book className="text-blue-600" size={28} />
                    <span className="text-2xl font-bold text-gray-800">My Profile</span>
                  </div>

                  {/* Right: Navigation (Desktop) / User Menu (Mobile) */}
                  <div className="hidden lg:flex items-center gap-3">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </button>
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
                  </div>

                  {/* Mobile: User Avatar/Icon */}
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="lg:hidden p-2 text-gray-700 hover:text-blue-600"
                  >
                    <User size={24} />
                  </button>
                </div>
              </div>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
                  <nav className="container mx-auto px-4 py-4">
                    <div className="space-y-2">
                      {/* Home */}
                      <button
                        onClick={() => handleNavigation('/')}
                        className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                      >
                        <Home size={20} />
                        <span className="font-medium">Home</span>
                      </button>

                      {/* My Library */}
                      <button
                        onClick={() => handleNavigation('/my-library')}
                        className="w-full flex items-center gap-3  text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                      >
                        <Library size={20} />
                        <span className="font-medium">My Library</span>
                      </button>

                      {/* Profile */}
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg"
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

      <div className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="text-2xl sm:text-3xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none px-2 py-1"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.fullName}</h1>
                )}
                
                <div className="flex gap-2 justify-center sm:justify-start">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <X size={16} />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 justify-center sm:justify-start mt-2">
                <Calendar size={16} />
                <span>
                  Joined {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-lg p-4 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="font-medium text-gray-900 border-b border-blue-500 focus:outline-none w-full truncate text-sm sm:text-base"
                  />
                ) : (
                  <p className="font-medium text-gray-900 truncate text-sm sm:text-base">{user?.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <Phone size={20} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-500">Mobile Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="font-medium text-gray-900 border-b border-blue-500 focus:outline-none w-full text-sm sm:text-base"
                  />
                ) : (
                  <p className="font-medium text-gray-900 text-sm sm:text-base">{user?.mobileNumber || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6">Security & Privacy</h2>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-200 p-2 rounded-full group-hover:bg-blue-300 transition-colors">
                  <Lock size={20} className="text-blue-700" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Change Password</p>
                  <p className="text-xs sm:text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
              <span className="text-blue-600 text-xl">&rarr;</span>
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-3 sm:p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-red-200 p-2 rounded-full group-hover:bg-red-300 transition-colors">
                  <Trash2 size={20} className="text-red-700" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Delete Account</p>
                  <p className="text-xs sm:text-sm text-gray-600">Permanently remove your account</p>
                </div>
              </div>
              <span className="text-red-600 text-xl">&rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
      
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default ProfilePage;