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
    <div className="poppins-regular md:ml-28">
  <button
    onClick={() => navigate(-1)}
    className="text-gray-700 flex items-center hover:text-red-600 transition duration-200"
  >
    <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
  </button>

  <div className="p-4 flex flex-col md:flex-row md:flex-wrap mx-auto justify-start gap-4">
    <MenuBrandSection />
    <MapSection />
    <BunzoSection />
    <BakshanamSection />
    <PillarBrandSection />
  </div>

  <Link to="/add-audit">
    <button className="bg-red-500 text-white w-fullsm:w-3/4 md:w-full lg:w-full xl:w-full py-2 mx-auto flex items-center justify-center mt-12 rounded-md hover:bg-red-600">
      <span>Submit</span>
    </button>
  </Link>
</div>

  );
};

export default Branding;
