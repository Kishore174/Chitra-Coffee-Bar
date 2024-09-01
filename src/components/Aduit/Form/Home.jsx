import React, { useState } from 'react';
import { FaCamera } from 'react-icons/fa';
import ReactStars from 'react-rating-stars-component';

const Home = () => {
  const [capturedImages, setCapturedImages] = useState([]);
  const [imageData, setImageData] = useState({});
  const [formData, setFormData] = useState({
    coffeeTaste: { rating: 0, stock: '', remark: '' },
    samosaTaste: { rating: 0, stock: '', remark: '' },
    bajjiTaste: { rating: 0, stock: '', remark: '' },
    others: { rating: 0, stock: '', remark: '' },
    milkBrand: { rating: 0, stock: '', remark: '' },
    iceCreamBrand: { rating: 0, stock: '', remark: '' },
  });

  const handleFileChange = async (event, title) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageSrc = reader.result;
        const location = await getLocation();
        const dateTime = new Date().toLocaleString();
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          ctx.font = '20px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(`Date: ${dateTime}`, 10, img.height - 60);
          ctx.fillText(`Location: ${location}`, 10, img.height - 30);
          const dataUrl = canvas.toDataURL();
          setCapturedImages(prevImages => [...prevImages, dataUrl]);
          setImageData(prevData => ({ ...prevData, [title]: { imageSrc, dataUrl, location, dateTime } }));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`);
        },
        () => reject('Unable to retrieve location')
      );
    });
  };

  const handleRatingChange = (category, newRating) => {
    setFormData(prevData => ({
      ...prevData,
      [category]: { ...prevData[category], rating: newRating }
    }));
  };

  const handleChange = (category, e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [category]: { ...prevData[category], [name]: value }
    }));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-50 min-h-screen">
      {/* Image Capture Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {['Shop Front Photo', 'Selfie Photo Shop', 'Counter', 'Kitchen'].map((title) => (
          <div
            key={title}
            className="border rounded-lg p-4 bg-white shadow-lg flex flex-col items-center justify-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
            <label htmlFor={`camera-${title}`} className="cursor-pointer flex items-center">
              <FaCamera size={40} className="text-gray-600 hover:text-blue-600" />
              <input
                id={`camera-${title}`}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => handleFileChange(event, title)}
                className="hidden"
              />
            </label>
            {imageData[title] && (
              <div className="mt-4">
                <img src={imageData[title].dataUrl} alt="Captured" className="w-full h-auto rounded-lg shadow-md" />
                <p className="text-xs sm:text-sm text-gray-600 mt-2">Date & Time: {imageData[title].dateTime}</p>
                <p className="text-xs sm:text-sm text-gray-600">Location: {imageData[title].location}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ratings and Details Section */}
      <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Ratings and Details</h3>
        <div className="space-y-4">
          {[
            'coffeeTaste',
            'samosaTaste',
            'bajjiTaste',
            'others',
            'milkBrand',
            'iceCreamBrand'
          ].map(category => (
            <div key={category} className="border rounded-lg p-4 bg-gray-100 shadow-md">
              <h4 className="text-md font-semibold text-gray-800 mb-4 capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
              <div className="flex flex-col mb-4">
                <label className="text-gray-600 mb-2">Rating:</label>
                <ReactStars
                  count={5}
                  value={formData[category].rating}
                  onChange={(newRating) => handleRatingChange(category, newRating)}
                  size={24}
                  activeColor="#ffd700"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-gray-600 mb-2">Stock Available (Liters):</label>
                <input
                  type="number"
                  name="stock"
                  value={formData[category].stock}
                  onChange={(e) => handleChange(category, e)}
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 mb-2">Remark:</label>
                <textarea
                  name="remark"
                  value={formData[category].remark}
                  onChange={(e) => handleChange(category, e)}
                  className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
