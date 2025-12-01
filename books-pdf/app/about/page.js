'use client';

import PageLayout from '@/components/PageLayout';
import { Book, Target, Users, Award, Heart, Zap } from 'lucide-react';

export default function AboutPage() {
    return (
        <PageLayout
            title="About BookMarket"
            subtitle="Your trusted destination for premium eBooks"
            breadcrumbs={[
                { label: 'Home', link: '/' },
                { label: 'About Us' }
            ]}
        >
            <div className="prose prose-lg max-w-none">
                {/* Mission Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="text-blue-600" size={32} />
                        <h2 className="text-3xl font-bold text-gray-800 m-0">Our Mission</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        At BookMarket, we believe that knowledge should be accessible to everyone. Our mission is to provide a platform where readers can easily discover, purchase, and download premium eBooks across various categories—from programming and technology to business and design.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        We're committed to offering high-quality digital content at affordable prices, making learning and professional development accessible to everyone, everywhere.
                    </p>
                </section>

                {/* Values Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                            <Heart className="text-blue-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-2">Customer First</h3>
                            <p className="text-gray-700">We prioritize your experience and satisfaction above everything else.</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                            <Award className="text-purple-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-2">Quality Content</h3>
                            <p className="text-gray-700">Every book is carefully curated to ensure premium quality.</p>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                            <Zap className="text-green-600 mb-4" size={40} />
                            <h3 className="text-xl font-bold mb-2">Instant Access</h3>
                            <p className="text-gray-700">Download your books immediately after purchase.</p>
                        </div>
                    </div>
                </section>

                {/* Story Section */}
                <section className="mb-12 bg-gray-50 rounded-lg p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Book className="text-purple-600" size={32} />
                        <h2 className="text-3xl font-bold text-gray-800 m-0">Our Story</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        Founded in 2024, BookMarket started with a simple idea: make premium educational content accessible to learners worldwide. What began as a small collection of programming books has grown into a comprehensive library spanning multiple categories.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        Today, we serve thousands of readers across India and beyond, helping them advance their careers, learn new skills, and pursue their passions through quality eBooks.
                    </p>
                </section>

                {/* Stats Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">BookMarket in Numbers</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                            <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
                            <div className="text-gray-700">Happy Readers</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                            <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                            <div className="text-gray-700">eBooks</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                            <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
                            <div className="text-gray-700">Categories</div>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg">
                            <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                            <div className="text-gray-700">Support</div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="text-blue-600" size={32} />
                        <h2 className="text-3xl font-bold text-gray-800 m-0">Why Choose Us?</h2>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-gray-700"><strong>Instant Downloads:</strong> Get your books immediately after purchase</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-gray-700"><strong>Secure Payments:</strong> PhonePe-powered secure transactions</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-gray-700"><strong>Multiple Downloads:</strong> Download up to 5 times within 30 days</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-gray-700"><strong>Free Books:</strong> Access hundreds of free eBooks</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-600 font-bold text-xl">✓</span>
                            <span className="text-gray-700"><strong>24/7 Support:</strong> Always here to help you</span>
                        </li>
                    </ul>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
                    <p className="text-xl mb-6">Start your learning journey with thousands of other readers</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all"
                    >
                        Browse Books Now
                    </button>
                </section>
            </div>
        </PageLayout>
    );
}