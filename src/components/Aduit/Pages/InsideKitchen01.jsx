import React, { useState, useRef } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const InsideKitchen01 = () => {
  const [selectedKitchenLightBrightness, setSelectedKitchenLightBrightness] = useState('');
  const [selectedKitchenLightRemark, setSelectedKitchenLightRemark] = useState('');
  const [kitchenLightUserRemark, setKitchenLightUserRemark] = useState('');
  const [kitchenLightRating, setKitchenLightRating] = useState(0);
  const [kitchenLightImagePreviews, setKitchenLightImagePreviews] = useState([]);
  const kitchenLightFileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission

  // Handle brightness selection
  const handleKitchenLightBrightnessClick = (brightness) => {
    setSelectedKitchenLightBrightness(brightness);
  };

  // Handle remark selection
  const handleKitchenLightRemarkClick = (remark) => {
    setSelectedKitchenLightRemark(remark);
  };

  // Trigger file input for image capture
  const triggerKitchenLightFileInput = () => {
    kitchenLightFileInputRef.current.click();
  };

  // Handle file selection and image previews
  const handleKitchenLightPhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKitchenLightImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null; // Reset input value
  };

  // Remove image preview
  const removeImage = (index) => {
    setKitchenLightImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Open image in preview
  const handleImageClick = (image) => {
    setPreviewImage(image);
  };

  // Close image preview
  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Logic to handle submission can be added here
    setIsSubmitted(true); // Set form as submitted
  };

  return (
    <div className="border relative rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
      <h2 className="text-xl font-semibold mb-2">Kitchen Light</h2>

      {/* Brightness Buttons */}
      <div className="flex space-x-4 mb-4">
        {['Working', 'Not Working'].map((brightness) => (
          <div
            key={brightness}
            onClick={() => handleKitchenLightBrightnessClick(brightness)}
            className={`cursor-pointer px-4  rounded-full border flex items-center justify-center transition-colors duration-200 
              hover:bg-green-600 hover:text-white ${selectedKitchenLightBrightness === brightness ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            {brightness}
          </div>
        ))}
      </div>

      {/* Remarks Buttons */}
      <div className="flex space-x-4 mb-4">
        {['Good', 'Bad'].map((remark) => (
          <div
            key={remark}
            onClick={() => handleKitchenLightRemarkClick(remark)}
            className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
              hover:bg-red-600 hover:text-white ${selectedKitchenLightRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
          >
            {remark}
          </div>
        ))}
      </div>

      {/* User Remark Input */}
      <input
        type="text"
        placeholder="Enter your remark..."
        value={kitchenLightUserRemark}
        onChange={(e) => setKitchenLightUserRemark(e.target.value)}
        className="border rounded-md p-2 w-full mb-2"
      />

      {/* Star Rating */}
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => setKitchenLightRating(index + 1)}
            className={`cursor-pointer text-2xl ${kitchenLightRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </span>
        ))}
      </div>

      {/* Image Previews and File Input */}
      <div className="flex flex-wrap gap-2 mb-4">
        {kitchenLightImagePreviews.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
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

        {/* Upload Image Button */}
        <div
          onClick={triggerKitchenLightFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={kitchenLightFileInputRef}
        onChange={handleKitchenLightPhotoCapture}
        className="hidden"
        multiple
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleClosePreview}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {isSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default InsideKitchen01;
