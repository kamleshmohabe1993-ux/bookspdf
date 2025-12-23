'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Book, LogIn } from 'lucide-react';
import Link from 'next/link';
import showToast from '@/lib/toast';
export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        console.log("redirectUrl login", redirectUrl);
        if (redirectUrl) {
            // Clear the redirect URL
            localStorage.removeItem('redirectAfterLogin');
            
            // Redirect to saved page
            console.log('Redirecting to:', redirectUrl);
            router.push(redirectUrl);
        } else {
            // Default redirect
            router.push('/');
        }
        if (result.success) {
            // router.push('/');
            showToast.success('Login successful!');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                <div className="flex items-center justify-center mb-6">
                    <Book className="text-blue-600 mr-2" size={40} />
                    <h1 className="text-3xl font-bold text-gray-800">BooksnPDF</h1>
                </div>

                <h2 className="text-2xl font-bold text-purple-500 text-center mb-6">Login</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-md text-gray-700 font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-md text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            required
                            className="w-full px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        <LogIn size={20} />
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-sm text-center">
                    <p className="text-gray-600">
                        If forgot your password?{' '}
                        <Link href="/forget-password" className="text-blue-600 text-sm hover:underline font-semibold">
                            Forgot Password
                        </Link>
                    </p>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Dont have an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-gray-600 hover:underline text-sm">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}