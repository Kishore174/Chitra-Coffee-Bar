import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import {   PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createPainting, getPainting } from '../../../../API/audits';
import toast from 'react-hot-toast';
export const WallPainting = () => {
  const [fan, setFan] = useState(null);
  const [light, setLight] = useState(null);
  const [celling, setCelling] = useState(null);
  const [wallPainting, setWallPainting] = useState(null);
  const [floorTail, setFloorTail] = useState(null);
  const [captureImages, setCaptureImages] = useState([]);
  const [remark, setRemark] = useState('');
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const { auditId } = useParams();

  const handleFanClick = (option) => setFan(option);
  const handleLightClick = ( Light ) => setLight( Light);
  const handleCellingClick = ( Celling) => setCelling( Celling);
  const handleWallClick = ( wall) => setWallPainting( wall);
  const handleFloorClick = ( floor) => setFloorTail( floor);
 
  const handleRemarkChange = (e) => setRemark(e.target.value);
  const handleRatingClick = (rate) => setRating(rate);

 

  
 const navigate = useNavigate()
  const handleSubmit =async (e) => {
    e.preventDefault();
    try{
    const auditData = {
      fan,
      light,
      celling,
      wallPainting,
      floorTail,
      remark,
      location,
      date,
      rating,
      captureImages,
   
    };
    const res = await createPainting(auditId, auditData);
    toast.success(res.message);
    navigate(-1)
    handleTeaSubmit()
    console.log("Submitted Data:", auditData);
  } catch (err) {
    console.log(err);
  }
    // console.log('Submitted Data:', auditData);
    // Here, you can also send the data to a server or perform further actions.
  };
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [teaImagePreview, setTeaImagePreview] = useState([]);
  const [isTesSubmitted, setIsTeaSubmitted] = useState(false);
  const [previewTeaImage, setPreviewHandWashImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const handWashFileInputRef = useRef(null);

  
  const triggerFanFileInput = () => {
    handWashFileInputRef.current.click();
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

  const handleTeaPhotoCapture =async (e) => {
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
          setTeaImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      setCaptureImages(prev=>[...prev,file])
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeTeaImage = (index) => {
    setTeaImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleHandWashClick = (image) => {
    setPreviewHandWashImage(image);
  };

  const handleCloseTea = () => {
    setPreviewHandWashImage(null);
  };

  const handleTeaSubmit = () => {
    setIsTeaSubmitted(true);
    // Add your submission logic here
  };
  useEffect(() => {
    getPainting(auditId)
      .then((res) => {
        if (res.data) {
          setTeaImagePreview(res.data?.captureImages .map(i=>i.imageUrl))
          setFan(res.data?.fan)
          setDate(res.data?.captureImages .map(i=>i.date)[0])
          setFloorTail(res.data?.floorTail)
          setLight(res.data?.light)
          setRating(res.data?.rating)
          setRemark(res.data?.remark)
          setCelling(res.data?.celling)
          setWallPainting(res.data?.wallPainting)

        }
      })
      .catch((err) => console.log(err.message));
  }, []);
  return (
    <><div className="flex items-center mb-6">
      <button onClick={() => navigate(-1)} className="text-gray-700 hover:text-red-600 transition duration-200">
        <MdArrowBack className="w-6 h-6" />
      </button>
      <h1 className="text-2xl poppins-semibold ml-4">Panting</h1>
    </div>
    <form onSubmit={handleSubmit} className="w-full space-x-1 mx-auto p-8">
        <div className="flex flex-col w-full bg-white p-6 rounded-lg shadow-md flex-grow">


          {/* Grid for sel
          ecting options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {/* Fan selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Fan</label>
              <div className="flex space-x-4">
                {['good', 'bad'].map((status) => (
                  <div
                    key={status}
                    onClick={() => handleFanClick(status)}
                    className={`cursor-pointer capitalize px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${status === fan ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {status}
                  </div>
                ))}
              </div>
            </div>

            {/* Light selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Light</label>
              <div className="flex space-x-4">
                {['good', 'bad'].map((Light) => (
                  <div
                    key={Light}
                    onClick={() => handleLightClick(Light)}
                    className={`cursor-pointer capitalize px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${light === Light ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {Light}
                  </div>
                ))}
              </div>
            </div>

            {/* Celling selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Celling</label>
              <div className="flex space-x-4">
                {['good', 'bad'].map((Celling) => (
                  <div
                    key={Celling}
                    onClick={() => handleCellingClick(Celling)}
                    className={`cursor-pointer capitalize px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${celling === Celling ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {Celling}
                  </div>
                ))}
              </div>
            </div>

            {/* Wall Panting selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Wall Panting</label>
              <div className="flex space-x-4">
                {['good', 'bad'].map((wall) => (
                  <div
                    key={wall}
                    onClick={() => handleWallClick(wall)}
                    className={`cursor-pointer capitalize px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${wallPainting === wall ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {wall}
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Tail selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Floor Tail</label>
              <div className="flex space-x-4">
                {['good', 'bad'].map((floor) => (
                  <div
                    key={floor}
                    onClick={() => handleFloorClick(floor)}
                    className={`cursor-pointer capitalize px-4 py-2 poppins-medium rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${floorTail === floor ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                  >
                    {floor}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remarks and Rating */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-col mt-6 w-full">
              <h2 className="text-lg poppins-semibold">Remark</h2>
              <textarea
                value={remark}
                onChange={handleRemarkChange}
                rows="4"
                className="mt-2 border rounded-lg p-2 w-full max-w-md transition-colors duration-200 hover:border-red-300 focus:border-red-500 focus:outline-none"
                placeholder="Add your remarks here..." />
            </div>
            <div className="flex-col mt-6 w-full">
              <h2 className="text-lg poppins-semibold">Rating</h2>
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

          {/* Image Capture Section */}
          <div className="mt-6">
            <h2 className="text-2xl poppins-semibold mb-6">Capture Counter Photo (live)</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {teaImagePreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Hand Wash ${index + 1}`}
                    className="h-24 w-24 border rounded-md object-cover cursor-pointer"
                    onClick={() => handleHandWashClick(image)} />
                  <button
                    onClick={() => removeTeaImage(index)}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div
                onClick={triggerFanFileInput}
                className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
              >
                <PlusIcon className="w-8 h-8 text-gray-600" />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={handWashFileInputRef}
                onChange={handleTeaPhotoCapture}
                className="hidden"
                multiple />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleTeaSubmit}
            className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isTesSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isTesSubmitted ? (
              <div className="flex items-center justify-center">
                <span>Submitted</span>
              </div>
            ) : (
              'Submit'
            )}
          </button>

          {/* Preview Image Modal */}
          {previewTeaImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded-lg">
                <img src={previewTeaImage} alt="Preview" className="max-h-96 max-w-full rounded" />
                <button
                  onClick={handleCloseTea}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}


          {isTesSubmitted && (
            <div className="absolute -top-2 -right-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 15.25 14c-.287-.065-.576-.13-.875-.193-3.186-.706-5.776-2.948-6.23-6.003-.086-.378-.143-.749-.237-1.127-.275-.764-.471-1.58-.895-2.261-.146-.25-.28-.483-.433-.724a4.482 4.482 0 0 1-.812 5.485z" />
              </svg>
            </div>
          )}
        </div>
      </form></>
  
  );
};
