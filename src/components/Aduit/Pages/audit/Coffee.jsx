import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

 
 const Coffee = () => {
  const [selectedCoffee, setSelectedCoffe] = useState(null);
  const [selectedSugar, setSelectedSugar] = useState(null);
  const [selectedTemperature, setSelectedTemperature] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedAroma, setSelectedAroma] = useState(null);
  const [selectedTaste, setSelectedTaste] = useState(null);
  const [remark, setRemark] = useState('');
  const [rating, setRating] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoCount, setPhotoCount] = useState(0);
  const fileInputRef = useRef(null);

  const handleTeaClick = (option) => setSelectedCoffe(option);
  const handleSugarClick = (level) => setSelectedSugar(level);
  const handleTemperatureClick = (temperature) => setSelectedTemperature(temperature);
  const handleColorClick = (color) => setSelectedColor(color);
  const handleAromaClick = (aroma) => setSelectedAroma(aroma);
  const handleTasteClick = (taste) => setSelectedTaste(taste);
  const handleRemarkChange = (e) => setRemark(e.target.value);
  const handleRatingClick = (rate) => setRating(rate);

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
 const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    const auditData = {
      tea: selectedCoffee,
      sugar: selectedSugar,
      temperature: selectedTemperature,
      color: selectedColor,
      aroma: selectedAroma,
      taste: selectedTaste,
      remark,
      rating,
      capturedPhoto,
      photoCount,
    };
    console.log('Submitted Data:', auditData);
    // Here, you can also send the data to a server or perform further actions.
  };

   return (
    <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row w-full space-x-1 border mx-auto p-8 bg-gray-50 rounded-lg shadow-lg'>
    <div className="flex flex-col w-full lg:w-1/2   bg-white p-6 rounded-lg shadow-md flex-grow">
    <div className="flex items-center mb-6">
        {/* Back arrow */}
        <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-red-600 transition duration-200">
          <MdArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-2xl poppins-semibold ml-4">Coffee Audit</h1>
      </div>

      {/* Tea selection */}
      <div className="flex items-center mb-4 w-full">
      <h2 className="text-lg  poppins-semibold mr-4">Coffee</h2>
    
        <div className="flex space-x-4 ml-auto">
          {['Good', 'Bad', 'Hot'].map(( coffee) => (
            <div
              key={ coffee}
              onClick={() => handleTeaClick( coffee)}
              className={`cursor-pointer px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedCoffee ===  coffee ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              { coffee}
            </div>
          ))}
        </div>
      </div>

      {/* Sugar selection */}
      <div className="flex items-center mb-4 w-full">
        <h2 className="text-lg  poppins-semibold mr-4">Sugar Level</h2>
        <div className="flex space-x-4 ml-auto">
          {['High', 'Low', 'Perfect'].map((sugar) => (
            <div
              key={sugar}
              onClick={() => handleSugarClick(sugar)}
              className={`cursor-pointer px-4 py-2 poppins-medium  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedSugar === sugar ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {sugar}
            </div>
          ))}
        </div>
      </div>

      {/* Temperature selection */}
      <div className="flex items-center mb-4 w-full">
        <h2 className="text-lg  poppins-semibold mr-4">Temperature</h2>
        <div className="flex space-x-4 ml-auto">
          {['Hot', 'Warm', 'Cold'].map((temperature) => (
            <div
              key={temperature}
              onClick={() => handleTemperatureClick(temperature)}
              className={`cursor-pointer px-4 py-2 poppins-medium  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedTemperature === temperature ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {temperature}
            </div>
          ))}
        </div>
      </div>

      {/* Tea color selection */}
      <div className="flex items-center mb-4 w-full">
        <h2 className="text-lg  poppins-semibold mr-4">Tea Color</h2>
        <div className="flex space-x-4 ml-auto">
          {['Light', 'Perfect', 'Dark'].map((color) => (
            <div
              key={color}
              onClick={() => handleColorClick(color)}
              className={`cursor-pointer px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedColor === color ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {color}
            </div>
          ))}
        </div>
      </div>

      {/* Aroma selection */}
      <div className="flex items-center mb-4 w-full">
        <h2 className="text-lg  poppins-semibold mr-4">Aroma</h2>
        <div className="flex space-x-4 ml-auto">
          {['Excellent', 'Bad'].map((aroma) => (
            <div
              key={aroma}
              onClick={() => handleAromaClick(aroma)}
              className={`cursor-pointer px-4 py-2 poppins-medium  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedAroma === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {aroma}
            </div>
          ))}
        </div>
      </div>

      {/* Taste selection */}
      <div className="flex items-center mb-4 w-full">
        <h2 className="text-lg  poppins-semibold mr-4">Taste</h2>
        <div className="flex space-x-4 ml-auto">
          {['Excellent', 'Bad'].map((taste) => (
            <div
              key={taste}
              onClick={() => handleTasteClick(taste)}
              className={`cursor-pointer px-4 py-2 poppins-medium  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedTaste === taste ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {taste}
            </div>
          ))}
        </div>
      </div>

      {/* Remark input */}
      <div className="flex flex-col mt-6 w-full">
        <h2 className="text-lg  poppins-semibold">Remark</h2>
        <textarea
          value={remark}
          onChange={handleRemarkChange}
          rows="4"
          className="mt-2 border rounded-lg p-2 w-full max-w-md transition-colors duration-200 hover:border-red-300 focus:border-red-500 focus:outline-none"
          placeholder="Add your remarks here..."
        />
      </div>

      {/* Star rating */}
      <div className="flex flex-col mt-6 w-full">
        <h2 className="text-lg  poppins-semibold">Rating</h2>
        <div className="flex space-x-1 mt-2">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-500' : 'text-gray-300'}`}
              onClick={() => handleRatingClick(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
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
  </form>
   )
 }
 
 export default Coffee