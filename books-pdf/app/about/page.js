'use client';

import React from 'react';
import { ArrowLeft, Home, BookOpen, Target, Eye, Heart, Award, Users, Zap, Shield, Mail, Phone, MapPin, User } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
export default function AboutUsPage() {
    const values = [
        {
            icon: <BookOpen className="text-blue-600" size={32} />,
            title: 'Quality Content',
            description: 'We curate only the best books to ensure our readers get premium quality content every time.'
        },
        {
            icon: <Zap className="text-yellow-600" size={32} />,
            title: 'Instant Access',
            description: 'Get your books delivered instantly, no waiting, no shipping delays. Start reading immediately.'
        },
        {
            icon: <Shield className="text-green-600" size={32} />,
            title: 'Secure Platform',
            description: 'Your data and transactions are protected with industry-leading security measures.'
        },
        {
            icon: <Heart className="text-red-600" size={32} />,
            title: 'Customer First',
            description: 'Your satisfaction is our priority. We\'re here to help you every step of the way.'
        }
    ];

    const stats = [
        { number: '10,000+', label: 'Books Available' },
        { number: '50,000+', label: 'Happy Readers' },
        { number: '100+', label: 'Categories' },
        { number: '24/7', label: 'Support Available' }
    ];

    const milestones = [
        {
            year: '2020',
            title: 'Founded',
            description: 'BooksPDF was established with a vision to make digital books accessible to everyone.'
        },
        {
            year: '2021',
            title: 'Rapid Growth',
            description: 'Expanded our collection to 5,000+ books and served 10,000+ readers.'
        },
        {
            year: '2022',
            title: 'Platform Enhancement',
            description: 'Launched mobile apps and improved user experience with instant delivery.'
        },
        {
            year: '2023',
            title: 'Market Leader',
            description: 'Became one of the leading digital book platforms with 50,000+ active users.'
        },
        {
            year: '2024',
            title: 'Innovation',
            description: 'Introduced AI-powered recommendations and expanded to 10,000+ titles.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <Header></Header>
            {/* <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => window.location.href = '/'}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="hidden sm:inline">Back to Home</span>
                            <Home size={20} className="sm:hidden" />
                        </button>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">About Us</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </div> */}

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <BookOpen size={48} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">About BooksPDF</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto px-4">
                        Your trusted partner in digital reading. Making quality books accessible to everyone, everywhere.
                    </p>
                </div>
            </div>

            {/* Our Story */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                            BooksPDF was founded with a simple yet powerful vision: to make quality literature accessible to everyone, anywhere in the world. We believe that knowledge and great stories should not be limited by geography, cost, or availability.
                        </p>
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                            What started as a small collection of digital books has grown into a comprehensive platform serving thousands of readers daily. We partner with publishers and authors worldwide to bring you an ever-expanding library of titles across all genres and subjects.
                        </p>
                        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                            Today, BooksPDF stands as a testament to our commitment to democratizing access to books. Whether you&apos;re a student, professional, or casual reader, we&apos;re here to fuel your passion for reading with instant access to quality content at your fingertips.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-blue-100 p-4 rounded-full">
                                    <Target className="text-blue-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                            </div>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                To provide instant access to a vast collection of high-quality digital books, making reading affordable, convenient, and enjoyable for everyone. We strive to bridge the gap between readers and knowledge through innovative technology and exceptional service.
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-purple-100 p-4 rounded-full">
                                    <Eye className="text-purple-600" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                            </div>
                            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                                To become the world&apos;s most trusted and comprehensive digital books platform, fostering a global community of readers and learners. We envision a future where every individual has unlimited access to knowledge and literature that inspires, educates, and entertains.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                        These principles guide everything we do at BooksPDF
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                                {value.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{value.title}</h3>
                            <p className="text-gray-600 text-sm text-center">{value.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">Our Impact in Numbers</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-base sm:text-lg text-blue-100">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Journey Timeline */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-12">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
                    <p className="text-gray-600 text-base sm:text-lg">
                        Key milestones in our growth story
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline Line */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>

                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`flex flex-col md:flex-row gap-8 items-center ${
                                index % 2 === 0 ? 'md:flex-row-reverse' : ''
                            }`}>
                                {/* Content */}
                                <div className="flex-1 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm">
                                            {milestone.year}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{milestone.description}</p>
                                </div>

                                {/* Timeline Dot */}
                                <div className="hidden md:block w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                                {/* Spacer */}
                                <div className="hidden md:block flex-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Management Section - Kamlesh Mohabe */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Platform Management</h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            Meet the person behind BooksPDF&apos;s success
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 sm:p-12 text-white text-center">
                                <div className="bg-white/20 backdrop-blur-sm w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <User size={48} className="text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2">Kamlesh Mohabe</h3>
                                <p className="text-lg text-blue-100 mb-4">Platform Manager</p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                        Platform Operations
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                        Strategy & Growth
                                    </span>
                                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                                        Team Leadership
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 sm:p-10">
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Award className="text-blue-600" size={24} />
                                            About
                                        </h4>
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            This website is managed by KAMLESH MOHABE. Kamlesh Mohabe is the driving force behind BooksPDF&apos;s operations and strategic initiatives. With extensive experience in digital platform management and a passion for making education accessible, Kamlesh oversees all aspects of the platform&apos;s daily operations, ensuring seamless user experience and continuous innovation.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Target className="text-purple-600" size={24} />
                                            Responsibilities
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-3">
                                                <div className="bg-blue-100 rounded-full p-1 mt-1">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <span className="text-gray-700">Overseeing platform operations and ensuring 24/7 availability</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="bg-blue-100 rounded-full p-1 mt-1">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <span className="text-gray-700">Managing content curation and quality assurance</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="bg-blue-100 rounded-full p-1 mt-1">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <span className="text-gray-700">Leading strategic planning and business development</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="bg-blue-100 rounded-full p-1 mt-1">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <span className="text-gray-700">Building partnerships with publishers and authors</span>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="bg-blue-100 rounded-full p-1 mt-1">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                </div>
                                                <span className="text-gray-700">Enhancing user experience and customer satisfaction</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Users className="text-green-600" size={24} />
                                            Vision & Leadership
                                        </h4>
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            Under Kamlesh&apos;s leadership, BooksPDF has grown from a small digital library to a comprehensive platform serving thousands of readers daily. His vision of democratizing access to knowledge drives every decision, ensuring that quality education and literature remain accessible to all, regardless of their location or economic background.
                                        </p>
                                    </div>

                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-6">
                                        <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                            <Mail className="text-blue-600" size={20} />
                                            Get in Touch
                                        </h4>
                                        <p className="text-gray-700 text-sm mb-4">
                                            For partnership inquiries, platform feedback, or business opportunities, feel free to reach out:
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Mail size={16} className="text-blue-600" />
                                                <a href="mailto:contact@booksnpdf.com" className="text-blue-600 hover:underline">
                                                    contact@booksnpdf.com
                                                </a>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone size={16} className="text-green-600" />
                                                <span className="text-gray-700">Available through support channels</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8">Why Choose BooksPDF?</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-3">Vast Collection</h3>
                            <p className="text-blue-100">Access to over 10,000 books across multiple genres and subjects.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-3">Affordable Prices</h3>
                            <p className="text-blue-100">Get quality books at prices that won&apos;t break your budget.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-3">Instant Delivery</h3>
                            <p className="text-blue-100">Download your books immediately after purchase.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
                            <p className="text-blue-100">Our team is always here to help you with any questions.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-3">Secure Platform</h3>
                            <p className="text-blue-100">Your data and transactions are protected with top security.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-3">Regular Updates</h3>
                            <p className="text-blue-100">New books added daily to keep our collection fresh.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 py-12 sm:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                        Join Our Reading Community
                    </h3>
                    <p className="text-gray-600 text-base sm:text-lg mb-8">
                        Start your reading journey today with thousands of books at your fingertips
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => window.location.href = '/register'}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all"
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}