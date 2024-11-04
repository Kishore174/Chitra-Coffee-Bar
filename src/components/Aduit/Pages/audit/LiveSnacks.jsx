import React, { useState,useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import {   PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

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
  const handleLiveSnackPhotoCapture =async(e) => {
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
          setLiveSnackmagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
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
  
  const [liveSnackImagePreview, setLiveSnackmagePreview] = useState([]);
  const [isliveSnackSubmitted, setIsLiveSnackSubmitted] = useState(false);
  const [previewLiveSnackImage, setPreviewLiveSnackImage] = useState(null);
  
 
  const liveSnackFileInputRef = useRef(null);

  
  const triggerLiveSnackFileInput = () => {
    liveSnackFileInputRef.current.click();
  };

  

  const removeLiveSnackImage = (index) => {
    setLiveSnackmagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleLiveSnackClick = (image) => {
    setPreviewLiveSnackImage(image);
  };

  const handleCloseLiveSnack = () => {
    setPreviewLiveSnackImage(null);
  };

  const handleLiveSnackSubmit = () => {
    setIsLiveSnackSubmitted(true);
    // Add your submission logic here
  };

  return (
    <div className="flex flex-col lg:flex-row w-full space-x-1 border mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <div className="  w-full   bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6 ">
          {/* Back arrow */}
          <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-red-600 transition duration-200">
            <MdArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-2xl poppins-semibold ml-4">Live Snacks</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="   items-center mb-4 w-full">
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
        <div className=" items-center mb-4 w-full">
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
        <div className=" items-center mb-4 w-full">
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
        <div className="  items-center mb-4 w-full">
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
    
   
      
       
      <div>
      <h2 className="text-2xl poppins-semibold mb-6">Capture Counter Photo (live)</h2>

     
        <div className="flex flex-wrap gap-2 mb-4">
          
          {liveSnackImagePreview.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Hand Wash ${index + 1}`}
                className="h-24 w-24 border rounded-md object-cover cursor-pointer"
                onClick={() => handleLiveSnackClick(image)}
              />
              <button
                onClick={() => removeLiveSnackImage(index)}
                className="absolute top-0 right-0 text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div
            onClick={triggerLiveSnackFileInput}
            className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
          >
            <PlusIcon className="w-8 h-8 text-gray-600" />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={liveSnackFileInputRef}
            onChange={handleLiveSnackPhotoCapture}
            className="hidden"
            multiple
          />
        </div>
        </div>
     
        <button
          onClick={handleLiveSnackSubmit}
          className={`mt-4 w-full   text-center mx-auto py-2 rounded-md text-white ${isliveSnackSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isliveSnackSubmitted ? (
            <div className="flex items-center justify-center">
              <span>Submitted</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
   
      

        {previewLiveSnackImage && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="relative bg-white p-4 rounded-lg">
              <img src={previewLiveSnackImage} alt="Preview" className="max-h-96 max-w-full rounded" />
              <button
                onClick={handleCloseLiveSnack}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
        {isliveSnackSubmitted && (
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
      </div>
  );
};

export default LiveSnacks;
