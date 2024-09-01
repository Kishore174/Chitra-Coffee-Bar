import React from 'react';
import shopPhoto from "../../../Assets/logo01.png";
import Tab from './Tab';

const AddAudit = () => {
  return (
    <div className="p-4 md:p-6">
      {/* Container for the shop details */}
      <div className="flex flex-col md:flex-row items-center   rounded-lg p-6 md:w-3/6   ">
        {/* Shop Image */}
        <div className="mr-0 md:mr-6 mb-4 md:mb-0">
          <img
            src={shopPhoto}
            alt="Shop"
            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-gray-300"
          />
        </div>
        {/* Shop Details */}
        <div className="text-center md:text-left">
          <p className="text-md font-medium text-gray-600">
            RK Tea
          </p>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
            Kumar
          </h1>
          <h2 className="text-md md:text-xl font-medium text-gray-600">
            ¾, Main road, Katpadi
          </h2>
        </div>
      </div>

      {/* Tab Component */}
      <div className="mt-6">
        <Tab />
      </div>
    </div>
  );
};

export default AddAudit;
