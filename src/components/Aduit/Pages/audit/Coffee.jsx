import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import {   PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createCoffee, getCoffee } from '../../../../API/coffee';
import toast from 'react-hot-toast';

 
 const Coffee = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedCoffee, setSelectedCoffe] = useState(null);
  const [selectedSugar, setSelectedSugar] = useState(null);
  const [selectedTemperature, setSelectedTemperature] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedAroma, setSelectedAroma] = useState(null);
  const [selectedTaste, setSelectedTaste] = useState(null);
  const [remark, setRemark] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [capturedPhoto, setCapturedPhoto] = useState([]);
  const [photoCount, setPhotoCount] = useState(0);
  const fileInputRef = useRef(null);
  const { auditId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coffeeImagePreview, setCoffeeImagePreview] = useState([]);
  const [isCoffeeSubmitted, setIsCoffeeSubmitted] = useState(false);
  const [previewCoffeeImage, setPreviewCoffeeImage] = useState(null);
   
  const coffeeFileInputRef = useRef(null);
  const handleCoffeeClick = (option) => setSelectedCoffe(option);
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
  const handleSubmit =async (e) => {
    e.preventDefault();
    try {

    const auditData = {
      quality: selectedCoffee,
      sugarLevel: selectedSugar,
      temperature: selectedTemperature,
      color: selectedColor,
      aroma: selectedAroma,
      taste: selectedTaste,
      date,
      location,
      remark,
      rating,
      captureImages: capturedPhoto,
    };
    const res = await createCoffee(auditId, auditData);
    toast.success(res.message);
    navigate(-1)
    handleCoffeeSubmit()
    console.log("Submitted Data:", auditData);
  } catch (err) {
    console.log(err);
  }

  // Here, you can also send the data to a server or perform further actions.
};


  
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

  const handleCoffeePhotoCapture = async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const loc = await getLocation();
    setLocation(loc);
    setDate(dateTime);
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
                setCoffeeImagePreview((prev) => [...prev, watermarkedImage]); // Ensure prev is an array
                setCapturedPhoto((prev) => [...prev, file]); // Ensure prev is an array
            };
        };
        reader.readAsDataURL(file);
    });
    
    e.target.value = null;
};

  const removeCoffeeImage = (index) => {
    setCoffeeImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleCoffeePreviewClick = (image) => {
    setPreviewCoffeeImage(image);
  };

  const handleCloseCoffee = () => {
    setPreviewCoffeeImage(null);
  };

  const handleCoffeeSubmit = () => {
    setIsCoffeeSubmitted(true);
    // Add your submission logic here
  };
  useEffect(() => {
    getCoffee(auditId)
      .then((res) => {
        if (res.data) {
          setSelectedCoffe(res?.data?.quality);
          setSelectedSugar(res?.data?.sugarLevel);
          setSelectedAroma(res?.data?.aroma);
          setSelectedColor(res?.data?.color);
          setSelectedTaste(res?.data?.taste);
          setSelectedTemperature(res?.data?.temperature);
          setRemark(res?.data?.remark);
          setRating(res?.data?.rating);
          setCoffeeImagePreview(
            res?.data?.captureImages?.map((img) => img.imageUrl)
          );
          setLocation(res?.data?.captureImages[0]?.location)
          setDate(res?.data?.captureImages[0]?.date)
          setIsCoffeeSubmitted(true)
        }
      })
      .catch((err) => console.log(err.message));
  }, []);
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };
   return (
    <>
    <div className="flex items-center justify-between mx-auto p-4  max-w-4xl">
       <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
         <MdArrowBack className="w-6 h-6 mt-1" />
       <h1 className="text-xl md:text-xl font-semibold  ">Back</h1>

       </button>
       <div className="relative">
    
      <button
        onClick={togglePopup}
        className="px-3 py-1 rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        Previous Audit
      </button>

      
      {isPopupVisible && (
  <div className="absolute left-0 mt-2 w-56 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
    <ul className="space-y-2">
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>

      {/* Add more items here */}
    </ul>
  </div>
)}
    </div>
       </div>
     <form  onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true)
        }} className="w-full max-w-4xl mx-auto p-4 md:p-8">
         <div className="flex flex-col w-full bg-white p-4 md:p-6 rounded-lg shadow-md">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

             {/* Coffee Selection */}
             <div className="flex flex-col">
               <h2 className="text-lg font-semibold mb-2">Coffee</h2>
               <div className="flex space-x-2">
                 {['good', 'bad', 'hot'].map((coffee) => (
                   <div
                     key={coffee}
                     onClick={() => handleCoffeeClick(coffee)}
                     className={`cursor-pointer capitalize px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${selectedCoffee === coffee ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                   >
                     {coffee}
                   </div>
                 ))}
               </div>
             </div>

             {/* Sugar Selection */}
             <div className="flex flex-col">
               <h2 className="text-lg font-semibold mb-2">Sugar Level</h2>
               <div className="flex space-x-2">
                 {['high', 'low', 'perfect'].map((sugar) => (
                   <div
                     key={sugar}
                     onClick={() => handleSugarClick(sugar)}
                     className={`cursor-pointer capitalize px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${selectedSugar === sugar ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                   >
                     {sugar}
                   </div>
                 ))}
               </div>
             </div>

             {/* Temperature Selection */}
             <div className="flex flex-col">
               <h2 className="text-lg font-semibold mb-2">Temperature</h2>
               <div className="flex space-x-2">
                 {['hot', 'warm', 'cold'].map((temperature) => (
                   <div
                     key={temperature}
                     onClick={() => handleTemperatureClick(temperature)}
                     className={`cursor-pointer capitalize px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${selectedTemperature === temperature ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                   >
                     {temperature}
                   </div>
                 ))}
               </div>
             </div>

             {/* Coffee Color Selection */}
             <div className="flex flex-col">
               <h2 className="text-lg font-semibold mb-2">Coffee Color</h2>
               <div className="flex space-x-2">
                 {['light', 'perfect', 'dark'].map((color) => (
                   <div
                     key={color}
                     onClick={() => handleColorClick(color)}
                     className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border transition-colors duration-200 ${selectedColor === color ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                   >
                     {color}
                   </div>
                 ))}
               </div>
             </div>

             {/* Aroma Selection */}
             <div className="flex flex-col">
               <h2 className="text-lg font-semibold mb-2">Aroma</h2>
               <div className="flex space-x-2">
                 {['excellent', 'bad'].map((aroma) => (
                   <div
                     key={aroma}
                     onClick={() => handleAromaClick(aroma)}
                     className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border transition-colors duration-200 ${selectedAroma === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                   >
                     {aroma}
                   </div>
                 ))}
               </div>
             </div>

             {/* Taste Selection */}
             <div className="flex flex-col">
               <h2 className="text-lg font-semibold mb-2">Taste</h2>
               <div className="flex space-x-2">
                 {['excellent', 'bad'].map((taste) => (
                   <div
                     key={taste}
                     onClick={() => handleTasteClick(taste)}
                     className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border transition-colors duration-200 ${selectedTaste === taste ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                   >
                     {taste}
                   </div>
                 ))}
               </div>
             </div>

            
           </div>
           <div className="flex flex-col sm:flex-row  w-full gap-4 mt-6">
             <div className="flex-col w-full">

               <h2 className="text-lg font-semibold mb-2">Remark</h2>
               <textarea
                 value={remark}
                 onChange={handleRemarkChange}
                 rows="4"
                 className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                 placeholder="Add your remarks here..." />
             </div>

             {/* Rating */}
             <div className="flex-col w-full">

               <h2 className="text-lg font-semibold mb-2">Rating</h2>
               <div className="flex space-x-1">
                 {[...Array(5)].map((_, index) => (
                   <span
                     key={index}
                     onClick={() => handleRatingClick(index + 1)}
                     className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-500' : 'text-gray-300'}`}
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
                    onClick={() => handleCoffeePreviewClick(image)}

                     className="h-24 w-24 rounded-md border object-cover" />
                   <button
                     onClick={() => removeCoffeeImage(index)}
                    
                     className="absolute top-0 right-0 text-red-500"
                   >
                     <XMarkIcon className="w-5 h-5" />
                   </button>
                 </div>
               ))}
               <div
                 onClick={triggerCoffeeFileInput}
                 className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
               >
                 <PlusIcon className="w-6 h-6 text-gray-600" />
               </div>
               <input
                 type="file"
                 accept="image/*"
                 ref={coffeeFileInputRef}
                 onChange={handleCoffeePhotoCapture}
                 className="hidden"
                 multiple />
             </div>
           </div>
           {previewCoffeeImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded-lg">
                <img
                  src={previewCoffeeImage}
                  alt="Preview"
                  className="max-h-96 max-w-full rounded"
                />
                <button
                  onClick={handleCloseCoffee}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
           {/* Submit Button */}
           <button
             type="submit"
             className={`mt-6 w-full py-2 rounded-md text-white ${isCoffeeSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
           >
             {isCoffeeSubmitted ? 'Submitted' : 'Submit'}
           </button>
         </div>
       </form>
       {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg poppins-semibold">Confirm Submission</h2>
            <p className="mt-2 poppins-medium                                                                                                       text-md">Once submitted, you won’t be able to edit. Are you sure?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}

                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}</>
  

   )
 }
 
 export default Coffee