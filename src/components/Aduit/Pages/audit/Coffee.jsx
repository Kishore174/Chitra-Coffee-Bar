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
    <form onSubmit={handleSubmit} className='    w-full space-x-1 border mx-auto p-8 bg-gray-50 rounded-lg shadow-lg'>
    <div className="flex flex-col w-full    bg-white p-6 rounded-lg shadow-md flex-grow">
    <div className="flex items-center mb-6">
        {/* Back arrow */}
        <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-red-600 transition duration-200">
          <MdArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-2xl poppins-semibold ml-4">Coffee Audit</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="  items-center mb-4 w-full">
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
      <div className=" items-center mb-4 w-full">
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
      <div className=" items-center mb-4 w-full">
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
      <div className="  items-center mb-4 w-full">
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
      <div className="  items-center mb-4 w-full">
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
      <div className=" items-center mb-4 w-full">
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
      </div>

      {/* Remark input */}
      <div  className='flex'>
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
  
    
       
       <div>
       <h2 className="text-2xl poppins-semibold mb-6">Capture Counter Photo (live)</h2>
 
      
         <div className="flex flex-wrap gap-2 mb-4">
           
           {coffeeImagePreview.map((image, index) => (
             <div key={index} className="relative">
               <img
                 src={image}
                 alt={`Hand Wash ${index + 1}`}
                 className="h-24 w-24 border rounded-md object-cover cursor-pointer"
                 onClick={() => handleCoffeeClick(image)}
               />
               <button
                 onClick={() => removeCoffeeImage(index)}
                 className="absolute top-0 right-0 text-red-500 hover:text-red-700"
               >
                 <XMarkIcon className="w-4 h-4" />
               </button>
             </div>
           ))}
           <div
             onClick={triggerCoffeeFileInput}
             className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
           >
             <PlusIcon className="w-8 h-8 text-gray-600" />
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
      
         <button
           onClick={handleCoffeeSubmit}
           className={`mt-4 w-full   text-center mx-auto py-2 rounded-md text-white ${isCoffeeSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
         >
           {isCoffeeSubmitted ? (
             <div className="flex items-center justify-center">
               <span>Submitted</span>
             </div>
           ) : (
             'Submit'
           )}
         </button>
    
       
 
         {previewCoffeeImage && (
           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
             <div className="relative bg-white p-4 rounded-lg">
               <img src={previewCoffeeImage} alt="Preview" className="max-h-96 max-w-full rounded" />
               <button
                 onClick={handleCloseCoffee}
                 className="absolute top-2 right-2 text-red-500 hover:text-red-700"
               >
                 <XMarkIcon className="w-6 h-6" />
               </button>
             </div>
           </div>
         )}
         {isCoffeeSubmitted && (
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
  </form>
   )
 }
 
 export default Coffee