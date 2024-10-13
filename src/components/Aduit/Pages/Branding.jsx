import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Branding = () => {
  const [selectedMenuBrandAvailability, setSelectedMenuBrandAvailability] = useState('');
  const [menuBrandRating, setMenuBrandRating] = useState(0);
  const [menuBrandRemarks, setMenuBrandRemarks] = useState('');
  const [menuBrandImagePreview, setMenuBrandImagePreview] = useState('');
  const menuBrandFileInputRef = useRef(null);
  
  const [selectedMapAvailability, setSelectedMapAvailability] = useState('');
  const [mapRating, setMapRating] = useState(0);
  const [mapImagePreview, setMapImagePreview] = useState('');
  const mapFileInputRef = useRef(null);
  
  const [selectedBunzoAvailability, setSelectedBunzoAvailability] = useState('');
  const [bunzoRemark, setBunzoRemark] = useState('');
  const [bunzoImagePreview, setBunzoImagePreview] = useState('');
  const bunzoFileInputRef = useRef(null);

  // New state variables for Bakshanam section
  const [selectedBakshanamAvailability, setSelectedBakshanamAvailability] = useState('');
  const [bakshanamRemark, setBakshanamRemark] = useState('');
  const [bakshanamImagePreview, setBakshanamImagePreview] = useState('');
  const bakshanamFileInputRef = useRef(null);

  // Bunzo handlers
  const handleBunzoAvailabilityClick = (availability) => {
    setSelectedBunzoAvailability(availability);
  };

  const triggerBunzoFileInput = () => {
    bunzoFileInputRef.current.click();
  };

  const handleBunzoPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBunzoImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Bakshanam handlers
  const handleBakshanamAvailabilityClick = (availability) => {
    setSelectedBakshanamAvailability(availability);
  };

  const triggerBakshanamFileInput = () => {
    bakshanamFileInputRef.current.click();
  };

  const handleBakshanamPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBakshanamImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Map section
  const handleMapAvailabilityClick = (availability) => {
    setSelectedMapAvailability(availability);
  };

  const triggerMapFileInput = () => {
    mapFileInputRef.current.click();
  };

  const handleMapPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMapImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Menu Brand handlers
  const handleMenuBrandAvailabilityClick = (availability) => {
    setSelectedMenuBrandAvailability(availability);
  };

  const triggerMenuBrandFileInput = () => {
    menuBrandFileInputRef.current.click();
  };

  const handleMenuBrandPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuBrandImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 flex flex-wrap mx-auto justify-center gap-4">
      <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
        <h2 className="text-xl font-semibold mb-2">Menu Brand</h2>
        <div className="flex space-x-4 mb-4 justify-center">
          <h1 className='pt-3'>Available</h1>
          {['Yes', 'No'].map((availability) => (
            <div
              key={availability}
              onClick={() => handleMenuBrandAvailabilityClick(availability)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedMenuBrandAvailability === availability ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {availability}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => setMenuBrandRating(index + 1)}
              className={`cursor-pointer text-2xl ${menuBrandRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={menuBrandRemarks}
          onChange={(e) => setMenuBrandRemarks(e.target.value)}
          placeholder="Enter remarks"
          className="w-full p-2 border rounded-md mb-4"
          rows={3}
        />
        {menuBrandImagePreview && (
          <div className="mt-4 mb-4 flex justify-center">
            <img src={menuBrandImagePreview} alt="Menu Brand Captured" className="h-24 w-24 border rounded-md object-cover" />
          </div>
        )}
        <button
          type="button"
          className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          onClick={triggerMenuBrandFileInput}
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Capture Menu Brand Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={menuBrandFileInputRef}
          onChange={handleMenuBrandPhotoCapture}
          className="hidden"
        />
      </div>

      <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
        <h2 className="text-xl font-semibold mb-2">Map</h2>
        <div className="flex space-x-4 mb-4 justify-center">
          <h1 className='pt-3'>Available</h1>
          {['Yes', 'No'].map((availability) => (
            <div
              key={availability}
              onClick={() => handleMapAvailabilityClick(availability)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedMapAvailability === availability ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {availability}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => setMapRating(index + 1)}
              className={`cursor-pointer text-2xl ${mapRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
            >
              ★
            </span>
          ))}
        </div>
        {mapImagePreview && (
          <div className="mt-4 mb-4 flex justify-center">
            <img src={mapImagePreview} alt="Map Captured" className="h-24 w-24 border rounded-md object-cover" />
          </div>
        )}
        <button
          type="button"
          className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          onClick={triggerMapFileInput}
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Capture Map Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={mapFileInputRef}
          onChange={handleMapPhotoCapture}
          className="hidden"
        />
      </div>

      <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
        <h2 className="text-xl font-semibold mb-2">Bunzo</h2>
        <div className="flex space-x-4 mb-4 justify-center">
          <h1 className='pt-3'>Available</h1>
          {['Yes', 'No'].map((availability) => (
            <div
              key={availability}
              onClick={() => handleBunzoAvailabilityClick(availability)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedBunzoAvailability === availability ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {availability}
            </div>
          ))}
        </div>
        <textarea
          value={bunzoRemark}
          onChange={(e) => setBunzoRemark(e.target.value)}
          placeholder="Enter remarks"
          className="w-full p-2 border rounded-md mb-4"
          rows={3}
        />
        {bunzoImagePreview && (
          <div className="mt-4 mb-4 flex justify-center">
            <img src={bunzoImagePreview} alt="Bunzo Captured" className="h-24 w-24 border rounded-md object-cover" />
          </div>
        )}
        <button
          type="button"
          className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          onClick={triggerBunzoFileInput}
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Capture Bunzo Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={bunzoFileInputRef}
          onChange={handleBunzoPhotoCapture}
          className="hidden"
        />
      </div>

      {/* Bakshanam Section */}
      <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
        <h2 className="text-xl font-semibold mb-2">Bakshanam</h2>
        <div className="flex space-x-4 mb-4 justify-center">
          <h1 className='pt-3'>Available</h1>
          {['Yes', 'No'].map((availability) => (
            <div
              key={availability}
              onClick={() => handleBakshanamAvailabilityClick(availability)}
              className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-blue-600 hover:text-white ${selectedBakshanamAvailability === availability ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {availability}
            </div>
          ))}
        </div>
        <textarea
          value={bakshanamRemark}
          onChange={(e) => setBakshanamRemark(e.target.value)}
          placeholder="Enter remarks"
          className="w-full p-2 border rounded-md mb-4"
          rows={3}
        />
        {bakshanamImagePreview && (
          <div className="mt-4 mb-4 flex justify-center">
            <img src={bakshanamImagePreview} alt="Bakshanam Captured" className="h-24 w-24 border rounded-md object-cover" />
          </div>
        )}
        <button
          type="button"
          className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          onClick={triggerBakshanamFileInput}
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Capture Bakshanam Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={bakshanamFileInputRef}
          onChange={handleBakshanamPhotoCapture}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Branding;
