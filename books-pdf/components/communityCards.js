import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Users, Sparkles, ArrowRight, X } from 'lucide-react';

// // Floating Action Button Component
const FloatingCommunityButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPulse(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Buttons */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {/* WhatsApp Button */}
          <a
            href="https://whatsapp.com/channel/0029VaqFyxOHQbS3hsyxji0Q"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-3 rounded-full shadow-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <MessageCircle size={20} />
            </div>
            <span className="font-semibold whitespace-nowrap">Join WhatsApp</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Telegram Button */}
          <a
            href="https://t.me/booksnpdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-full shadow-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 group"
          >
            <div className="bg-white/20 p-2 rounded-full">
              <Send size={20} />
            </div>
            <span className="font-semibold whitespace-nowrap">Join Telegram</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
      >
        {showPulse && (
          <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></span>
        )}
        <div className="relative">
          {isExpanded ? <X size={28} /> : <Users size={28} />}
        </div>
      </button>
    </div>
  );
};

// Banner Component (placed between sections)
export const CommunityBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-8 my-12 shadow-2xl">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-300" size={24} />
              <span className="text-yellow-300 font-semibold text-sm uppercase tracking-wide">
                Join Our Community
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Connect with Thousands of Book Lovers
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl">
              Get instant updates on new releases, exclusive deals, reading recommendations, and connect with fellow readers!
            </p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Users size={18} />
                </div>
                <span>10,000+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles size={18} />
                </div>
                <span>Daily Updates</span>
              </div>
            </div>
          </div>

          {/* Right Content - CTA Buttons */}
          <div className="flex flex-col gap-4 min-w-[280px]">
            {/* WhatsApp Button */}
            <a
              href="https://whatsapp.com/channel/0029VaqFyxOHQbS3hsyxji0Q"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold flex items-center justify-between gap-4 hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-lg">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold">WhatsApp</div>
                  <div className="text-xs text-gray-600">Join our group</div>
                </div>
              </div>
              <ArrowRight 
                size={20} 
                className="text-green-600 group-hover:translate-x-1 transition-transform" 
              />
            </a>

            {/* Telegram Button */}
            <a
              href="https://t.me/booksnpdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white text-gray-900 px-6 py-4 rounded-xl font-semibold flex items-center justify-between gap-4 hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg">
                  <Send size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold">Telegram</div>
                  <div className="text-xs text-gray-600">Join our channel</div>
                </div>
              </div>
              <ArrowRight 
                size={20} 
                className="text-blue-600 group-hover:translate-x-1 transition-transform" 
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Inline Buttons (alternative style)
export const CompactCommunityButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 my-8">
      {/* WhatsApp Card */}
      <a
        href="https://whatsapp.com/channel/0029VaqFyxOHQbS3hsyxji0Q"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex-1 relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
              <MessageCircle size={28} className="text-white" />
            </div>
            <ArrowRight 
              size={20} 
              className="text-green-600 group-hover:translate-x-1 transition-transform" 
            />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            WhatsApp Community
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Join 5,000+ readers for instant book updates and discussions
          </p>
          <div className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm">
            <span>Join Now</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </a>

      {/* Telegram Card */}
      <a
        href="https://t.me/booksnpdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
              <Send size={28} className="text-white" />
            </div>
            <ArrowRight 
              size={20} 
              className="text-blue-600 group-hover:translate-x-1 transition-transform" 
            />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Telegram Channel
          </h3>
          <p className="text-gray-600 text-sm mb-3">
            Get exclusive deals, new releases, and reading recommendations
          </p>
          <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm">
            <span>Join Now</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </a>
    </div>
  );
};

export default CompactCommunityButtons;