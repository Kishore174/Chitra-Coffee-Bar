import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createLiveSnacks, getLiveSnack } from '../../../../API/liveSnack';
import toast from 'react-hot-toast';
import { getSnackBrand } from '../../../../API/settings';
import { getPrevious } from '../../../../API/audits';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../Loader';

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
  const [captureImages, setCaptureImages] = useState([]);
  const { auditId } = useParams();
  const [lastAudit, setLastAudit] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastAudits, setLastAudits] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const validateForm = () => {
    if (Object.keys(snackAvailability).length === 0) {
      toast.error("Please select snack availability.");
      return false;
    }
    if (remark.trim() === "") {
      toast.error("Please add a remark.");
      return false;
    }
    if (rating === 0) {
      toast.error("Please give a rating.");
      return false;
    }
    if (captureImages.length === 0) {
      toast.error("Please upload at least one image.");
      return false;
    }
    return true;
  };
  useEffect(() => {
    const fetchSnacks = async () => {
      setLoading(true)

      try {
        const response = await getSnackBrand();
        if (response.data) {
          setSnacksList(response.data);
        setLoading(false)

        }
      } catch (error) {
        setLoading(true)

        console.error('Error fetching snacks:', error);
      }
    };
    fetchSnacks();
  }, []);

  useEffect(() => {
    const fetchLiveSnack = async () => {
      setLoading(true)

      try {
        const res = await getLiveSnack(auditId);
        if (res.data) {

          const { snacks, remark, rating, captureImages } = res.data;
          setRemark(remark);
          setRating(rating);
          setLiveSnackImagePreview(captureImages.map(i => i.imageUrl));

          const availability = {};
          snacks.forEach(snack => {
            availability[snack.snack.name] = snack.status;
          });
          setIsLiveSnackSubmitted(true)
          setSnackAvailability(availability);
        setLoading(false)

        }
      } catch (err) {
        console.log(err);
        setLoading(true)

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
      setCaptureImages(prev => [...prev, file]);
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
    if (!validateForm()) return;
    setLoading(true); // Set loading to true when submission starts
    setDialogOpen(false)
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

      const res = await createLiveSnacks(auditId, formData);
      toast.success(res.message);
      setLoading(false)
      navigate(-1);
      console.log('Submitting data:', formData);
      setIsLiveSnackSubmitted(true);
    } catch (err) {
      console.log(err);
      toast.error('Submission failed');
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const handleCloseLiveSnack = () => {
    setPreviewLiveSnackImage(null);
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    getPrevious (auditId).then(res => {
      setLastAudits(res.data);
    });
  };

  const handleOpenDialog = (data) => {
    setSelectedDate(data .auditDate);
    setDialogOpen(true);
    getLiveSnack(data._id).then(res => {
      setLastAudit(res.data);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };

  const handleAvailability = (snackName, status) => {
    setSnackAvailability((prev) => ({
      ...prev,
      [snackName]: status,
    }));
  };

  return (
   <>{
    loading ?<Loader/>:(
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
          <AnimatePresence>
            {isDialogOpen && (
              <motion.div
                className="fixed inset-0 flex z-20 mr-2 justify-end h-screen bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDialog}
              >
                <motion.div
                  className="relative bg-white rounded-lg p-8 w-2/5 overflow-auto  first-letter: shadow-2xl transition-all duration-300 transform hover:scale-105"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-200 p-3 rounded-full bg-gray-100 hover:bg-red-100"
                    onClick={handleCloseDialog}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <h2 className="text-2xl font-semibold mb-6 text-red-600 border-b-2 border-red-600 pb-2">Audit Date</h2>
                  <p className="text-gray-700 text-sm mb-6">{selectedDate}</p>
                  <div className="grid gap-6">
                    {[
                      { label: 'Snacks', value: lastAudit?.snacks },
                      { label: 'Rating', value: lastAudit?.rating },
                      { label: 'Remark', value: lastAudit?.remark },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col  p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                      >
                        <span className="text-sm font-medium   text-red-700 bg-red-100 px-3 py-1 rounded-full capitalize">
                          {item.label}
                        </span>
                        {Array.isArray(item.value)? item.value.map((value,index)=>(
                          <div key={index} className=' flex flex-wrap mt-2'>
                            <div className=' flex justify-between  w-full'>
                              <span className="text-sm font-medium px-3 py-1 rounded-full capitalize">{value?.snack.name || 'N/A'}</span>
                              <span className=" text-red-700 p-1 poppins-regular px-3 bg-red-100 rounded-full capitalize text-sm">{value?.status || 'N/A'}</span>
                            </div>
                          </div>
                      ) ):
                        <span className="font-semibold text-gray-800 text-lg">{item.value || 'N/A'}</span>}
                      </div>
                    ))}
                  </div>
                  {lastAudit?.captureImages && lastAudit?.captureImages.length > 0 && (
                    <div className="">
                      <h3 className="text-lg font-medium text-red-600 mb-1">Captured Images</h3>
                      <div className="flex flex-wrap gap-4">
                        {lastAudit?.captureImages.map((image, index) => (
                          <div key={index} className="group relative w-24 h-24 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                            <img
                              src={image.imageUrl}
                              alt={`Captured Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {isPopupVisible && (
            <div className="absolute left-0 mt-2 w-44 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
              <ul>
                {lastAudits.map((date) => (
                  <li key={date._id} className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150"
                    onClick={() => handleOpenDialog(date)}
                  >
                    {date.auditDate.slice(0, 10)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }} className="w-full max-w-4xl mx-auto p-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {snacksList.map((snack) => (
              <div key={snack._id} className="flex flex-col text-left">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">{snack.name}</h2>
                <div className="flex space-x-4 mb-2">
                  {['available', 'not available'].map((status) => (
                    <div
                      key={status}
                      onClick={() => handleAvailability(snack.name, status)}
                      className={`cursor-pointer capitalize px-3 py-1 whitespace-nowrap rounded-full border transition-colors duration-200 hover:bg-red-600 hover:text-white ${
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
                    className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white hover:text-black transition-colors duration-200"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
             {
              !isLiveSnackSubmitted &&
              <>
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
              </>
             }
            </div>
          </div>

          {previewLiveSnackImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded-lg">
                <img src={previewLiveSnackImage} alt="Preview" className="max-h-96 max-w-full rounded" />
                  { !isLiveSnackSubmitted &&
                    <button
                    type="button"
                    onClick={handleCloseLiveSnack}
                    className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white hover:text-black transition-colors duration-200"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                  }
              </div>
            </div>
          )}

          {
            !isLiveSnackSubmitted &&
            <button
            type="submit"
            className={`bg-red-600 text-white font-medium py-2 w-full rounded-md shadow-lg hover:bg-red-700 transition duration-200`}
            disabled={isLiveSnackSubmitted} // Disable button when loading
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <span className="loader"></span> {/* Add a loader here */}
                <span className="ml-2">Submitting...</span>
              </div>
            ) : isLiveSnackSubmitted ? (
              <span className=" bg-green-700 text-white">✔ Submitted</span>
            ) : (
              'Submit Live Snack'
            )}
          </button>
          }
        </div>
      </form>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg poppins-semibold">Confirm Submission</h2>
            <p className="mt-2 poppins-medium text-md">Once submitted, you won’t be able to edit. Are you sure?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLiveSnackSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </>
    )
   }
   </>
  );
};

export default LiveSnacks;