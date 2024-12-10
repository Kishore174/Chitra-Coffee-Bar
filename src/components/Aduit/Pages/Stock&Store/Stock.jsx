import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom'; 
import { createStock, getPrevious, getStock } from '../../../../API/audits';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../../Loader';
import DateFormat from '../../../DateFormat';
import { MdArrowBack } from 'react-icons/md';
const Stock = () => {
  const [bakshanamImagePreview, setBakshanamImagePreview] = useState([]);
  const [previewBakshanamImage, setPreviewBakshanamImage] = useState(null);
  const [captureImages, setCaptureImages] = useState([]);
  const { auditId } = useParams();
  const [remark, setRemark] = useState('');
  const bakshanamFileInputRef = useRef(null);
  const navigate = useNavigate();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [lastAudits, setLastAudits] = useState([]);
const [isDialogOpen, setDialogOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState(null);
const [lastAudit, setLastAudit] = useState(null);
const [loading, setLoading] = useState(false); 

  const triggerBakshanamFileInput = () => {
    bakshanamFileInputRef.current.click();
  };

  const handleBakshanamPhotoCapture = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + bakshanamImagePreview.length > 4) {
      alert('You can only upload up to 4 images.');
      return;
    }

    const newImages = files.map((file) => URL.createObjectURL(file));
    setBakshanamImagePreview((prev) => [...prev, ...newImages]);
    setCaptureImages((prev) => [...prev, ...files]);
  };

  const handleCloseBakshanam = () => {
    setPreviewBakshanamImage(null);
  };

  const handleBakshanamClick = (image) => {
    setPreviewBakshanamImage(image);
  };

  const removeBakshanamImage = (index) => {
    setBakshanamImagePreview((prev) => prev.filter((_, i) => i !== index));
    setCaptureImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setLoading(true)

    createStock(auditId, { remark, captureImages, location: "unknown", date: "unknown" })
      .then(res => {
        toast.success(res.message);
        navigate(-1);
      });
  };

  useEffect(() => {
    setLoading(true)

    getStock(auditId).then(res => {
      setRemark(res.data?.remark);
      setBakshanamImagePreview(res.data?.captureImages?.map(i => i.imageUrl)
    );
    setLoading(false)

    });
  }, [auditId]);
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);

      getPrevious(auditId).then(res => {
        setLastAudits(res.data);
      });
    };
    const handleOpenDialog = (data) => {
      setSelectedDate(data.auditDate);
      setDialogOpen(true);
      getStock(data._id).then(res => {
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
      loading?<Loader/>:(
        <><div className="flex items-center justify-between md:ml-24 mx-4 mb-2 max-w-7xl">
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
                      className="relative bg-white rounded-lg p-6 sm:p-8  w-3/5  overflow-auto  shadow-2xl transition-all duration-300 transform hover:scale-105"
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
                      <p className="text-gray-700 text-sm mb-6"><DateFormat date={selectedDate} /></p>

                      <div className="space-y-8">
                        {lastAudit && Object.entries(lastAudit).map(([key, item]) => (
                          <div key={key} className="space-y-4">
                            <h3 className="text-lg font-semibold text-red-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {[ { label: 'Remark', value: item?.remark },
                              ].map((info, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                                >
                                  <span className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full capitalize">
                                    {info.label}
                                  </span>
                                  <span className="font-semibold text-gray-800 text-lg">{info.value}</span>
                                </div>
                              ))}
                              <p></p>
                            </div>

                            {item.captureImages && item.captureImages.length > 0 && (
                              <div>
                                <h4 className="text-md font-medium text-red-600 mb-2">Captured Images</h4>
                                <div className="flex flex-wrap gap-4">
                                  {item.captureImages.map((image, index) => (
                                    <div key={index} className="group relative w-24 h-24 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                                      <img
                                        src={image.imageUrl}
                                        alt={`Captured Image ${index + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-300" />
                                      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isPopupVisible && (
                <div className="absolute -left-5 mt-2 w-44 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
                  <ul>
                    {lastAudits.map((date) => (
                      <li key={date._id} className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150"
                        onClick={() => handleOpenDialog(date)}
                      >
                        <DateFormat date={date.auditDate} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="p-6 flex justify-center">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-lg w-full max-w-md space-y-6">
                <h3 className="text-xl font-semibold text-center text-gray-800">Stock/Store</h3>

                {/* Upload Button */}
                <div
                  onClick={triggerBakshanamFileInput}
                  className="h-12 w-12 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-300"
                >
                  <PlusIcon className="w-8 h-8 text-gray-600" />
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={bakshanamFileInputRef}
                  onChange={handleBakshanamPhotoCapture}
                  className="hidden"
                  multiple />

                {/* Uploaded Image Previews with Remove Button */}
                <div className="flex flex-wrap gap-2 mb-4">

                  {bakshanamImagePreview.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Bakshanam ${index + 1}`}
                        className="h-24 w-24 border rounded-md object-cover shadow-sm hover:shadow-md transition-shadow duration -200 cursor-pointer"
                        onClick={() => handleBakshanamClick(image)} />
                      <button
                        onClick={() => removeBakshanamImage(index)}
                        className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white hover:text-white transition-colors duration-200"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold">Remark</h3>
                <textarea
                  placeholder="Add a remark..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200" />

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full h-12 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
                >
                  Submit
                </button>

                {/* Image Preview Modal */}
                {previewBakshanamImage && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
                    <div className="relative bg-white p-4 rounded-lg shadow-lg">
                      <img src={previewBakshanamImage} alt="Preview" className="max-h-96 max-w-full rounded-md" />
                      <button
                        onClick={handleCloseBakshanam}
                        className="absolute top-2 right-2 p-1 bg-white border border-gray-300 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors duration-200"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div></>
      )
    }
    </>
  );
};

export default Stock;