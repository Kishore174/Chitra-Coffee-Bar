import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import InsideShopReuse from "./InsideShopReuse";
import { createInsideshop, getInsideShop, getPrevious } from "../../../../API/audits";
import toast from "react-hot-toast";
import Loader from "../../../Loader";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';
import DateFormat from "../../../DateFormat";

const InsideShop = () => {
  const [insideShopData, setInsideShopData] = useState({});
  const navigate = useNavigate();
  const { auditId } = useParams();
  const [fetchData, setFetchData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [lastAudits, setLastAudits] = useState([]);
  const [lastAudit, setLastAudit] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleItemUpdate = (itemType, data) => {
    const { captureImages, ...otherData } = data;
    setInsideShopData((prevData) => ({
      ...prevData,
      [itemType]: otherData,
      [`${itemType}Images`]: captureImages,
      location: "unknown",
      date: "date",
    }));
  };

  const handleOverallSubmit = () => {
    setLoading(true)
    createInsideshop(auditId, insideShopData)
      .then((res) => {
        toast.success(res.message);
        navigate(-1);
      })
      .catch((error) => console.log(error));

    console.log("All Kitchen Data: ", insideShopData);
  };

  const itemTypes = [
    "teaCounter",
    "dining",
    "liveSnackDisplay",
    "hotCounter",
    "normalCounter",
    "frontView",
    "iceCreamCounter",
    "handWash",
    "juiceBar",
    "snackCounter",
    "dustbin",
  ];

  useEffect(() => {
    setLoading(true)

    getInsideShop(auditId).then((res) => {setFetchData(res.data)
      setLoading(false)

    }
  );

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
    getInsideShop(data._id).then(res => {
      setLastAudit(res.data);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };
  return (
  <>
  {loading ?<Loader/>:(
     <>
     <div className="flex items-center justify-between md:ml-24 mx-4 mb-2 max-w-7xl">
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
      className="fixed inset-0 flex z-20 mr-2 justify-end h-screen bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleCloseDialog}
    >
      <motion.div
        className="relative bg-white rounded-lg p-6 sm:p-8  w-2/5  overflow-auto  shadow-2xl transition-all duration-300 transform hover:scale-105"
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
        <p className="text-gray-700 text-sm mb-6"><DateFormat date={selectedDate}/></p>

        <div className="space-y-8">
          {lastAudit && Object.entries(lastAudit).map(([key, item]) => (
            <div key={key} className="space-y-4">
              <h3 className="text-lg font-semibold text-red-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Hygiene', value: item.hygiene },
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
            <div className="absolute -left-5 mt-2 w-44 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
              <ul>
                {lastAudits.map((date) => (
                  <li key={date._id} className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150"
                    onClick={() => handleOpenDialog(date)}
                  >
                  <DateFormat date={date.auditDate}/>
                  </li>
                ))}
              </ul>
            </div>
          )}
       </div>
     </div>
     <div className="poppins-regular max-w-7xl md:ml-24 mx-4">
 
         <div className="flex flex-wrap  justify-start mx-auto gap-5">
           {itemTypes.map((itemType) => (
             <InsideShopReuse
               key={itemType}
               title={itemType.replace(/([A-Z])/g, " $1").trim()}
               itemType={itemType}
               onUpdate={handleItemUpdate}
               data={fetchData && fetchData[itemType]} />
           ))}
         </div>
        <button
           onClick={handleOverallSubmit}
           className="bg-red-500 text-white w-full sm:w-5/6 py-2 mx-auto flex items-center text-center mt-12 rounded-md hover:bg-red-600"
         >
           <span className="text-center mx-auto">Submit All Data</span>
         </button>
       </div></>
  )}
  </> 
  );
};

export default InsideShop;