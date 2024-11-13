import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import KitchenItem from './KitchenItem'; // Assuming KitchenItem is a reusable component
import { createInsideKitchen, createKitchenData, getInsideKitchen, getKitchenData } from '../../../../API/audits'; // Replace with actual API methods
import toast from 'react-hot-toast';

const InsideKitchens = () => {
  const [kitchenData, setKitchenData] = useState({});
  const navigate = useNavigate();
  const { auditId } = useParams();
  const [fetchData, setFetchData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
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
    createInsideKitchen(auditId, kitchenData)
      .then((res) => {
        toast.success(res.message);
        navigate(-1);
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

  useEffect(() => {
    getInsideKitchen(auditId).then((res) => setFetchData(res.data));
  }, [auditId]);
  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
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

      
      {isPopupVisible && (
  <div className="absolute left-0 mt-2 w-56 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
    <ul className="space-y-2">
      {/* <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li>
      <li className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150">{date}</li> */}

      {/* Add more items here */}
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
      <button
        onClick={handleOverallSubmit}
        
        className='bg-red-500 text-white w-full sm:w-5/6 py-2 mx-auto flex items-center text-center mt-12 rounded-md hover:bg-red-600'
      >
        <span className='text-center mx-auto'>Submit All Data</span>
      </button>
    </div>
    
    </>
  );
};

export default InsideKitchens;