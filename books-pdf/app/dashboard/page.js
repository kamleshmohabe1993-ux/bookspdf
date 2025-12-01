'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Book, ArrowLeft, Menu, X, Home, LayoutDashboard, Library, User, LogOut, ShoppingCart  } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import showToast from '@/lib/toast';
export default function DashboardPage({
  title = "BooksPDF",
  showBackButton = false,
  backUrl = "/",
  currentPage = ""
}) {
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout();
      showToast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      showToast.error('Logout failed');
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', protected: true },
    { id: 'library', label: 'My Library', icon: Library, path: '/my-library', protected: true },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile', protected: true }
  ];
  const router = useRouter();
  // const [user, setUser] = useState(null);
  const { user, logout, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogins: 24,
    accountAge: 0,
    lastLogin: new Date().toISOString()
  });
  
 
  
  useEffect(() => {
          if (user) {
          }
      }, [user, authLoading]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data);
      
      // Calculate account age in days
      const accountAge = Math.floor(
        (new Date() - new Date(response.data.createdAt)) / (1000 * 60 * 60 * 24)
      );
      setStats(prev => ({ ...prev, accountAge }));
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      setLoading(false);
    }
  };

   useEffect(()=>{
    fetchUserData()
  }),[];
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   router.push('/login');
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile: Hamburger Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-blue-600 p-1 sm:p-2 -ml-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Desktop: Back Button (if enabled) */}
              {showBackButton && (
                <button
                  onClick={() => handleNavigation(backUrl)}
                  className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span>Back</span>
                </button>
              )}

              {/* Mobile: Logo & Title */}
              <div 
                className="flex items-center gap-2 lg:hidden cursor-pointer"
                onClick={() => handleNavigation('/')}
              >
                <Book className="text-blue-600" size={22} />
                <span className="text-base sm:text-lg font-bold text-gray-800">{title}</span>
              </div>
            </div>

            {/* Center: Title (Desktop) */}
            <div 
              className="hidden lg:flex items-center gap-2 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <Book className="text-blue-600" size={28} />
              <span className="text-2xl font-bold text-gray-800">{title}</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  {/* Desktop: Navigation Links */}
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={() => handleNavigation('/my-library')}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Library size={20} />
                      <span>My Library</span>
                    </button>
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span>Profile</span>
                    </button>
                  </div>

                  {/* Mobile: Profile Icon */}
                  <button
                    onClick={() => handleNavigation('/profile')}
                    className="lg:hidden p-2 text-gray-700 hover:text-blue-600 rounded-lg"
                  >
                    <User size={22} />
                  </button>
                </>
              ) : (
                <>
                  {/* Desktop: Login/Register */}
                  <div className="hidden lg:flex items-center gap-2">
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleNavigation('/register')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Mobile: Login Icon */}
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="lg:hidden p-2 text-gray-700 hover:text-blue-600 rounded-lg"
                  >
                    <LogOut size={22} className="rotate-180" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="container mx-auto px-4 py-3">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  // Skip protected items if user not logged in
                  if (item.protected && !user) return null;

                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}

                {userData ? (
                  <>
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* User Info */}
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="font-semibold text-gray-900 text-sm truncate">{userData.name}</p>
                      <p className="text-xs text-gray-600 truncate">{userData.email}</p>
                    </div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg transition-colors"
                    >
                      <LogOut size={20} />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* Login */}
                    <button
                      onClick={() => handleNavigation('/login')}
                      className="w-full flex items-center gap-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 px-4 py-3 rounded-lg transition-colors"
                    >
                      <LogOut size={20} className="rotate-180" />
                      <span className="font-medium">Login</span>
                    </button>

                    {/* Register */}
                    <button
                      onClick={() => handleNavigation('/register')}
                      className="w-full flex items-center gap-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg transition-colors"
                    >
                      <User size={20} />
                      <span className="font-medium">Sign Up</span>
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Overlay when mobile menu is open */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.fullName}! 👋
              </h2>
              <p className="text-indigo-100">
                Here&apos;s what&apos;s happening with your account today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Logins</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalLogins}</p>
              </div>
              <div className="bg-indigo-100 rounded-full p-3">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">↑ 12% from last month</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Account Age</p>
                <p className="text-3xl font-bold text-gray-900">{stats.accountAge} days</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Last Login</p>
                <p className="text-3xl font-bold text-gray-900">Today</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Account Information</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium text-gray-900">{user?.fullName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-600">Account Status</p>
                        <p className="font-medium text-green-600">Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/profile')}
                  className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full p-2 mr-4">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Logged in successfully</p>
                      <p className="text-sm text-gray-500">Today at {new Date().toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Profile viewed</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 rounded-full p-2 mr-4">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Account created</p>
                      <p className="text-sm text-gray-500">{new Date(user?.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">Security Settings</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-700">Notifications</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md p-6 text-white">
              <div className="flex items-start">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-bold mb-2">Pro Tip</h4>
                  <p className="text-sm text-white text-opacity-90">
                    Keep your account secure by enabling two-factor authentication and regularly updating your password.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}