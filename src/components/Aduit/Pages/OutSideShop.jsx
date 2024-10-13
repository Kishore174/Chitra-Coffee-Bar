import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const OutSideShop = () => {
  const [selectedCustomerAreaLighting, setSelectedCustomerAreaLighting] = useState('');
  const [customerAreaLightingRating, setCustomerAreaLightingRating] = useState(0);
  const [customerAreaLightingImagePreview, setCustomerAreaLightingImagePreview] = useState('');
  const customerAreaLightingFileInputRef = useRef(null);
  const [selectedShopBoardCondition, setSelectedShopBoardCondition] = useState('');
  const [lightWorkingStatus, setLightWorkingStatus] = useState('');
  const [shopBoardRating, setShopBoardRating] = useState(0);
  const [shopBoardImagePreview, setShopBoardImagePreview] = useState('');
  const shopBoardFileInputRef = useRef(null);
  // Additional state for lollipop stand condition
  const [selectedLollipopStandCondition, setSelectedLollipopStandCondition] = useState('');
  const [lollipopStandLightWorkingStatus, setLollipopStandLightWorkingStatus] = useState('');
  const [lollipopStandRating, setLollipopStandRating] = useState(0);
  const [lollipopStandImagePreview, setLollipopStandImagePreview] = useState('');
  const lollipopStandFileInputRef = useRef(null);

  // Handlers for lollipop stand condition
  const handleLollipopStandConditionClick = (condition) => {
    setSelectedLollipopStandCondition(condition);
  };

  const handleLollipopStandLightWorkingStatusClick = (status) => {
    setLollipopStandLightWorkingStatus(status);
  };

  const triggerLollipopStandFileInput = () => {
    lollipopStandFileInputRef.current.click();
  };

  const handleLollipopStandPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLollipopStandImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for shop board condition
  const handleShopBoardConditionClick = (condition) => {
    setSelectedShopBoardCondition(condition);
  };

  const handleLightWorkingStatusClick = (status) => {
    setLightWorkingStatus(status);
  };

  const triggerShopBoardFileInput = () => {
    shopBoardFileInputRef.current.click();
  };

  const handleShopBoardPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopBoardImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for customer area lighting
  const handleCustomerAreaLightingClick = (lighting) => {
    setSelectedCustomerAreaLighting(lighting);
  };

  const triggerCustomerAreaLightingFileInput = () => {
    customerAreaLightingFileInputRef.current.click();
  };

  const handleCustomerAreaLightingPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomerAreaLightingImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <><div className="p-4 flex flex-wrap mx-auto justify-center gap-4">
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Customer Area Lighting</h2>
              <div className="flex space-x-4 mb-4 justify-center">
                  {['Yes', 'No'].map((lighting) => (
                      <div
                          key={lighting}
                          onClick={() => handleCustomerAreaLightingClick(lighting)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedCustomerAreaLighting === lighting ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {lighting}
                      </div>
                  ))}
              </div>
              <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setCustomerAreaLightingRating(index + 1)}
                          className={`cursor-pointer text-2xl ${customerAreaLightingRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {customerAreaLightingImagePreview && (
                  <div className="mt-4 mb-4 flex justify-center">
                      <img src={customerAreaLightingImagePreview} alt="Customer Area Lighting Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerCustomerAreaLightingFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Customer Area Lighting Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={customerAreaLightingFileInputRef}
                  onChange={handleCustomerAreaLightingPhotoCapture}
                  className="hidden" />
          </div>

          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Shop Board</h2>
              <div className="flex space-x-4 mb-4 justify-center">
                  <h1 className='pt-3'>Condition</h1>
                  {['Good', 'Bad'].map((condition) => (
                      <div
                          key={condition}
                          onClick={() => handleShopBoardConditionClick(condition)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedShopBoardCondition === condition ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {condition}
                      </div>
                  ))}
              </div>
              <div className="flex space-x-4 mb-4 justify-center">
                  <h1 className='pt-3'>Light</h1>
                  {['Yes', 'No'].map((status) => (
                      <div
                          key={status}
                          onClick={() => handleLightWorkingStatusClick(status)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${lightWorkingStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {status}
                      </div>
                  ))}
              </div>
              <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setShopBoardRating(index + 1)}
                          className={`cursor-pointer text-2xl ${shopBoardRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {shopBoardImagePreview && (
                  <div className="mt-4 mb-4 flex justify-center">
                      <img src={shopBoardImagePreview} alt="Shop Board Condition Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerShopBoardFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Shop Board Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={shopBoardFileInputRef}
                  onChange={handleShopBoardPhotoCapture}
                  className="hidden" />
          </div>

          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Lollipop Stand Condition</h2>
              <div className="flex space-x-4 mb-4 justify-center">
                  {['Good', 'Bad'].map((condition) => (
                      <div
                          key={condition}
                          onClick={() => handleLollipopStandConditionClick(condition)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedLollipopStandCondition === condition ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {condition}
                      </div>
                  ))}
              </div>
              <div className="flex space-x-4 mb-4 justify-center">
                  <h1 className='pt-3'>Light</h1>
                  {['Yes', 'No'].map((status) => (
                      <div
                          key={status}
                          onClick={() => handleLollipopStandLightWorkingStatusClick(status)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${lollipopStandLightWorkingStatus === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {status}
                      </div>
                  ))}
              </div>
              <div className="flex items-center justify-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setLollipopStandRating(index + 1)}
                          className={`cursor-pointer text-2xl ${lollipopStandRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {lollipopStandImagePreview && (
                  <div className="mt-4 mb-4 flex justify-center">
                      <img src={lollipopStandImagePreview} alt="Lollipop Stand Condition Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerLollipopStandFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Lollipop Stand Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={lollipopStandFileInputRef}
                  onChange={handleLollipopStandPhotoCapture}
                  className="hidden" />
          </div>

      </div><Link to="/Branding">

              <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
                  <span className='text-center  mx-auto'> Go Wall Branding</span>
              </button>
          </Link></>
  );
};

export default OutSideShop;
