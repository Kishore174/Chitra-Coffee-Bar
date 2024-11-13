import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
 
import { BakeryDining, BikeScooter, BrandingWatermarkSharp } from '@mui/icons-material';
import { GrBike } from 'react-icons/gr';
import { MdArrowBack, MdBrandingWatermark, MdOutlineBakeryDining } from 'react-icons/md';

const Setting = () => {
  const navigate = useNavigate();

  const settings = [
    { name: 'Snacks', icon: <MdOutlineBakeryDining className="h-8 w-8 text-red-500" />, path: '/backeryproducts ' },
    { name: 'Brand Name', icon: <BrandingWatermarkSharp className="h-8 w-8 text-red-500" />, path: '/BrandName ' },
    { name: 'LiveSnacks', icon: <BrandingWatermarkSharp className="h-8 w-8 text-red-500" />, path: '/LiveSnackName ' },

 
  ];

  return (
    <><button onClick={() => navigate(-1)} className="text-gray-700 p-6 flex space-x-1 hover:text-red-600 transition duration-200">
      <MdArrowBack className="w-6 h-6 mt-1" />
      <h1 className="text-xl md:text-xl font-semibold  ">Back</h1>
    </button>
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {settings.map((setting) => (
          <Link
            to={setting.path}
            key={setting.name}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-transform transform hover:scale-105"
          >
            {setting.icon}
            <span className="mt-2 text-gray-700 font-medium">{setting.name}</span>
          </Link>
        ))}
      </div></>
  );
};

export default Setting;
