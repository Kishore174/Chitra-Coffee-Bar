import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KitchenItem from './KitchenItem';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const InsideKitchens = () => {
  const navigate = useNavigate();

  // State to hold data from all kitchen items
  const [kitchenData, setKitchenData] = useState({
    snacks: {},
    milk: {},
    grinder: {},
    sink: {},
    workTable: {},
    kitchenFloor: {},
    exhaustFan: {},
  });

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
        <KitchenItem title="Snack Making Counter" itemType="snacks" onUpdate={handleItemUpdate} />
        <KitchenItem title="Milk Freezer" itemType="milk" onUpdate={handleItemUpdate} />
        <KitchenItem title="Grinder" itemType="grinder" onUpdate={handleItemUpdate} />
        <KitchenItem title="Sink" itemType="sink" onUpdate={handleItemUpdate} />
        <KitchenItem title="Work Table" itemType="workTable" onUpdate={handleItemUpdate} />
        <KitchenItem title="Kitchen Floor" itemType="kitchenFloor" onUpdate={handleItemUpdate} />
        <KitchenItem title="Exhaust Fan" itemType="exhaustFan" onUpdate={handleItemUpdate} />
      </div>
      <button
        onClick={handleOverallSubmit}
        className='bg-red-500 text-white w-5/6 py-2 mx-auto flex items-center text-center mt-12 rounded-md hover:bg-red-600'
      >
        <span className='text-center mx-auto'>Submit All Data</span>
      </button>
    </div>
  );
};

export default InsideKitchens;