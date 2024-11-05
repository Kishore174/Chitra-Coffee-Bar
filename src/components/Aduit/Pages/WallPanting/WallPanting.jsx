import React, { useState, useRef } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const WallPainting = () => {
  const [imagePreview, setImagePreview] = useState([]);
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePhotoCapture = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + imagePreview.length > 2) {
      alert('You can only upload up to 2 images.');
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImagePreview((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg w-72 space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-800">Wall Painting</h3>

        {/* Top Image Preview */}
        {imagePreview[0] && (
          <div className="relative mb-2">
            <img
              src={imagePreview[0]}
              alt="Top Painting"
              className="h-32 w-full border rounded-md object-cover shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <button
              onClick={() => removeImage(0)}
              className="absolute top-0 right-0 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div
          onClick={triggerFileInput}
          className="h-12 w-12 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300 mx-auto"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePhotoCapture}
          className="hidden"
          multiple
        />

        {/* Bottom Image Preview */}
        {imagePreview[1] && (
          <div className="relative mt-2">
            <img
              src={imagePreview[1]}
              alt="Bottom Painting"
              className="h-32 w-full border rounded-md object-cover shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <button
              onClick={() => removeImage(1)}
              className="absolute top-0 right-0 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
