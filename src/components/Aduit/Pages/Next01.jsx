import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import DiningSection from './insideall/DiningSection';
import HandWashSection from './insideall/HandWashSection';
import JuiceBarSection from './insideall/JuiceBarSection';
import SnackCounterSection from './insideall/SnackCounterSection';
import DustbinSection from './insideall/DustbinSection';

const Next01 = () => {
 
  const navigate = useNavigate()

 
  return (
    <div className="   poppins-regular  md:ml-28   ">
<button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
          </button>
      <div className="flex flex-wrap mx-auto space-x-4">
     <DiningSection/>
     <HandWashSection/>
     <JuiceBarSection/>
     <SnackCounterSection/>
     <DustbinSection/>
      </div>
      <Link to="/Kitchenarea">
       
       <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
    <span className='text-center  mx-auto'> Go Inside Kitchen</span> 
       </button>
     </Link>
    </div>
  );
};

export default Next01;
