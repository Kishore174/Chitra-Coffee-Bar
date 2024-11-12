import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
 
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import InsideShopReuse from './InsideShopReuse';
const InsideShop = () => {
    const [kitchenData, setKitchenData] = useState({
        snacks: {},
        milk: {},
        grinder: {},
        sink: {},
        workTable: {},
        kitchenFloor: {},
        exhaustFan: {},
      });
  const navigate = useNavigate();
    
      // Function to handle submission of individual kitchen item data
      const handleItemUpdate = (itemType, data) => {
        setKitchenData((prevData) => ({
          ...prevData,
          [itemType]: data,
        }));
      };
    
      // Function to handle overall submit
      const handleOverallSubmit = () => {
        console.log("All Kitchen Data: ", kitchenData);
      };
  return (
    <div className='poppins-regular max-w-7xl md:ml-24'>
    <button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
      <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
    </button>
    <div className="flex flex-wrap justify-start mx-auto gap-5">
      <InsideShopReuse title="Dining Area" itemType="Dining Area" onUpdate={handleItemUpdate} />
      <InsideShopReuse title="Hand Wash" itemType="HandWash" onUpdate={handleItemUpdate} />
      <InsideShopReuse title="Juice Bar " itemType="JuiceBar " onUpdate={handleItemUpdate} />
      <InsideShopReuse title="Snack Counter" itemType="Snack Counter" onUpdate={handleItemUpdate} />
      <InsideShopReuse title="Dustbin "itemType="Dustbin" onUpdate={handleItemUpdate} />
      
    </div>
    <button
      onClick={handleOverallSubmit}
      className='bg-red-500 text-white w-5/6 py-2 mx-auto flex items-center text-center mt-12 rounded-md hover:bg-red-600'
    >
      <span className='text-center mx-auto'>Submit All Data</span>
    </button>
  </div>
  )
}

export default InsideShop