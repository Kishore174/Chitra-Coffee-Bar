import React, { useRef, useState } from 'react';
import { PlusIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';

const DiningSection = () => {
  const [diningImagePreview, setDiningImagePreview] = useState([]);
  const [isDiningSubmitted, setIsDiningSubmitted] = useState(false);
  const [previewDiningImage, setPreviewDiningImage] = useState(null);
  const diningFileInputRef = useRef();
  const [rating, setRating] = useState(0); // State for storing rating
  const [selectedDiningRemark, setSelectedDiningRemark] = useState(null); // State for selected remark

  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
        },
        (error) => {
          resolve("Location unavailable"); // Use fallback if location access is denied
        }
      );
    });
  };

  const handleDiningPhotoCapture = async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

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

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setDiningImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeDiningImage = (index) => {
    setDiningImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDiningClick = (image) => {
    setPreviewDiningImage(image);
  };

  const handleCloseDining = () => {
    setPreviewDiningImage(null);
  };

  const triggerDiningFileInput = () => {
    diningFileInputRef.current.click();
  };

  const handleDiningSubmit = () => {
    setIsDiningSubmitted(true);
    // Perform additional submission logic here
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleDiningRemarkClick = (remark) => {
    setSelectedDiningRemark(remark);
  };

  return (
    <div className="p-4 bg-white flex flex-col justify-between relative shadow-md rounded-md mb-4">
    <h2 className="text-xl font-semibold mb-4   text-gray-800">Dining Area</h2>
  
    {/* Hygiene Remark Section */}
    <div className="mb-6">
      <label className="text-sm font-medium text-left text-gray-500 mb-2 block">Hygiene</label>
      <div className="flex gap-2">
        {['Good', 'Bad'].map((remark) => (
          <div
            key={remark}
            onClick={() => handleDiningRemarkClick(remark)}
            className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
              hover:bg-red-600 hover:text-white ${
                selectedDiningRemark === remark
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
          >
            {remark}
          </div>
        ))}
      </div>
    </div>
  
    {/* Rating Section */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-700">Rate your dining experience</h3>
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-6 h-6 cursor-pointer ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
            onClick={() => handleRatingClick(star)}
          />
        ))}
      </div>
    </div>
  
    {/* Image Preview Section */}
    <div className="flex flex-wrap gap-2 mb-6">
      {diningImagePreview.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image}
            alt={`Dining ${index + 1}`}
            className="h-12 w-12 border rounded-md object-cover cursor-pointer"
            onClick={() => handleDiningClick(image)}
          />
          <button
            onClick={() => removeDiningImage(index)}
            className="absolute top-0 right-0 text-red-500 hover:text-red-700"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
      <div
        onClick={triggerDiningFileInput}
        className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
      >
        <PlusIcon className="w-8 h-8 text-gray-600" />
      </div>
      <input
        type="file"
        accept="image/*"
        ref={diningFileInputRef}
        onChange={handleDiningPhotoCapture}
        className="hidden"
        multiple
      />
    </div>
  
    {/* Submit Button */}
    {/* <button
      onClick={handleDiningSubmit}
      className={`mt-4 w-full text-center mx-auto py-2 rounded-md font-medium text-white ${
        isDiningSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
      }`}
    >
      {isDiningSubmitted ? (
        <div className="flex items-center justify-center">
          <span>Submitted</span>
        </div>
      ) : (
        'Submit'
      )}
    </button> */}
  
    {/* Preview Image Modal */}
    {previewDiningImage && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative bg-white p-4 rounded-lg">
          <img
            src={previewDiningImage}
            alt="Preview"
            className="max-h-96 max-w-full rounded"
          />
          <button
            onClick={handleCloseDining}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    )}
  
    {/* Submission Success Checkmark */}
    {/* {isDiningSubmitted && (
      <div className="absolute -top-2 -right-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="green"
          className="w-10 h-10"
        >
          <path
            fillRule="evenodd"
            d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    )} */}
  </div>
  
  
  );
};

export default DiningSection;
