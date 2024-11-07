import React from 'react';
import { Link } from 'react-router-dom';
 
import { BakeryDining, BikeScooter, BrandingWatermarkSharp } from '@mui/icons-material';
import { GrBike } from 'react-icons/gr';
import { MdBrandingWatermark, MdOutlineBakeryDining } from 'react-icons/md';

const Setting = () => {
  const settings = [
    { name: 'Snacks', icon: <MdOutlineBakeryDining className="h-8 w-8 text-red-500" />, path: '/backeryproducts ' },
    { name: 'Brand Name', icon: <BrandingWatermarkSharp className="h-8 w-8 text-red-500" />, path: '/BrandName ' },
 
  ];

  return (
    
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
    </div>
  );
};

export default Setting;
