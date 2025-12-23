'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Home } from 'lucide-react';
import Footer from '@/components/Footer'
const PageLayout = ({ title, subtitle, children, breadcrumbs = [] }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                        >
                            <Home size={20} />
                            <span className="hidden sm:inline">Back to Home</span>
                        </button>
                        
                        {/* Breadcrumbs */}
                        {breadcrumbs.length > 0 && (
                            <nav className="hidden md:flex items-center gap-2 text-sm">
                                {breadcrumbs.map((crumb, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        {index > 0 && <span className="text-gray-400">/</span>}
                                        <button
                                            onClick={() => crumb.link && router.push(crumb.link)}
                                            className={`${
                                                crumb.link
                                                    ? 'text-blue-600 hover:underline'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {crumb.label}
                                        </button>
                                    </div>
                                ))}
                            </nav>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
                    {subtitle && <p className="text-xl text-blue-100">{subtitle}</p>}
                </div>
            </section>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <Footer></Footer>
        </div>
    );
};

export default PageLayout;