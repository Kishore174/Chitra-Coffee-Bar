import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import InsideShopReuse from "./InsideShopReuse";
import { createInsideshop, getInsideShop } from "../../../../API/audits";
import toast from "react-hot-toast";
const InsideShop = () => {
  const [insideShopData, setInsideShopData] = useState({});
  const navigate = useNavigate();
  const { auditId } = useParams();
  const [fetchData,setFetchData] = useState(null)
  // Function to handle submission of individual kitchen item data
  const handleItemUpdate = (itemType, data) => {
    const {captureImages, ...otherData} = data
    setInsideShopData((prevData) => ({
      ...prevData,
      [itemType]: otherData,
      [`${itemType}Images`]:captureImages,
      location:"unknown",
      date:"date"
    }));
  };

  // Function to handle overall submit,
  const handleOverallSubmit = () => {
   createInsideshop(auditId ,insideShopData).then(res =>{
    toast.success(res.message) 
    navigate(-1)}).catch(error =>console.log(error))
   
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
    "dustbin"
  ];
  useEffect(()=>{
    getInsideShop(auditId).then(res=>setFetchData(res.data))
  },[auditId])
  return (
    <div className="poppins-regular max-w-7xl md:ml-24">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-700 flex hover:text-red-600 transition duration-200"
      >
        <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
      </button>
      <div className="flex flex-wrap justify-start mx-auto gap-5">
      {itemTypes.map((itemType) => (
          <InsideShopReuse
            key={itemType}
            title={itemType.replace(/([A-Z])/g, ' $1').trim()} // Convert camelCase to space-separated
            itemType={itemType}
            onUpdate={handleItemUpdate}
            data={fetchData&&fetchData[itemType]}
          />
        ))}
      </div>
      <button
        onClick={handleOverallSubmit}
        disabled={fetchData}
        className="bg-red-500 text-white w-5/6 py-2 mx-auto flex items-center text-center mt-12 rounded-md hover:bg-red-600"
      >
        <span className="text-center mx-auto">Submit All Data</span>
      </button>
    </div>
  );
};

export default InsideShop;
