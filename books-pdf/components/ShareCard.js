import { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, Linkedin, MessageCircle, Mail, Link2, Check, Download, X } from 'lucide-react';
import { bookAPI } from '@/lib/api';



const SocialShareButton = ({ bookData, bookUrl }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
 
  // Get the full book URL
  const shareUrl = bookUrl || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Prepare share content
  const shareTitle = `Check out "${bookData.title}" ${bookData.author ? `by ${bookData.author}` : ''}`;
  const shareDescription = bookData.description 
    ? bookData.description.substring(0, 150) + (bookData.description.length > 150 ? '...' : '')
    : 'Amazing book available now!';

  // Get book thumbnail URL
  const getThumbnailUrl = () => {
    if (bookData.thumbnail?.data) {
      return `data:${bookData.thumbnail.contentType};base64,${bookData.thumbnail.data}`;
    }
    return '/placeholder-book.jpg';
  };

  const thumbnailUrl = getThumbnailUrl();

  // Social share handlers
  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDescription = encodeURIComponent(shareDescription);

    let shareLink = '';

    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
        break;
      default:
        break;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'width=600,height=400');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => handleShare('whatsapp')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => handleShare('facebook')
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => handleShare('twitter')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800',
      action: () => handleShare('linkedin')
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-blue-400 hover:bg-blue-500',
      action: () => handleShare('telegram')
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => handleShare('email')
    }
  ];

  return (
    <>
      {/* Share Button */}
      <button
        onClick={handleNativeShare}
        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 font-semibold"
      >
        <Share2 size={20} />
        <span>Share This Book</span>
      </button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <Share2 size={24} />
                  Share Book
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-white/90 text-sm">
                Share this amazing book with your friends and community!
              </p>
            </div>

            {/* Book Preview */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <img
                  src={thumbnailUrl}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {book.title}
                  </h4>
                  {book.author && (
                    <p className="text-sm text-gray-600 mb-2">
                      by {book.author}
                    </p>
                  )}
                  {book.isPaid ? (
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      ₹{book.price}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      FREE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Social Platforms Grid */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-3">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <button
                      key={platform.name}
                      onClick={platform.action}
                      className={`${platform.color} text-white p-4 rounded-xl transition-all transform hover:scale-105 shadow-md hover:shadow-lg flex flex-col items-center gap-2`}
                    >
                      <Icon size={24} />
                      <span className="text-xs font-medium">{platform.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Copy Link Section */}
            <div className="px-6 pb-6">
              <div className="bg-gray-100 rounded-xl p-4">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Or copy link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 size={18} />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default SocialShareButton;