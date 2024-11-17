import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdFastfood, MdLabel, MdLiveTv } from 'react-icons/md';

const Setting = () => {
  const navigate = useNavigate();

  const settings = [
    { name: 'Snacks', icon: <MdFastfood className="h-8 w-8 text-red-500" />, path: '/backeryproducts' },
    { name: 'Brand Name', icon: <MdLabel className="h-8 w-8 text-red-500" />, path: '/brandname' },
    { name: 'Live Snacks', icon: <MdFastfood className="h-8 w-8 text-red-500" />, path: '/livesnackname' },
  ];

  return (
    <>
      <button onClick={() => navigate(-1)} className="text-gray-700 p-6 flex space-x-1 hover:text-red-600 transition duration-200">
        <MdArrowBack className="w-6 h-6 mt-1" />
        <h1 className="text-xl font-semibold">Back</h1>
      </button>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {settings.map((setting) => (
          <Link
            to={setting.path}
            key={setting.name}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            {setting.icon}
            <span className="mt-2 text-gray-700 font-medium">{setting.name}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Setting;