import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const KitchenItem = ({ title, itemType, onUpdate }) => {
  const [selectedRemark, setSelectedRemark] = useState('');
  const [userRemark, setUserRemark] = useState('');
  const [imagePreview, setImagePreview] = useState([]);
  const [rating, setRating] = useState(0);
  const [previewImage, setPreviewImage] = useState(null); // State for the image preview
  const fileInputRef = useRef(null);

  const handlePhotoCapture = async (e) => {
    const files = Array.from(e.target.files);
    
    // Get geolocation and current date-time
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
      
      // Iterate over each selected image file
      const watermarkedImages = files.map(async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
          reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              // Set font for the text
              ctx.font = '16px Arial';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.fillRect(10, img.height - 40, img.width - 20, 40); // Background for text
              
              // Set the color for text
              ctx.fillStyle = 'black';
              
              // Add geolocation and date-time information as watermark
              ctx.fillText(`Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, 15, img.height - 25);
              ctx.fillText(`Date/Time: ${formattedDate}`, 15, img.height - 5);
              
              resolve(canvas.toDataURL()); // Resolve with the watermarked image as Data URL
            };
          };
          reader.readAsDataURL(file);
        });
      });
  
      // Wait for all images to be processed and then set the state
      Promise.all(watermarkedImages).then((result) => {
        setImagePreview((prev) => [...prev, ...result]); // Add watermarked images to state
      });
    });
  };
  

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = () => {
    const data = {
      title,
      selectedRemark,
      userRemark,
      imagePreview,
      rating,
    };
    onUpdate(itemType, data); // Call the onUpdate function with the itemType and collected data
  };

  useEffect(() => {
    handleUpdate(); // Update the parent component whenever the local state changes
  }, [selectedRemark, userRemark, imagePreview, rating]);

  const handleImageClick = (image) => {
    setPreviewImage(image); // Set the clicked image for preview
  };

  const handleClosePreview = () => {
    setPreviewImage(null); // Close the preview modal
  };

  return (
    <div className="border rounded-lg shadow-md p-4 w-1/4 flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div>
        <label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>
        <div className="flex space-x-4 mb-4">
          {['Good', 'Bad'].map((remark) => (
            <div
              key={remark}
              onClick={() => setSelectedRemark(remark)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {remark}
            </div>
          ))}
        </div>
      </div>
      {itemType === "milk" && (
        <div> 
          <label className="text-sm font-medium text-gray-500 mb-2 block">Brand Name</label>
          <input
            type="text"
            placeholder="Brand Name"
            className="border rounded-md p-2 w-full mb-2" 
          />
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-gray-500 mb-2 block">Rating</label>
        <div className="flex space-x-1 mb-4">
          {[1, 2 , 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>
        <textarea
          placeholder="Enter your remark..."
          value={userRemark}
          onChange={(e) => setUserRemark(e.target.value)}
          className="border rounded-md p-2 w-full mb-4"
        />
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {imagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleImageClick(image)} // Click to preview
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
          onClick={() => fileInputRef.current.click()}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer"
        >
          <PlusIcon className="w-6 h-6 text-gray-500" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoCapture}
          className="hidden"
          multiple
        />
      </div>
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
    </div>
  );
};

export default KitchenItem;