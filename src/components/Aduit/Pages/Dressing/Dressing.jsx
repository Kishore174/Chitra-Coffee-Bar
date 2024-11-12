import React, { useState, useRef } from 'react';
import { StarIcon, PlusIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

const Dressing = () => {
  const [rating, setRating] = useState(0);
  const [dressingRemark, setDressingRemark] = useState('');
  const [dressingImagePreview, setDressingImagePreview] = useState([]);
  const [capWeared, setCapWeared] = useState(0);
  const [capNotWeared, setCapNotWeared] = useState(0);
  const [apronWeared, setApronWeared] = useState(0);
  const [apronNotWeared, setApronNotWeared] = useState(0);
  const [cartWeared, setCartWeared] = useState(0);
  const [cartNotWeared, setCartNotWeared] = useState(0);
  const [submitted, setSubmitted] = useState(false); // New state for submission
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

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000); // Reset submission status after 2 seconds
  };

  return (
    <div className="p-4 bg-white rounded-md shadow-md mb-4 max-w-3xl mx-auto">
    <h2 className="text-xl font-semibold text-center mb-4">Dressing Section</h2>
  
    {/* Horizontal Flex Row for Cap, Apron, and Cort Sections */}
    <div className="flex space-x-4 mb-6">
      
      {/* Cap Input Fields */}
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-500 mb-2 block">Cap</label>
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Weared</label>
            <input
              type="number"
              value={capWeared}
              onChange={(e) => setCapWeared(Number(e.target.value))}
              placeholder="Enter number"
              className="border rounded-md p-2 w-20"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Not Weared</label>
            <input
              type="number"
              value={capNotWeared}
              onChange={(e) => setCapNotWeared(Number(e.target.value))}
              placeholder="Enter number"
              className="border rounded-md p-2 w-20"
            />
          </div>
        </div>
      </div>
  
      {/* Apron Input Fields */}
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-500 mb-2 block">Apron</label>
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Weared</label>
            <input
              type="number"
              value={apronWeared}
              onChange={(e) => setApronWeared(Number(e.target.value))}
              placeholder="Enter number"
              className="border rounded-md p-2 w-20"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Not Weared</label>
            <input
              type="number"
              value={apronNotWeared}
              onChange={(e) => setApronNotWeared(Number(e.target.value))}
              placeholder="Enter number"
              className="border rounded-md p-2 w-20"
            />
          </div>
        </div>
      </div>
  
      {/* Cort Input Fields */}
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-500 mb-2 block">Cort</label>
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Weared</label>
            <input
              type="number"
              value={cartWeared}
              onChange={(e) => setCartWeared(Number(e.target.value))}
              placeholder="Enter number"
              className="border rounded-md p-2 w-20"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500">Not Weared</label>
            <input
              type="number"
              value={cartNotWeared}
              onChange={(e) => setCartNotWeared(Number(e.target.value))}
              placeholder="Enter number"
              className="border rounded-md p-2 w-20"
            />
          </div>
        </div>
      </div>
    </div>
  
    {/* Rating Section */}
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
  
    {/* Submit Button */}
    <button
      onClick={handleSubmit}
      className={`flex items-center justify-center w-full py-2 px-4 rounded-md ${
        submitted ? 'bg-green-500' : 'bg-red-500'
      } text-white font-semibold`}
    >
      {submitted ? (
        <>
          <CheckIcon className="w-5 h-5 mr-2" />
          Submitted
        </>
      ) : (
        'Submit'
      )}
    </button>
  </div>
  
  );
};

export default Dressing;
