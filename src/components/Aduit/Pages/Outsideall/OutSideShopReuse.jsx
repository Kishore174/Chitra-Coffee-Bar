import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';


const OutSideShopReuse = ({ title, itemType, onUpdate, data }) => {
    const [hygiene, setHygiene] = useState('');
    const [available, setAvailable] = useState('');
    const [remark, setRemark] = useState('');
    const [imagePreview, setImagePreview] = useState([]);
    const [rating, setRating] = useState(0);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const [captureImages, setCaptureImages] = useState([]);
  
    const handlePhotoCapture = async (e) => {
      const files = Array.from(e.target.files);
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const currentDate = new Date();
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
        const watermarkedImages = files.map(async (file) => {
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onloadend = () => {
              const img = new Image();
              img.src = reader.result;
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                ctx.font = '16px Arial';
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fillRect(10, img.height - 40, img.width - 20, 40);
                ctx.fillStyle = 'black';
                ctx.fillText(`Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`, 15, img.height - 25);
                ctx.fillText(`Date/Time: ${formattedDate}`, 15, img.height - 5);
                resolve(canvas.toDataURL());
              };
            };
            reader.readAsDataURL(file);
            setCaptureImages((prev) => [...prev, file]);
          });
        });
        Promise.all(watermarkedImages).then((result) => {
          setImagePreview((prev) => [...prev, ...result]);
        });
      });
    };
  
    const removeImage = (index) => {
      setImagePreview((prev) => prev.filter((_, i) => i !== index));
    };
  
    const handleUpdate = () => {
      const data = {
        hygiene,
        available,
        remark,
        rating,
        captureImages,
      };
      onUpdate(itemType, data);
    };
  
    useEffect(() => {
      handleUpdate();
    }, [hygiene, remark, imagePreview, rating]);
  
    const handleImageClick = (image) => {
      setPreviewImage(image);
    };
  
    const handleClosePreview = () => {
      setPreviewImage(null);
    };
  
    useEffect(() => {
      if (data) {
        setHygiene(data.hygiene);
        setImagePreview(data.captureImages.map((u) => u.imageUrl));
        setRating(data.rating);
        setRemark(data.remark);
        setAvailable(data.available);
      }
    }, [data]);
  return (
    <div className="border rounded-lg shadow-md p-4  h-auto w-full sm:w-2/5 md:w-[250px] justify-between flex flex-col">
    <h2 className="text-xl capitalize font-semibold mb-2">{title}</h2>
   
      <div className='mb-4'>
        <label className="text-sm font-medium text-gray-500 mb-2 block">Available</label>
        <div className="flex space-x-3 mb-2">
          {['yes', 'no'].map((option) => (
            <div
              key={option}
              onClick={() => setAvailable(option)}
              className={`cursor-pointer capitalize px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                ${available === option 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-700 hover:bg-green-600 hover:text-white'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
   
   { available !== "no" &&  <><div>
        <label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>
        <div className="flex space-x-4 mb-4">
          {['good', 'bad'].map((remark) => (
            <div
              key={remark}
              onClick={() => setHygiene(remark)}
              className={`cursor-pointer capitalize px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
              hover:bg-red-600 hover:text-white ${hygiene === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              {remark}
            </div>
          ))}
        </div>
      </div><div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">Rating</label>
          <div className="flex space-x-1 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div><div>
          <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>
          <textarea
            placeholder="Enter your remark..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="border rounded-md p-2 w-full mb-4" />
        </div><div className="flex flex-wrap gap-2 mb-4">
          {imagePreview.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="h-12 w-12 border rounded-md object-cover cursor-pointer"
                onClick={() => handleImageClick(image)} />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white  hover:text-black transition-colors duration-200"

              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div
            onClick={() => fileInputRef.current.click()}
            className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer"
          >
            <PlusIcon className="w-6 h-6 text-gray-500" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoCapture}
            className="hidden"
            multiple />
        </div></>}
    {previewImage && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative bg-white p-4 rounded-lg">
          <img src={previewImage} alt="Preview" className="max-h-96 max-w-full rounded" />
          <button
            onClick={handleClosePreview}
            className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white  hover:text-black transition-colors duration-200"

          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    )}
  </div>
  )
}

export default OutSideShopReuse