import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import KitchenItem from './KitchenItem'; // Assuming KitchenItem is a reusable component
import { createInsideKitchen, createKitchenData, getInsideKitchen, getKitchenData, getPrevious } from '../../../../API/audits'; // Replace with actual API methods
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Loader from '../../../Loader';

const InsideKitchens = () => {
  const [kitchenData, setKitchenData] = useState({});
  const navigate = useNavigate();
  const { auditId } = useParams();
  const [lastAudits, setLastAudits] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastAudit, setLastAudit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isInsideKitchenSubmitted, setInsideKitchenSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleItemUpdate = (itemType, data) => {
    const { captureImages, ...otherData } = data;  
    setKitchenData((prevData) => ({
      ...prevData,
      [itemType]: otherData,
      [`${itemType}Images`]: captureImages,
      location: "unknown",
      date: "date",
    }));
  };

  const handleOverallSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);

    createInsideKitchen(auditId, kitchenData,setUploadProgress)
      .then((res) => {
        toast.success(res.message);
        navigate(-1);
    setInsideKitchenSubmitted(true)

      })
      .catch((error) => console.log(error));

    console.log("All Kitchen Data: ", kitchenData);
  };

  const itemTypes = [
    "snackMaking",
    "milkFreezer",
    "grinder",
    "sink",
    "workTable",
    "kitchenFloor",
    "exhaustFan",
    "kitchenLight",

  ];
  const validateForm = () => {
    for (const itemType of itemTypes) {
      const itemData = kitchenData[itemType];
      if (itemData) {
        // Check required fields for each item type
        if (!itemData.hygiene) {
          toast.error(`Please provide hygiene information for ${itemType.replace(/([A-Z])/g, " $1").trim()}.`);
          return false;
        }
        // if (!itemData.brandName) {
        //   toast.error(`Please provide a brand name for ${itemType.replace(/([A-Z])/g, " $1").trim()}.`);
        //   return false;
        // }
        if (!itemData.rating) {
          toast.error(`Please provide a rating for ${itemType.replace(/([A-Z])/g, " $1").trim()}.`);
          return false;
        }
        if (!itemData.remark) {
          toast.error(`Please provide a remark for ${itemType.replace(/([A-Z])/g, " $1").trim()}}.`);
          return false;
        }
        // Check if images are provided
        if (!kitchenData[`${itemType}Images`] || kitchenData[`${itemType}Images`].length === 0) {
          toast.error(`Please upload at least one image for ${itemType.replace(/([A-Z])/g, " $1").trim()}.`);
          return false;
        }
      }
    }
    return true;
  };

  useEffect(() => {
    setLoading(true);

    getInsideKitchen(auditId).then((res) => {
      setFetchData(res.data);

      setLoading(false);
      if(res.data&&Object.keys(res.data).length>0){
        setInsideKitchenSubmitted(true)
          }
      
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
    getInsideKitchen(data._id).then(res => {
      setLastAudit(res.data);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmSubmit = () => {
    handleOverallSubmit(); // Proceed with the submission
    setIsModalOpen(false); // Close the modal after submission
  };
  return (
  <>
  {
    loading? <Loader time={uploadProgress}/>:(
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

        <h2 className="text-2xl font-semibold mb-6 text-red-600 border-b-2 border-red-600 pb-2">Audit Details</h2>

        <div className="space-y-8">
          {lastAudit && Object.entries(lastAudit).map(([key, item]) => (
            <div key={key} className="space-y-4">
              <h3 className="text-lg font-semibold text-red-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Hygiene', value: item.hygiene },
                  { label: 'Brand Name', value: item.brandName },
                  { label: 'Rating', value: item.rating },
                  { label: 'Remark', value: item.remark },
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
                          className="w-full h-full object-cover transition-transform duration-300"
                        />
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
    <div className='poppins-regular max-w-7xl md:ml-24 mx-4'>
      
      <div className="flex flex-wrap justify-start mx-auto gap-5">
        {itemTypes.map((itemType) => (
          <KitchenItem
            key={itemType}
            title={itemType.charAt(0).toUpperCase() + itemType.slice(1)} // Capitalize the first letter
            itemType={itemType}
            onUpdate={handleItemUpdate}
            data={fetchData && fetchData[itemType]}
          />
        ))}
      </div>
      { !isInsideKitchenSubmitted && <button
        onClick={openModal}
        
        className='bg-red-500 text-white w-full sm:w-5/6 py-2 mx-auto flex items-center text-center mt-12 rounded-md hover:bg-red-600'
      >
        <span className='text-center mx-auto'>Submit All Data</span>
      </button>}
    </div>
    {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-lg font-semibold">Confirm Submission</h2>
                <p className="mt-2 text-md">Once submitted, you won’t be able to edit. Are you sure?</p>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSubmit}
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

export default InsideKitchens;