import React, { useState, useRef } from 'react';
import { CameraIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
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
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); 
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
const [exhaustFanImagePreview, setExhaustFanImagePreview] = useState([]);
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
  const handleExhaustFanPhotoCapture=(e) =>{
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExhaustFanImagePreview((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
 
    e.target.value = null; // Reset input value
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
  // Remove image preview
  const removeImage = (index) => {
    setExhaustFanImagePreview((prev) => prev.filter((_, i) => i !== index));
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
    <>
    <div className="p-4 flex flex-wrap justify-start  mx-auto gap-4">
          {/* Card for Snack Making */}
          <div className="border rounded-lg shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
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
          <div className="border rounded-lg shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
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
          <div className="border rounded-lg shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
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
          <div className="border rounded-lg shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
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
          <div className="border rounded-lg relative shadow-md p-4 w-full sm:w-1/2 lg:w-1/4 ">
              <h2 className="text-xl font-semibold mb-2">Exhaust Fan</h2>
              <div className="flex space-x-4 mb-4">
                  {['Working', 'Not Working'].map((condition) => (
                      <div
                          key={condition}
                          onClick={() => handleExhaustFanConditionClick(condition)}
                          className={`cursor-pointer px-2 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
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
              <div className="flex flex-wrap gap-2 mb-4">
        {exhaustFanImagePreview.map((image, index) => (
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
          onClick={triggerExhaustFanFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        ref={exhaustFanFileInputRef}
        onChange={handleExhaustFanPhotoCapture}
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
              <XMarkIcon  className="w-6 h-6" />
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
          <InsideKitchen01 />
      </div><Link to="/Outsideshop">

              <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
                  <span className='text-center  mx-auto'> Go Outside Shop</span>
              </button>
          </Link></>
  );
};

export default InsideKitchen;
