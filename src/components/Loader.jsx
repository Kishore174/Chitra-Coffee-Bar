import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 border-solid"></div>
    </div>
  );
};

export default Loader;
