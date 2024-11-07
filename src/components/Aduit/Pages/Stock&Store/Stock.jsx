import React, { useState, useRef } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Stock = () => {
  const [bakshanamImagePreview, setBakshanamImagePreview] = useState([]);
  const [previewBakshanamImage, setPreviewBakshanamImage] = useState(null);
  const [remark, setRemark] = useState('');
  const bakshanamFileInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const triggerBakshanamFileInput = () => {
    bakshanamFileInputRef.current.click();
  };

  const handleBakshanamPhotoCapture = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + bakshanamImagePreview.length > 4) {
      alert('You can only upload up to 4 images.');
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setBakshanamImagePreview((prev) => [...prev, ...newImages]);
  };

  const handleCloseBakshanam = () => {
    setPreviewBakshanamImage(null);
  };

  const handleBakshanamClick = (image) => {
    setPreviewBakshanamImage(image);
  };

  const removeBakshanamImage = (index) => {
    setBakshanamImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // You can add logic here to handle the form submission if needed
    console.log('Submitted with remarks:', remark);
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg w-80 space-y-4">
        <h3 className="text-lg font-semibold text-center text-gray-800">Stock/Store</h3>

        {/* Upload Button */}
        <div
          onClick={triggerBakshanamFileInput}
          className="h-12 w-12 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={bakshanamFileInputRef}
          onChange={handleBakshanamPhotoCapture}
          className="hidden"
          multiple
        />

        {/* Uploaded Image Previews with Remove Button */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {bakshanamImagePreview.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Bakshanam ${index + 1}`}
                className="h-24 w-24 border rounded-md object-cover shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                onClick={() => handleBakshanamClick(image)}
              />
              <button
                onClick={() => removeBakshanamImage(index)}
                className="absolute top-0 right-0 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <h3 className="font-semibold">Remark</h3>
   
        <textarea
          placeholder="Add a remark..."
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full h-12 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Submit
        </button>

        {/* Image Preview Modal */}
        {previewBakshanamImage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="relative bg-white p-4 rounded-lg shadow-lg">
              <img src={previewBakshanamImage} alt="Preview" className="max-h-96 max-w-full rounded-md" />
              <button
                onClick={handleCloseBakshanam}
                className="absolute top-2 right-2 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stock;
