import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import DiningSection from './insideShop/DiningSection';
import HandWashSection from './insideShop/HandWashSection';
import JuiceBarSection from './insideShop/JuiceBarSection';
import SnackCounterSection from './insideShop/SnackCounterSection';
import DustbinSection from './insideShop/DustbinSection';

const Next01 = () => {
 
  const navigate = useNavigate()

 
  return (
    <div className="poppins-regular md:ml-28 px-4 md:px-8 lg:px-12">
    <button
      onClick={() => navigate(-1)}
      className="text-gray-700 flex items-center hover:text-red-600 transition duration-200 mb-4"
    >
      <MdKeyboardDoubleArrowLeft className="w-6 h-6 mr-1" />
      Back
    </button>

    <div className="flex flex-wrap justify-center md:justify-start gap-4">
      <DiningSection />
      <HandWashSection />
      <JuiceBarSection />
      <SnackCounterSection />
      <DustbinSection />
    </div>

    <Link to="/add-audit" className="w-full flex justify-center mt-8">
      <button className="bg-red-500 text-white w-full sm:w-3/4 md:w-full lg:w-full xl:w-full py-2 rounded-md hover:bg-red-600 transition duration-200">
        Submit
      </button>
    </Link>
  </div>
  );
};

export default Next01;
