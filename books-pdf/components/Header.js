'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Book, Home, LogIn, User, LogOut, Menu, X, Library, Settings } from 'lucide-react';
import showToast from '@/lib/toast';

const Header = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        showToast.success('Logged out successfully!');
        router.push('/');
        setMobileMenuOpen(false);
        setProfileDropdown(false);
    };

    const navItems = [
        { label: 'Home', icon: Home, path: '/' },
        // { label: 'Categories', path: '/#categories' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => router.push('/')}
                    >
                        <div className="relative">
                            <Book className="text-blue-600 group-hover:text-purple-600 transition-colors" size={36} />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                BooknPDF
                            </span>
                            <p className="text-xs text-gray-500 hidden sm:block">Premium eBooks Store</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop User Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {user ? (
                            <>
                                <button
                                    onClick={() => router.push('/my-library')}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <Library size={20} />
                                    <span>My Library</span>
                                </button>
                                
                                {user.isAdmin && (
                                    <button
                                        onClick={() => router.push('/admin')}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                                    >
                                        <Settings size={20} />
                                        <span>Admin</span>
                                    </button>
                                )}

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileDropdown(!profileDropdown)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-700 max-w-[100px] truncate">
                                            {user.fullName}
                                        </span>
                                    </button>

                                    {profileDropdown && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-slide-down">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            
                                            <button
                                                onClick={() => {
                                                    router.push('/profile');
                                                    setProfileDropdown(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <User size={18} />
                                                <span>My Profile</span>
                                            </button>
                                            
                                            <button
                                                onClick={() => {
                                                    router.push('/my-library');
                                                    setProfileDropdown(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                            >
                                                <Library size={18} />
                                                <span>My Library</span>
                                            </button>

                                            <div className="border-t border-gray-100 mt-2 pt-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <LogOut size={18} />
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <LogIn size={20} />
                                    <span>Login</span>
                                </button>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4 animate-slide-down">
                        {/* User Info (Mobile) */}
                        {user && (
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.fullName}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <nav className="space-y-2 mb-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        router.push(item.path);
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-all flex items-center gap-3"
                                >
                                    {item.icon && <item.icon size={20} />}
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        {/* User Actions (Mobile) */}
                        {user ? (
                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => {
                                        router.push('/profile');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                                >
                                    <User size={20} />
                                    <span>My Profile</span>
                                </button>

                                <button
                                    onClick={() => {
                                        router.push('/my-library');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                                >
                                    <Library size={20} />
                                    <span>My Library</span>
                                </button>

                                {user.isAdmin && (
                                    <button
                                        onClick={() => {
                                            router.push('/admin');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg flex items-center gap-3"
                                    >
                                        <Settings size={20} />
                                        <span>Admin Panel</span>
                                    </button>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-3"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => {
                                        router.push('/login');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-3"
                                >
                                    <LogIn size={20} />
                                    <span>Login</span>
                                </button>
                                <button
                                    onClick={() => {
                                        router.push('/register');
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-center"
                                >
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;