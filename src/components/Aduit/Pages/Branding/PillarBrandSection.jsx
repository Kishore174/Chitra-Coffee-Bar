import React, { useRef, useState } from 'react';
import { PlusIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';

const PillarBrandSection = () => {
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef();
  const [rating, setRating] = useState(0);
  const [remark, setRemark] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);
  const [pillarCount, setPillarCount] = useState(''); 
  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const handleImageCapture = (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          ctx.drawImage(img, 0, 0);
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50);
          ctx.fillStyle = 'black';
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          const watermarkedImage = canvas.toDataURL('image/png');
          setImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageClick = (image) => {
    setPreviewImage(image);
  };

  const handleCloseImage = () => {
    setPreviewImage(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Additional submission logic
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <div className="p-4 bg-white relative shadow-md rounded-md mb-4">
      <h2 className="text-lg poppins-semibold mb-2">Pillar Branding </h2>

      {/* Availability Section */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 block">Is the branding available?</h3>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <div
              key={option}
              onClick={() => setIsAvailable(option)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${isAvailable === option ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">No.of.PillarBranding</label>
              <input
                  type="text"
                  placeholder="Milk Brand Name"
                  value={pillarCount}
                  onChange={(e) => setPillarCount(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
      {/* Remark Section */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 block">Remark</h3>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          rows="3"
          placeholder="Enter your remarks here..."
          className="w-full border rounded-md p-2"
        />
      </div>

      {/* Rating Section */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2 block">Rate the branding experience:</h3>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
              onClick={() => handleRatingClick(star)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {imagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Branding ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleImageClick(image)}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div
          onClick={triggerFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageCapture}
          className="hidden"
          multiple
        />
      </div>

      {/* <button
        onClick={handleSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${
          isSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isSubmitted ? 'Submitted' : 'Submit'}
      </button> */}

      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseImage}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06-.057l4.5-6Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
    </div>
  );
};

export default PillarBrandSection;
