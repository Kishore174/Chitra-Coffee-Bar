import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createCoffee } from '../../../../API/coffee';
import toast from 'react-hot-toast';
import axios from 'axios'; // Ensure you have axios installed
import { getSnackBrand } from '../../../../API/settings';
import { createLiveSnacks, getLiveSnack } from '../../../../API/liveSnack';

const LiveSnacks = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [snacksList, setSnacksList] = useState([]);
  const [snackAvailability, setSnackAvailability] = useState({});
  const [remark, setRemark] = useState('');
  const [liveSnackImagePreview, setLiveSnackImagePreview] = useState([]);
  const [previewLiveSnackImage, setPreviewLiveSnackImage] = useState(null);
  const [isLiveSnackSubmitted, setIsLiveSnackSubmitted] = useState(false);
  const liveSnackFileInputRef = useRef(null);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [captureImages,setCaptureImages] = useState([])
  const { auditId } = useParams();

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const response = await getSnackBrand()
        if (response.data) {
          setSnacksList(response.data);
          // Initialize snackAvailability state
          // const availability = {};
          // response.data.data.forEach(snack => {
          //   availability[snack.name] = null;
          // });
          // setSnackAvailability(availability);
        }
      } catch (error) {
        console.error('Error fetching snacks:', error);
        
      }
    };
    fetchSnacks();
  }, []);

  useEffect(() => {
    const fetchLiveSnack = async () => {
      try {
        const res = await getLiveSnack(auditId);
        if (res.data) {
          const { snacks, remark, rating, captureImages } = res.data;
          setRemark(remark);
          setRating(rating);
          setLiveSnackImagePreview(captureImages.map(i=>i.imageUrl));

          // Set snack availability based on the fetched data
          const availability = {};
          snacks.forEach(snack => {
            availability[snack.snack.name] = snack.status; // Assuming snack object has a name property
          });
          setSnackAvailability(availability);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchLiveSnack();
  }, [auditId]);


  const handleRatingClick = (rate) => setRating(rate);

  const handleLiveSnackPhotoCapture = async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = new Date().toLocaleString();

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

          ctx.drawImage(img, 0, 0);
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50);
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${loc}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          const watermarkedImage = canvas.toDataURL('image/png');
          setLiveSnackImagePreview((prev) => [...prev, watermarkedImage]);
          setPreviewLiveSnackImage(watermarkedImage);
        };
      };
      reader.readAsDataURL(file);
      setCaptureImages(prev=>[...prev,file])
    });

    e.target.value = null;
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve(
            `Lat: ${position.coords.latitude.toFixed(2)}, Long: ${position.coords.longitude.toFixed(2)}`
          ),
        () => resolve("Location unavailable")
      );
    });
  };

  const handleLiveSnackSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSnacks = Object.keys(snackAvailability).map(snack => ({
        snack: snacksList.find(item => item.name === snack)._id, 
        status: snackAvailability[snack]
      }));
  
      const formData = {
        snacks: formattedSnacks,
        remark,
        rating,
        captureImages: captureImages,
        location,
        date,
      };
      const res =  await createLiveSnacks(auditId,formData) 
      toast.success(res.message)

      navigate(-1);
      console.log('Submitting data:', formData);
      setIsLiveSnackSubmitted(true);
    } catch (err) {
      console.log(err);
      toast.error('Submission failed');
    }
  };

  const handleCloseLiveSnack = () => {
    setPreviewLiveSnackImage(null);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleAvailability = (snackName, status) => {
    setSnackAvailability((prev) => ({
      ...prev,
      [snackName]: status,
    }));
  };

  return (
    <>
      <div className="flex items-center justify-between mx-auto p-4 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 flex items-center space-x-1 hover:text-red-600 transition duration-200"
        >
          <MdArrowBack className="w-6 h-6" />
          <span className="text-xl font-semibold">Back</span>
        </button>
        <div className="relative">
          <button
            onClick={togglePopup}
            className="px-3 py-1 rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Previous Audit
          </button>

          {isPopupVisible && (
            <div className="absolute right-0 mt-2 w-56 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
              <ul className="space-y-2">
                {/* Replace with dynamic audit items if available */}
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

      <form onSubmit={handleLiveSnackSubmit} className="w-full max-w-4xl mx-auto p-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          {/* Snack Availability (Grid layout with dynamic snacks) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {snacksList.map((snack) => (
              <div key={snack._id} className="flex flex-col text-left">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{snack.name}</h2>
                <div className="flex space-x-4 mb-2">
                  {['available', 'not available'].map((status) => (
                    <div
                      key={status}
                      onClick={() => handleAvailability(snack.name, status)}
                      className={`cursor-pointer capitalize px-3 py-1 font-medium rounded-full border transition-colors duration-200 hover:bg-red-600 hover:text-white ${
                        snackAvailability[snack.name] === status
                          ? 'bg-red-600 text-white'
                          : 'bg-white text-gray-700 border-gray-300'
                      }`}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-col w-full">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Remark</h2>
              <textarea
                className="p-3 border w-full rounded-lg mt-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Add a remark for all snacks"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </div>
            <div className="flex-col w-full">
              <h2 className="text-lg font-medium text-gray-800 mb-2">Rating</h2>
              <div className="flex space-x-2 mt-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer text-3xl ${rating > index ? 'text-yellow-500' : 'text-gray-300'}`}
                    onClick={() => handleRatingClick(index + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Image Capture and Preview */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Capture Counter Photo (Live)</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              {liveSnackImagePreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Live Snack ${index + 1}`}
                    className="h-24 w-24 border rounded-md object-cover cursor-pointer"
                    onClick={() => setPreviewLiveSnackImage(image)}
                  />
                  <button
                    type="button"
                    onClick={() => setLiveSnackImagePreview((prev) => prev.filter((_, i) => i !== index))}
                    className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div
                onClick={() => liveSnackFileInputRef.current.click()}
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

          {/* Preview Image Modal */}
          {previewLiveSnackImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded-lg">
                <img src={previewLiveSnackImage} alt="Preview" className="max-h-96 max-w-full rounded" />
                <button
                  type="button"
                  onClick={handleCloseLiveSnack}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-red-600 text-white font-medium py-2 w-full rounded-md shadow-lg hover:bg-red-700 transition duration-200"
          >
            {isLiveSnackSubmitted ? (
              <span className="text-green-500">✔ Submitted</span>
            ) : (
              'Submit Live Snack'
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default LiveSnacks;
