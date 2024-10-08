import React, { useState,useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
const LiveSnacks = () => {
  const [bajjiAvailable, setBajjiAvailable] = useState(null);
  const [samosaAvailable, setSamosaAvailable] = useState(null);
  const [bondaAvailable, setBondaAvailable] = useState(null);
  const [medhuVadaiAvailable, setMedhuVadaiAvailable] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const fileInputRef = useRef(null);
  const [remark, setRemark] = useState('');
  const [overallRating, setOverallRating] = useState(0);
 const navigate=useNavigate()
  const handleRating = (rate) => {
    setOverallRating(rate);
  };
  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedPhoto(imageUrl);
      setPhotoCount(photoCount + 1);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderRatingStars = (rate) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRating(star)}
          className={`cursor-pointer text-2xl ${star <= rate ? 'text-yellow-500' : 'text-gray-400'}`}
        >
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row w-full space-x-1 border mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <div className="flex flex-col w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
          {/* Back arrow */}
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-red-600 transition duration-200">
            <MdArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-2xl poppins-semibold ml-4">Live Snacks</h1>
        </div>

        {/* Bajji availability */}
        <div className="flex  space-x-4 mb-4">
          <h2 className="text-lg font-semibold">Bajji</h2>
          <div className="flex space-x-4 mb-2">
            {['Available', 'Not Available'].map((status) => (
              <div
                key={status}
                onClick={() => setBajjiAvailable(status)}
                className={`cursor-pointer px-4 py-2 font-medium rounded-full border transition-colors duration-200 hover:bg-red-600 hover:text-white ${bajjiAvailable === status ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Samosa availability */}
        <div className="flex  space-x-5 mb-4">
          <h2 className="text-lg font-semibold">Samosa</h2>
          <div className="flex space-x-4 mb-2">
            {['Available', 'Not Available'].map((status) => (
              <div
                key={status}
                onClick={() => setSamosaAvailable(status)}
                className={`cursor-pointer px-4 py-2 font-medium rounded-full border transition-colors duration-200 hover:bg-red-600 hover:text-white ${samosaAvailable === status ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Bonda availability */}
        <div className="flex  space-x-5 mb-4">
          <h2 className="text-lg font-semibold">Bonda</h2>
          <div className="flex space-x-4 mb-2">
            {['Available', 'Not Available'].map((status) => (
              <div
                key={status}
                onClick={() => setBondaAvailable(status)}
                className={`cursor-pointer px-4 py-2 font-medium rounded-full border transition-colors duration-200 hover:bg-red-600 hover:text-white ${bondaAvailable === status ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Medhu Vadai availability */}
        <div className="flex  space-x-5 mb-4">
          <h2 className="text-lg font-semibold">Medhu Vadai</h2>
          <div className="flex space-x-4 mb-2">
            {['Available', 'Not Available'].map((status) => (
              <div
                key={status}
                onClick={() => setMedhuVadaiAvailable(status)}
                className={`cursor-pointer px-4 py-2 font-medium rounded-full border transition-colors duration-200 hover:bg-red-600 hover:text-white ${medhuVadaiAvailable === status ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {status}
              </div>
            ))}
          </div>
        </div>

        {/* Remark Section */}
        <textarea
          className="p-2 border rounded w-full mt-4"
          placeholder="Add a remark for all snacks"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />

        {/* Overall Rating Section */}
        <h2 className="text-lg font-semibold mt-4">Overall Rating</h2>
        {renderRatingStars(overallRating)}
      </div>
      <div className='w-full lg:w-1/2 flex flex-col items-center bg-white p-6 rounded-lg shadow-md mt-6 lg:mt-0'>
        <h2 className="text-2xl  poppins-semibold mb-6">Capture Counter Photo (live)
        </h2>
        <div className='flex flex-col items-center mb-4'>
          {capturedPhoto && (
            <img src={capturedPhoto} alt="Captured" className="w-full h-auto max-w-md mb-4" />
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full max-w-md py-3 px-5 text-black border  poppins-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            onClick={triggerFileInput}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoCapture}
            className="hidden"
          />
        </div>

        <div className="mt-auto w-full">
          <button
            type="submit"
            className="w-full py-3    bg-red-500 text-white  poppins-medium rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
          >
            Submit Audit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSnacks;
