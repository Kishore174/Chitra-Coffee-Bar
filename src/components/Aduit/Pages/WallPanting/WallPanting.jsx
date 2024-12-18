import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { createPainting, getPainting, getPrevious } from '../../../../API/audits';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../Loader';
import DateFormat from '../../../DateFormat';

export const WallPainting = () => {
  const [lastAudit, setLastAudit] = useState(null);

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
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAudits, setLastAudits] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleFanClick = (option) => setFan(option);
  const handleLightClick = (Light) => setLight(Light);
  const handleCellingClick = (Celling) => setCelling(Celling);
  const handleWallClick = (wall) => setWallPainting(wall);
  const handleFloorClick = (floor) => setFloorTail(floor);

  const handleRemarkChange = (e) => setRemark(e.target.value);
  const handleRatingClick = (rate) => setRating(rate);

  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [teaImagePreview, setTeaImagePreview] = useState([]);
  const [isTesSubmitted, setIsTeaSubmitted] = useState(false);
  const [previewTeaImage, setPreviewHandWashImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState( );


  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); // Set loading to true when submission starts

    try {
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
      const res = await createPainting(auditId, auditData,setUploadProgress);
      toast.success(res.message);
      navigate(-1)
      handleTeaSubmit()
      console.log("Submitted Data:", auditData);
    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false); // Reset loading state after submission
    }
    // console.log('Submitted Data:', auditData);
    // Here, you can also send the data to a server or perform further actions.
  };
  const validateForm = () => {
    if (!fan || !light || !celling || !wallPainting || !floorTail) {
      toast.error('Please select  all options.');
      return false;
    }
    if (!remark.trim()) {
      toast.error('Please provide a remark.');
      return false;
    }
    if (rating <= 0) {
      toast.error('Please provide a rating.');
      return false;
    }
    if (captureImages.length === 0) {
      toast.error('Please capture at least one image.');
      return false;
    }
    return true;
  };
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

  const handleTeaPhotoCapture = async (e) => {
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
          ctx.fillText(`Location: ${loc}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setTeaImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      setCaptureImages(prev => [...prev, file])
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
    setIsModalOpen(false);

    // Add your submission logic here
  };
  useEffect(() => {
    setLoading(true)

    getPainting(auditId)
      .then((res) => {
        if (res.data) {
          setTeaImagePreview(res.data?.captureImages.map(i => i.imageUrl))
          setFan(res.data?.fan)
          setDate(res.data?.captureImages.map(i => i.date)[0])
          setFloorTail(res.data?.floorTail)
          setLight(res.data?.light)
          setRating(res.data?.rating)
          setRemark(res.data?.remark)
          setCelling(res.data?.celling)
          setWallPainting(res.data?.wallPainting)
setIsTeaSubmitted(true)
        }
        setLoading(false)

      })
      .catch((err) => console.log(err.message));
  }, []);
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
    getPrevious(auditId).then(res => {
      setLastAudits(res.data);
    });
  };

  const handleOpenDialog = (data) => {
    setSelectedDate(data.auditDate);
    setDialogOpen(true);
    getPainting(data._id).then(res => {
      setLastAudit(res.data);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };
  return (
    <>
      {
        loading ? <Loader time={uploadProgress}/> : (
          <>
            <div className="flex items-center justify-between mx-auto   max-w-4xl">
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
                <AnimatePresence>
                  {isDialogOpen && (
                    <motion.div
                      className="fixed inset-0 flex z-50 mr-2 justify-end h-screen bg-black bg-opacity-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handleCloseDialog}
                    >
                      <motion.div
                        className="relative bg-white rounded-lg p-8 w-3/5 shadow-2xl overflow-auto transition-all duration-300 transform hover:scale-105"
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
                        <p className="text-gray-700 text-sm mb-6"><DateFormat date={selectedDate}></DateFormat></p>


                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                          {[
                            { label: 'Fan', value: lastAudit?.fan },
                            { label: 'Light', value: lastAudit?.light },
                            { label: 'celling', value: lastAudit?.celling },
                            { label: 'wallPainting', value: lastAudit?.wallPainting },
                            { label: ' floorTail', value: lastAudit?.floorTail },
                            { label: 'remark', value: lastAudit?.remark },

                            { label: 'rating', value: lastAudit?.rating }
                          ].map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                            >
                              <span className="text-sm font-medium  text-red-700 bg-red-100 px-3 py-1 rounded-full capitalize">
                                {item.label}
                              </span>
                              <span className="font-semibold text-gray-800 text-lg">{item.value || 'N/A'}</span>
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
            }} className="  max-w-4xl w-full space-x-1 mx-auto p-8">
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
                          className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white hover:text-white transition-colors duration-200"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div
              onClick={() => fileInputRef.current.click()}
                      className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
                    >
                      <PlusIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <input
                      type="file"
                      // accept="image/*"
                      ref={fileInputRef}
                      onChange={handleTeaPhotoCapture}
                      className="hidden"
                      multiple />
                  </div>
                </div>
  {/* Preview Image Modal */}
  {previewTeaImage && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white p-4 rounded-lg">
                      <img src={previewTeaImage} alt="Preview" className="max-h-96 max-w-full rounded" />
                      <button
                        onClick={handleCloseTea}
                        className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white  hover:text-black transition-colors duration-200"

                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
                {/* Submit Button */}
               { !isTesSubmitted && <button
                  type='submit'
                  className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isTesSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Submit
                </button>}
               
              


                {/* {isTesSubmitted && (
                  <div className="absolute -top-2 -right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 15.25 14c-.287-.065-.576-.13-.875-.193-3.186-.706-5.776-2.948-6.23-6.003-.086-.378-.143-.749-.237-1.127-.275-.764-.471-1.58-.895-2.261-.146-.25-.28-.483-.433-.724a4.482 4.482 0 0 1-.812 5.485z" />
                    </svg>
                  </div>
                )} */}
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
                          onClick={handleSubmit}
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
