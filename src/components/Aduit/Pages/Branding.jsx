import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import MenuBrandSection from './Branding/MenuBrandSection';
import MapSection from './Branding/MapSection';
import BunzoSection from './Branding/BunzoSection';
import BakshanamSection from './Branding/BakshanamSection';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import PillarBrandSection from './Branding/PillarBrandSection';

const Branding = () => {
  const navigate = useNavigate()
  return (
    <div className='   poppins-regular  md:ml-28'>
    <button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
          </button>
    <div className="p-4 flex flex-wrap mx-auto justify-start gap-4">
      <MenuBrandSection/>

      <MapSection/>
 <BunzoSection/>

      <BakshanamSection/>
      <PillarBrandSection/>
    </div>
    <Link to="/add-audit">
       
       <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
    <span className='text-center  mx-auto'>Submit</span> 
       </button>
     </Link>
    </div>
  );
};

export default Branding;
