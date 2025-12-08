/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { IndianRupee, Eye, Download, Star, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BookCard = ({ book }) => {
    const router = useRouter();
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    const getThumbnailSrc = () => {
        if (book.thumbnail?.data) {
            return `data:${book.thumbnail.contentType};base64,${book.thumbnail.data}`;
        }
        return '/placeholder-book.jpg';
    };
    const renderStarRating = (rating = 5) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        size={12}
                        className={index < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                ))}
                <span className="text-xs text-gray-500 ml-1">({book.totalRatings || '0'})</span>
            </div>
        );
    };
    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/books/${book._id}`;
        const shareText = `Check out "${book.title}" by ${book.author || 'Unknown Author'} on BookMarket!`;

        // Check if Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: book.title,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            try {
                await navigator.clipboard.writeText(shareUrl);
                setShowShareTooltip(true);
                setTimeout(() => setShowShareTooltip(false), 2000);
            } catch (error) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setShowShareTooltip(true);
                setTimeout(() => setShowShareTooltip(false), 2000);
            }
        }
    };

    const handleSocialShare = (platform) => {
        const shareUrl = `${window.location.origin}/books/${book._id}`;
        const shareText = `Check out "${book.title}" by ${book.author || 'Unknown Author'} on BookMarket!`;
        
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 card-hover group flex flex-col h-full">
            
            {/* Book Image */}
            <div className="relative overflow-hidden aspect-3/4 bg-gray-100">
                <img
                    src={getThumbnailSrc()}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                {!book.isPaid && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        FREE
                    </div>
                )}

                {book.isPaid && (
                    <div className="absolute top-1 right-1 bg-linear-to-r from-purple-500 to-pink-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
                        PREMIUM
                    </div>
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                    <div className="w-full space-y-1">
                    {/* Social Share Options on Hover */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleSocialShare('whatsapp')}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded text-xs font-semibold transition-all"
                            >
                                WA
                            </button>
                            <button
                                onClick={() => handleSocialShare('facebook')}
                                className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-2 rounded text-xs font-semibold transition-all"
                            >
                                FB
                            </button>
                            <button
                                onClick={() => handleSocialShare('twitter')}
                                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white py-2 rounded text-xs font-semibold transition-all"
                            >
                                X
                            </button>
                            <button
                                onClick={() => handleSocialShare('linkedin')}
                                className="flex-1 bg-blue-300 hover:bg-blue-400 text-white py-2 rounded text-xs font-semibold transition-all"
                            >
                                Li
                            </button>
                        </div>
                    </div>
                </div>
                {/* Share Button */}
                <div className="absolute top-1 left-1">
                    <div className="relative">
                        <button
                            onClick={handleShare}
                            className="bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 p-1 rounded shadow transition-all duration-150 hover:scale-105"
                            title="Copy book link to share"
                        >
                            <Share2 size={10} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Book Info */}
            <div className="p-2 flex flex-col shrink-0" onClick={() => router.push(`/books/${book._id}`)}>
                <h3 className="font-semibold mb-0.5 line-clamp-2 text-cyan-700 group-hover:text-blue-600 transition-colors text-xs leading-tight">
                    {book.title}
                </h3>
                
                {book.author && (
                    <p className="text-gray-500 text-[10px] mb-1 line-clamp-1">by {book.author}</p>
                )}

                {/* Star Rating */}
                <div className="mb-1">
                    {renderStarRating(book.rating || 5)}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <div className="flex flex-col">
                        {book.isPaid ? (
                            <div className="flex items-center gap-0.5 text-sm font-bold text-green-600">
                                <IndianRupee size={12} />
                                <span>{book.price}</span>
                            </div>
                        ) : (
                            <div className="text-sm font-bold text-blue-600">
                                FREE
                            </div>
                        )}
                    </div>
                        {book.downloadCount > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Download size={12} />
                                <span>({book.downloadCount}) Downloads </span>
                            </div>
                        )}
                    <button
                        onClick={() => router.push(`/books/${book._id}`)}
                        className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-semibold hover:scale-105 transition-all"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;