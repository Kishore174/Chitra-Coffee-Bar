import React, { useState, useRef } from 'react';
import { StarIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Dressing = () => {
  const [rating, setRating] = useState(0);
  const [dressingRemark, setDressingRemark] = useState('');
  const [dressingImagePreview, setDressingImagePreview] = useState([]);
  const [selectedCap, setSelectedCap] = useState(null);
  const [selectedApron, setSelectedApron] = useState(null);
  const [selectedDCart, setSelectedDCart] = useState(null);
  const fileInputRef = useRef();

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleDressingImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDressingImagePreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const removeDressingImage = (index) => {
    setDressingImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md mb-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">Dressing Section</h2>
 
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-500 mb-2 block">Cap Available</label>
        <div className="flex space-x-4">
          {['Yes', 'No'].map((option) => (
            <div
              key={option}
              onClick={() => setSelectedCap(option)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                ${selectedCap === option ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-600 hover:text-white'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
 
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-500 mb-2 block">Apron Available</label>
        <div className="flex space-x-4"> 
          {['Yes', 'No'].map((option) => (
            <div
              key={option}
              onClick={() => setSelectedApron(option)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                ${selectedApron === option ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-600 hover:text-white'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* D Cart Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-500 mb-2 block">cort   Available</label>
        <div className="flex space-x-4">
          {['Yes', 'No'].map((option) => (
            <div
              key={option}
              onClick={() => setSelectedDCart(option)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                ${selectedDCart === option ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-600 hover:text-white'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

    
      <div className="mb-6">
        <h3 className="font-semibold text-gray-700">Rate Dressing Section</h3>
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

      {/* Remark Section */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>
        <textarea
          value={dressingRemark}
          onChange={(e) => setDressingRemark(e.target.value)}
          placeholder="Enter your remark..."
          className="border rounded-md p-2 w-full mb-2"
        />
      </div>

      {/* Image Upload Section */}
      <div className="flex flex-wrap gap-3 mb-6">
        {dressingImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Dressing Image ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
            />
            <button
              onClick={() => removeDressingImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div
          onClick={() => fileInputRef.current.click()}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleDressingImageUpload}
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
};

export default Dressing;
