import React from "react";
import logo from "../Assets/logo01.png";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative flex items-center justify-center h-24 w-24">
    
        <div className="absolute h-full w-full rounded-full border-4 border-transparent border-t-red-500 animate-spin"></div>
        
        
        <div className="animate-zoom flex items-center justify-center    rounded-full h-16 w-16">
          <img src={logo} alt="logo" className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
