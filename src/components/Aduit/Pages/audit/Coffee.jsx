import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import {   PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

 
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
  
  const [coffeeImagePreview, setCoffeeImagePreview] = useState([]);
  const [isCoffeeSubmitted, setIsCoffeeSubmitted] = useState(false);
  const [previewCoffeeImage, setPreviewCoffeeImage] = useState(null);
   
  const coffeeFileInputRef = useRef(null);

  
  const triggerCoffeeFileInput = () => {
    coffeeFileInputRef.current.click();
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

  const handleCoffeePhotoCapture =async (e) => {
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
          setCoffeeImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeCoffeeImage = (index) => {
    setCoffeeImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleCoffeeClick = (image) => {
    setPreviewCoffeeImage(image);
  };

  const handleCloseCoffee = () => {
    setPreviewCoffeeImage(null);
  };

  const handleCoffeeSubmit = () => {
    setIsCoffeeSubmitted(true);
    // Add your submission logic here
  };


   return (
<form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-4 md:p-8 bg-gray-50 rounded-lg shadow-lg">
  <div className="flex flex-col w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
    {/* Header with back arrow */}
    <div className="flex items-center mb-6">
      <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-red-600 transition duration-200">
        <MdArrowBack className="w-6 h-6" />
      </button>
      <h1 className="text-xl md:text-2xl font-semibold ml-4">Coffee Audit</h1>
    </div>

    {/* Coffee, Sugar, Temperature, Tea Color, Aroma, Taste selections */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Coffee Selection */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Coffee</h2>
        <div className="flex space-x-2">
          {['Good', 'Bad', 'Hot'].map((coffee) => (
            <div
              key={coffee}
              onClick={() => handleCoffeeClick(coffee)}
              className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                selectedCoffee === coffee ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {coffee}
            </div>
          ))}
        </div>
      </div>

      {/* Additional options follow the same pattern as Coffee Selection */}
      {/* Sugar Selection */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Sugar Level</h2>
        <div className="flex space-x-2">
          {['High', 'Low', 'Perfect'].map((sugar) => (
            <div
              key={sugar}
              onClick={() => handleSugarClick(sugar)}
              className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                selectedSugar === sugar ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {sugar}
            </div>
          ))}
        </div>
      </div>

      {/* Additional options for Temperature, Tea Color, Aroma, and Taste */}
      {/* Temperature Selection */}
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Temperature</h2>
        <div className="flex space-x-2">
          {['Hot', 'Warm', 'Cold'].map((temperature) => (
            <div
              key={temperature}
              onClick={() => handleTemperatureClick(temperature)}
              className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${
                selectedTemperature === temperature ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              {temperature}
            </div>
          ))}
        </div>
      </div>
      <div>
          <label className="text-lg poppins-medium mr-4">Coffee Color</label>
          <div className="flex space-x-2 sm:space-x-4">
            {['Light', 'Perfect', 'Dark'].map((color) => (
              <div
                key={color}
                onClick={() => handleColorClick(color)}
                className={`cursor-pointer px-3 py-1  mt-2  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedColor === color ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {color}
              </div>
            ))}
          </div>
        </div>
  
        {/* Aroma selection */}
        <div>
          <label className="text-lg  poppins-medium mr-4">Aroma</label>
          <div className="flex space-x-2 sm:space-x-4">
            {['Excellent', 'Bad'].map((aroma) => (
              <div
                key={aroma}
                onClick={() => handleAromaClick(aroma)}
                className={`cursor-pointer px-3 py-1  mt-2  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedAroma === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {aroma}
              </div>
            ))}
          </div>
        </div>
  
        {/* Taste selection */}
        <div>
          <label className="text-lg  poppins-medium mr-4">Taste</label>
          <div className="flex space-x-2 sm:space-x-4">
            {['Excellent', 'Bad'].map((taste) => (
              <div
                key={taste}
                onClick={() => handleTasteClick(taste)}
                className={`cursor-pointer px-3 py-1  mt-2  rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedTaste === taste ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {taste}
              </div>
            ))}
          </div>
        </div>
      {/* Repeat similar structure for Tea Color, Aroma, and Taste */}

      {/* Remark Input */}
      
      <div className="col-span-1 sm:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Remark</h2>
        <textarea
          value={remark}
          onChange={handleRemarkChange}
          rows="3"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Add your remarks here..."
        />
      </div>

      {/* Rating */}
      <div className="col-span-1 sm:col-span-2 flex flex-col">
        <h2 className="text-lg font-semibold mb-2">Rating</h2>
        <div className="flex space-x-1">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              onClick={() => handleRatingClick(index + 1)}
              className={`cursor-pointer text-2xl ${
                rating > index ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Image Capture Section */}
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Capture Counter Photo (live)</h2>
      <div className="flex flex-wrap gap-4">
        {coffeeImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="h-24 w-24 rounded-md border object-cover"
              onClick={() => handleCoffeeClick(image)}
            />
            <button
              onClick={() => removeCoffeeImage(index)}
              className="absolute top-0 right-0 text-red-500"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
        <div onClick={triggerCoffeeFileInput} className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200">
          <PlusIcon className="w-6 h-6 text-gray-600" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref={coffeeFileInputRef}
          onChange={handleCoffeePhotoCapture}
          className="hidden"
          multiple
        />
      </div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className={`mt-6 w-full py-2 rounded-md text-white ${
        isCoffeeSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'
      }`}
    >
      {isCoffeeSubmitted ? 'Submitted' : 'Submit'}
    </button>
  </div>
</form>

   )
 }
 
 export default Coffee