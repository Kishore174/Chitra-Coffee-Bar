import React, { useRef, useState } from 'react';
import { PlusIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';

const MenuBrandSection = () => {
  const [menuImagePreview, setMenuImagePreview] = useState([]);
  const [isMenuSubmitted, setIsMenuSubmitted] = useState(false);
  const [previewMenuImage, setPreviewMenuImage] = useState(null);
  const menuFileInputRef = useRef();
  const [rating, setRating] = useState(0);
  const [remark, setRemark] = useState(''); // State for remarks
  const [isMenuAvailable, setIsMenuAvailable] = useState(null); // State for menu availability

  const handleMenuPhotoCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImagePreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = null;
  };

  const removeMenuImage = (index) => {
    setMenuImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMenuClick = (image) => {
    setPreviewMenuImage(image);
  };

  const handleCloseMenu = () => {
    setPreviewMenuImage(null);
  };

  const triggerMenuFileInput = () => {
    menuFileInputRef.current.click();
  };

  const handleMenuSubmit = () => {
    setIsMenuSubmitted(true);
    // Perform additional submission logic here
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  return (
    <div className="p-4 bg-white relative shadow-md rounded-md mb-4">
      <h2 className="text-lg font-semibold mb-2">Menu Brand Section</h2>

      {/* Availability Section */}
      <div className="mb-4">
        <h3 className="font-semibold">Is the menu available?</h3>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <div
              key={option}
              onClick={() => setIsMenuAvailable(option)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${isMenuAvailable === option ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      {/* Remark Section */}
      <div className="mb-4">
        <h3 className="font-semibold">Remark:</h3>
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
        <h3 className="font-semibold">Rate your menu experience:</h3>
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
        {menuImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Menu ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleMenuClick(image)}
            />
            <button
              onClick={() => removeMenuImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div
          onClick={triggerMenuFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={menuFileInputRef}
          onChange={handleMenuPhotoCapture}
          className="hidden"
          multiple
        />
      </div>

      <button
        onClick={handleMenuSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${
          isMenuSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
        }`}
      >
        {isMenuSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button>

      {previewMenuImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewMenuImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseMenu}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {isMenuSubmitted && (
         <div className="absolute -top-2 -right-2">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
           <path
             fillRule="evenodd"
             d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.06-.057l4.5-6Z"
             clipRule="evenodd"
           />
         </svg>
       </div>
      )}
    </div>
  );
};

export default MenuBrandSection;
