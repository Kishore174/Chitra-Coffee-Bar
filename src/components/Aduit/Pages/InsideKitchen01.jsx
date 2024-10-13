import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
const InsideKitchen01 = () => {
    const [selectedKitchenLightBrightness, setSelectedKitchenLightBrightness] = useState('');
    const [selectedKitchenLightRemark, setSelectedKitchenLightRemark] = useState('');
    const [kitchenLightUserRemark, setKitchenLightUserRemark] = useState('');
    const [kitchenLightRating, setKitchenLightRating] = useState(0);
    const [kitchenLightImagePreview, setKitchenLightImagePreview] = useState('');
    const kitchenLightFileInputRef = useRef(null);
    
    // Handlers for kitchen light
    const handleKitchenLightBrightnessClick = (brightness) => {
      setSelectedKitchenLightBrightness(brightness);
    };
    
    const handleKitchenLightRemarkClick = (remark) => {
      setSelectedKitchenLightRemark(remark);
    };
    
    const triggerKitchenLightFileInput = () => {
      kitchenLightFileInputRef.current.click();
    };
    
    const handleKitchenLightPhotoCapture = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setKitchenLightImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    
  return (
    <><div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
          <h2 className="text-xl font-semibold mb-2">Kitchen Light</h2>
          <div className="flex space-x-4 mb-4">
              {['Working', 'Not Working'].map((brightness) => (
                  <div
                      key={brightness}
                      onClick={() => handleKitchenLightBrightnessClick(brightness)}
                      className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
          hover:bg-blue-600 hover:text-white ${selectedKitchenLightBrightness === brightness ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                      {brightness}
                  </div>
              ))}
          </div>
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
          <input
              type="text"
              placeholder="Enter your remark..."
              value={kitchenLightUserRemark}
              onChange={(e) => setKitchenLightUserRemark(e.target.value)}
              className="border rounded-md p-2 w-full mb-2" />
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
          {kitchenLightImagePreview && (
              <div className="mt-4 mb-4">
                  <img src={kitchenLightImagePreview} alt="Kitchen Light Captured" className="h-24 w-24 border rounded-md object-cover" />
              </div>
          )}
          <button
              type="button"
              className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-blue-600 hover:text-white transition duration-200"
              onClick={triggerKitchenLightFileInput}
          >
              <CameraIcon className="w-5 h-5 mr-2" />
              Capture Kitchen Light Photo
          </button>
          <input
              type="file"
              accept="image/*"
              ref={kitchenLightFileInputRef}
              onChange={handleKitchenLightPhotoCapture}
              className="hidden" />
      </div></>
  )
}

export default InsideKitchen01