import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import InsideKitchen01 from './InsideKitchen01';
import { Link } from 'react-router-dom';

const InsideKitchen = () => {
  const [selectedSnackRemark, setSelectedSnackRemark] = useState('');
  const [snackUserRemark, setSnackUserRemark] = useState('');
  const [granderRemark, setGranderRemark] = useState('');

  const [snackImagePreview, setSnackImagePreview] = useState(null);
  const [milkBrandName, setMilkBrandName] = useState('');
  const [milkRating, setMilkRating] = useState(0);
  const [milkImagePreview, setMilkImagePreview] = useState(null);
  const [grinderBrandName, setGrinderBrandName] = useState('');
  const [grinderRating, setGrinderRating] = useState(0);
  const [grinderImagePreview, setGrinderImagePreview] = useState(null);
  const [selectedGrinderRemark, setSelectedGrinderRemark] = useState('');

  // New state for Sink
  const [selectedSinkRemark, setSelectedSinkRemark] = useState('');
  const [sinkUserRemark, setSinkUserRemark] = useState('');
  const [sinkImagePreview, setSinkImagePreview] = useState(null);
  const [sinkRating, setSinkRating] = useState(0); // New state for sink rating

  // New state for Work Table
  const [selectedWorkTableRemark, setSelectedWorkTableRemark] = useState('');
  const [workTableUserRemark, setWorkTableUserRemark] = useState('');
  const [workTableImagePreview, setWorkTableImagePreview] = useState(null);
  const [workTableRating, setWorkTableRating] = useState(0); // New state for work table rating
  const [selectedKitchenFloorRemark, setSelectedKitchenFloorRemark] = useState('');
  const [kitchenFloorUserRemark, setKitchenFloorUserRemark] = useState('');
  const [kitchenFloorRating, setKitchenFloorRating] = useState(0);
  const [kitchenFloorImagePreview, setKitchenFloorImagePreview] = useState('');
  const kitchenFloorFileInputRef = useRef(null);
  const snackFileInputRef = useRef(null);
  const milkFileInputRef = useRef(null);
  const grinderFileInputRef = useRef(null);
  const sinkFileInputRef = useRef(null);
  const workTableFileInputRef = useRef(null); // Ref for work table file input
// Additional state for exhaust fan
const [selectedExhaustFanCondition, setSelectedExhaustFanCondition] = useState('');
const [selectedExhaustFanRemark, setSelectedExhaustFanRemark] = useState('');
const [exhaustFanUserRemark, setExhaustFanUserRemark] = useState('');
const [exhaustFanRating, setExhaustFanRating] = useState(0);
const [exhaustFanImagePreview, setExhaustFanImagePreview] = useState('');
const exhaustFanFileInputRef = useRef(null);
const handleExhaustFanConditionClick = (condition) => {
    setSelectedExhaustFanCondition(condition);
  };
  
  const handleExhaustFanRemarkClick = (remark) => {
    setSelectedExhaustFanRemark(remark);
  };
  
  const triggerExhaustFanFileInput = () => {
    exhaustFanFileInputRef.current.click();
  };
  
  const handleExhaustFanPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExhaustFanImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSnackRemarkClick = (remark) => {
    setSelectedSnackRemark(remark);
  };

  const handleGrinderRemarkClick = (remark) => {
    setSelectedGrinderRemark(remark);
  };

  const handleSinkRemarkClick = (remark) => {
    setSelectedSinkRemark(remark);
  };

  // New remark click handler for Work Table
  const handleWorkTableRemarkClick = (remark) => {
    setSelectedWorkTableRemark(remark);
  };

  const handleSnackPhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSnackImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMilkPhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMilkImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGrinderPhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGrinderImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSinkPhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSinkImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // New function for Work Table photo capture
  const handleWorkTablePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWorkTableImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSnackFileInput = () => {
    snackFileInputRef.current.click();
  };

  const triggerMilkFileInput = () => {
    milkFileInputRef.current.click();
  };

  const triggerGrinderFileInput = () => {
    grinderFileInputRef.current.click();
  };

  const triggerSinkFileInput = () => {
    sinkFileInputRef.current.click();
  };

  // New function to trigger Work Table file input
  const triggerWorkTableFileInput = () => {
    workTableFileInputRef.current.click();
  };

  const handleKitchenFloorRemarkClick = (remark) => {
    setSelectedKitchenFloorRemark(remark);
  };
  
  const triggerKitchenFloorFileInput = () => {
    kitchenFloorFileInputRef.current.click();
  };
  
  const handleKitchenFloorPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKitchenFloorImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <><div className="p-4 flex flex-wrap gap-4">
          {/* Card for Snack Making */}
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h1 className="text-2xl font-semibold mb-4">Snack Making Counter</h1>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleSnackRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedSnackRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              <textarea
                  placeholder="Enter your remark..."
                  value={snackUserRemark}
                  onChange={(e) => setSnackUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-4" />
              {snackImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={snackImagePreview} alt="Snack Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerSnackFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Snack Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={snackFileInputRef}
                  onChange={handleSnackPhotoCapture}
                  className="hidden" />
          </div>

          {/* Card for Milk Freezer */}
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Milk Freezer</h2>
              <input
                  type="text"
                  placeholder="Milk Brand Name"
                  value={milkBrandName}
                  onChange={(e) => setMilkBrandName(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setMilkRating(index + 1)}
                          className={`cursor-pointer text-2xl ${milkRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {milkImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={milkImagePreview} alt="Milk Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerMilkFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Milk Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={milkFileInputRef}
                  onChange={handleMilkPhotoCapture}
                  className="hidden" />
          </div>

          {/* Card for Grinder */}
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Grinder</h2>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleGrinderRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedGrinderRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              <input
                  type="text"
                  placeholder="Grinder Brand Name"
                  value={grinderBrandName}
                  onChange={(e) => setGrinderBrandName(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setGrinderRating(index + 1)}
                          className={`cursor-pointer text-2xl ${grinderRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {grinderImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={grinderImagePreview} alt="Grinder Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerGrinderFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Grinder Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={grinderFileInputRef}
                  onChange={handleGrinderPhotoCapture}
                  className="hidden" />
          </div>

          {/* Card for Sink */}
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Sink</h2>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleSinkRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedSinkRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              <input
                  type="text"
                  placeholder="Enter your remark..."
                  value={sinkUserRemark}
                  onChange={(e) => setSinkUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setSinkRating(index + 1)}
                          className={`cursor-pointer text-2xl ${sinkRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {sinkImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={sinkImagePreview} alt="Sink Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerSinkFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Sink Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={sinkFileInputRef}
                  onChange={handleSinkPhotoCapture}
                  className="hidden" />
          </div>

          {/* Card for Work Table */}
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Work Table</h2>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleWorkTableRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedWorkTableRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              <input
                  type="text"
                  placeholder="Enter your remark..."
                  value={workTableUserRemark}
                  onChange={(e) => setWorkTableUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setWorkTableRating(index + 1)}
                          className={`cursor-pointer text-2xl ${workTableRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {workTableImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={workTableImagePreview} alt="Work Table Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerWorkTableFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Work Table Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={workTableFileInputRef}
                  onChange={handleWorkTablePhotoCapture}
                  className="hidden" />
          </div>
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Kitchen Floor</h2>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleKitchenFloorRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
          hover:bg-red-600 hover:text-white ${selectedKitchenFloorRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              <input
                  type="text"
                  placeholder="Enter your remark..."
                  value={kitchenFloorUserRemark}
                  onChange={(e) => setKitchenFloorUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setKitchenFloorRating(index + 1)}
                          className={`cursor-pointer text-2xl ${kitchenFloorRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {kitchenFloorImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={kitchenFloorImagePreview} alt="Kitchen Floor Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                  onClick={triggerKitchenFloorFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Kitchen Floor Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={kitchenFloorFileInputRef}
                  onChange={handleKitchenFloorPhotoCapture}
                  className="hidden" />
          </div>
          <div className="border rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Exhaust Fan</h2>
              <div className="flex space-x-4 mb-4">
                  {['Working', 'Not Working'].map((condition) => (
                      <div
                          key={condition}
                          onClick={() => handleExhaustFanConditionClick(condition)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
          hover:bg-green-600 hover:text-white ${selectedExhaustFanCondition === condition ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {condition}
                      </div>
                  ))}
              </div>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleExhaustFanRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
          hover:bg-red-600 hover:text-white ${selectedExhaustFanRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              <input
                  type="text"
                  placeholder="Enter your remark..."
                  value={exhaustFanUserRemark}
                  onChange={(e) => setExhaustFanUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setExhaustFanRating(index + 1)}
                          className={`cursor-pointer text-2xl ${exhaustFanRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              {exhaustFanImagePreview && (
                  <div className="mt-4 mb-4">
                      <img src={exhaustFanImagePreview} alt="Exhaust Fan Captured" className="h-24 w-24 border rounded-md object-cover" />
                  </div>
              )}
              <button
                  type="button"
                  className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-green-600 hover:text-white transition duration-200"
                  onClick={triggerExhaustFanFileInput}
              >
                  <CameraIcon className="w-5 h-5 mr-2" />
                  Capture Exhaust Fan Photo
              </button>
              <input
                  type="file"
                  accept="image/*"
                  ref={exhaustFanFileInputRef}
                  onChange={handleExhaustFanPhotoCapture}
                  className="hidden" />
          </div>
          <InsideKitchen01 />
      </div><Link to="/Outsideshop">

              <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
                  <span className='text-center  mx-auto'> Go Outside Shop</span>
              </button>
          </Link></>
  );
};

export default InsideKitchen;
