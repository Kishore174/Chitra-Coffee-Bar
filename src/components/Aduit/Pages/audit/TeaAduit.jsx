import React, { useState, useRef, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { createTea, getTea } from "../../../../API/tea";
import toast from "react-hot-toast";
import { getPrevious } from "../../../../API/audits";
import { motion, AnimatePresence } from 'framer-motion';
import Loader from "../../../Loader";
import DateFormat from "../../../DateFormat";

const TeaAudit = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedTea, setSelectedTea] = useState(null);
  const [selectedSugar, setSelectedSugar] = useState(null);
  const [selectedTemperature, setSelectedTemperature] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedAroma, setSelectedAroma] = useState(null);
  const [selectedTaste, setSelectedTaste] = useState(null);
  const [remark, setRemark] = useState("");
  const [location, setLocation]=useState('')
  const [date, setDate] = useState("");
  const [lastAudit, setLastAudit] = useState(null);
  const [rating, setRating] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState([]);
  const [teaImagePreview, setTeaImagePreview] = useState([]);
  const [isTesSubmitted, setIsTeaSubmitted] = useState(false);
  const [previewTeaImage, setPreviewHandWashImage] = useState(null);
  const { auditId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAudits, setLastAudits] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleTeaClick = (option) => setSelectedTea(option);
  const handleSugarClick = (level) => setSelectedSugar(level);
  const handleTemperatureClick = (temperature) => setSelectedTemperature(temperature);
  const handleColorClick = (color) => setSelectedColor(color);
  const handleAromaClick = (aroma) => setSelectedAroma(aroma);
  const handleTasteClick = (taste) => setSelectedTaste(taste);
  const handleRemarkChange = (e) => setRemark(e.target.value);
  const handleRatingClick = (rate) => setRating(rate);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading to true when submission starts

    try {
      const auditData = {
        quality: selectedTea,
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
      const res = await createTea(auditId, auditData);
      toast.success(res.message);
      navigate(-1);
      handleTeaSubmit();
      console.log("Submitted Data:", auditData);
    } catch (err) {
      console.log(err);
      toast.error("Submission failed. Please try again."); // Show error message
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  const fileInputRef = useRef(null);
  const handWashFileInputRef = useRef(null);

  const triggerTeaFileInput = () => {
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
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = "16px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = "black";
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${date}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL("image/png");
          setTeaImagePreview((prev) => [... prev, watermarkedImage]);
          setCapturedPhoto((prev) => [...prev, file]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeTeaImage = (index) => {
    setTeaImagePreview((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
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
  };

  useEffect(() => {
    setLoading(true)
    getTea(auditId)
      .then((res) => {
        if (res.data) {
          setSelectedTea(res?.data?.quality);
          setSelectedSugar(res?.data?.sugarLevel);
          setSelectedAroma(res?.data?.aroma);
          setSelectedColor(res?.data?.color);
          setSelectedTaste(res?.data?.taste);
          setSelectedTemperature(res?.data?.temperature);
          setRemark(res?.data?.remark);
          setRating(res?.data?.rating);
          setTeaImagePreview(
            res?.data?.captureImages?.map((img) => img.imageUrl)
          );
          setLocation(res?.data?.captureImages[0]?.location);
          setDate(res?.data?.captureImages[0]?.date);
          setIsTeaSubmitted(true);
          setLoading(false)
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
    getTea(data._id).then(res => {
      setLastAudit(res.data);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };

  return (
   <>{
    loading ? <Loader/> :
    (
      <>
      <div className="flex items-center justify-between mx-auto p-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
          <MdArrowBack className="w-6 h-6 mt-1" />
          <h1 className="text-xl md:text-xl font-semibold">Back</h1>
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
                  className="relative bg-white rounded-lg p-8 w-2/5 shadow-2xl transition-all duration-300 transform hover:scale-105"
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
                      { label: 'Aroma', value: lastAudit?.aroma },
                      { label: 'Color', value: lastAudit?.color },
                      { label: 'Quality', value: lastAudit?.quality },
                      { label: 'Rating', value: lastAudit?.rating },
                      { label: ' Remark', value: lastAudit?.remark },
                      { label: 'Sugar Level', value: lastAudit?.sugarLevel },
                      { label: 'Taste', value: lastAudit?.taste },
                      { label: 'Temperature', value: lastAudit?.temperature }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                      >
                        <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full capitalize">
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(true);
        }}
        className="w-full max-w-4xl mx-auto p-4 md:p-8"
      >
        <div className="flex flex-col bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl poppins-medium ml-3 md:ml-4">
              Tea Audit
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Tea selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Tea</label>
              <div className="flex space-x-2 sm:space-x-4">
                {["good", "bad"].map((tea) => (
                  <div
                    key={tea}
                    onClick={() => handleTeaClick(tea)}
                    className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedTea === tea
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {tea}
                  </div>
                ))}
              </div>
            </div>

            {/* Sugar selection */}
            <div>
              <label className="text-lg poppins-medium pb-5 mr-4">Sugar Level</label>
              <div className="flex space-x-2 sm:space-x-4">
                {["high", "low", "perfect"].map((sugar) => (
                  <div
                    key={sugar}
                    onClick={() => handleSugarClick(sugar)}
                    className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedSugar === sugar
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {sugar}
                  </div>
                ))}
              </div>
            </div>

            {/* Temperature selection */}
            <div>
              <label className="text-lg poppins-semibold mr-4">Temperature</label>
              <div className="flex space-x-2 sm:space-x-4">
                {["hot", "warm", "cold"].map((temperature) => (
                  <div
                    key={temperature}
                    onClick={() => handleTemperatureClick(temperature)}
                    className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedTemperature === temperature
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {temperature}
                  </div>
                ))}
              </div>
            </div>

            {/* Tea color selection */}
            <div>
              <label className="text-lg poppins-medium mr-4">Tea Color</label>
              <div className="flex space-x-2 sm:space-x-4">
                {["light", "perfect", "dark"].map((color) => (
                  <div
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedColor === color
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {color}
                  </div>
                ))}
              </div>
            </div>

            {/* Aroma selection */}
            <div>
              <label className="text-lg poppins-medium mr-4">Aroma</label>
              <div className="flex space-x-2 sm:space-x-4">
                {["excellent", "bad"].map((aroma) => (
                  <div
                    key={aroma}
                    onClick={() => handleAromaClick(aroma)}
                    className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedAroma === aroma
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {aroma}
                  </div>
                ))}
              </div>
            </div>

            {/* Taste selection */}
            <div>
              <label className="text-lg poppins-medium mr-4">Taste</label>
              <div className="flex space-x-2 sm:space-x-4">
                {["excellent", "bad"].map((taste) => (
                  <div
                    key={taste}
                    onClick={() => handleTasteClick(taste)}
                    className={`cursor-pointer capitalize px-3 py-1 mt-2 rounded-full border flex items-center justify-center transition-colors duration-200 hover:bg-red-600 hover:text-white ${selectedTaste === taste
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                      }`}
                  >
                    {taste}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Remark and Rating */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-col w-full">
              <h2 className="text-lg poppins-medium">Remark</h2>
              <textarea
                value={remark}
                onChange={handleRemarkChange}
                rows="4"
                className="mt-2 border rounded-lg p-2 w-full transition-colors duration-200 hover:border-red-300 focus:border-red-500 focus:outline-none"
                placeholder="Add your remarks here..."
              />
            </div>

            {/* Star rating */}
            <div className="flex-col w-full">
              <h2 className="text-lg poppins-medium">Rating</h2>
              <div className="flex space-x-1 mt-2">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer text-2xl ${rating > index ? "text-yellow-500" : "text-gray-300"
                      }`}
                    onClick={() => handleRatingClick(index + 1)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Capture Counter Photo */}
          <div className="mt-6">
            <h2 className="text-xl poppins-medium mb-4">
              Capture Counter Photo (live)
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {teaImagePreview.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Hand Wash ${index + 1}`}
                    className="h-24 w-24 border rounded-md object-cover cursor-pointer"
                    onClick={() => handleHandWashClick(image)}
                  />
                  <button
                    onClick={() => removeTeaImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white hover:text-black transition-colors duration-200"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div
                onClick={triggerTeaFileInput}
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
                multiple
              />
            </div>
          </div>
          {previewTeaImage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="relative bg-white p-4 rounded-lg">
                <img
                  src={previewTeaImage}
                  alt="Preview"
                  className="max-h-96 max-w-full rounded"
                />
                <button
                  onClick={handleCloseTea}
                  className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white hover:text-black transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
      { !isTesSubmitted &&    <button
            disabled={isTesSubmitted || loading} // Disable button if already submitted or loading
            className={`mt-4 w-full text-center py-2 rounded-md text-white ${isTesSubmitted || loading ? "bg-green-600" : "bg-red-600 hover:bg-red-700"
              } `}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <span className="loader"></span> {/* Add a loader here */}
                <span className="ml-2">Submitting...</span>
              </div>
            ) : isTesSubmitted ? (
              <div className="flex items-center justify-center">
                <span>Submitted</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>}
        </div>
      </form>
      {isModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50">
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

export default TeaAudit;