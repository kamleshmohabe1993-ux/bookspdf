'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

const ImageUpload = ({ onImageSelect, currentImage }) => {
    const [preview, setPreview] = useState(currentImage || null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size must be less than 5MB');
                return;
            }

            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setPreview(base64String);
                onImageSelect(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold mb-2">
                Book Thumbnail *
            </label>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-500 transition-colors">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="thumbnail-upload"
                />
                
                <label
                    htmlFor="thumbnail-upload"
                    className="cursor-pointer flex flex-col items-center"
                >
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview.startsWith('data:') ? preview : `data:image/jpeg;base64,${preview}`}
                                alt="Preview"
                                className="w-32 h-48 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center rounded-lg">
                                <Upload className="text-white opacity-0 hover:opacity-100" size={32} />
                            </div>
                        </div>
                    ) : (
                        <>
                            <Upload className="text-gray-400 mb-2" size={48} />
                            <p className="text-gray-600">Click to upload thumbnail</p>
                            <p className="text-sm text-gray-400 mt-1">
                                PNG, JPG, WebP (Max 5MB)
                            </p>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
};

export default ImageUpload;