import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';

const ShopCard = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState(['Shop A', 'Shop B', 'Shop C','Shop D', 'Shop D', 'Shop E']); // Example shops

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleSelectRoute = (route) => {
    if (!selectedRoutes.includes(route)) {
      setSelectedRoutes([...selectedRoutes, route]);
    }
  };

  const handleRemoveRoute = (route) => {
    setSelectedRoutes(selectedRoutes.filter((r) => r !== route));
  };

  return (
    <div className="w-5/6 mx-auto flex-col justify-between flex p-6 bg-white rounded-lg shadow-lg poppins-regular">
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={toggleModal}
        className="p-1 py-1 bg-red-600 poppins-medium text-white rounded text-md hover:bg-red-700 transition"
      >
        Select Shop
      </button>
    </div>
  
    <div className="flex flex-wrap gap-3 mb-4">
      {selectedRoutes.map((route, index) => (
        <div
          key={index}
          className="flex items-center px-4 py-2 bg-gray-100 rounded-full text-gray-800 shadow-sm"
        >
          <span className="text-sm">{route}</span>
          <button
            className="ml-2 text-red-500 hover:text-red-700"
            onClick={() => handleRemoveRoute(route)}
            aria-label={`Remove ${route}`}
          >
            <MdClose />
          </button>
        </div>
      ))}
    </div>
    <p className="text-gray-500 text-right text-sm">
      Selected Shops: {selectedRoutes.length}
    </p>
  
    {modalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-lg font-poppins">
          <div className="p-5 border-b flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-800">Choose Shops</h4>
            <button
              onClick={toggleModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✖️
            </button>
          </div>
  
          <input
            type="text"
            className="w-full p-3 mt-3 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
  
          <div className="p-5">
            <h5 className="font-medium text-gray-700 mb-2">Selected Shops</h5>
            {selectedRoutes.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {selectedRoutes.map((route) => (
                  <div
                    key={route}
                    className="flex items-center px-4 py-2 bg-gray-200 rounded-full text-gray-700 shadow-sm"
                  >
                    <span className="text-sm">{route}</span>
                    <button
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveRoute(route)}
                      aria-label={`Remove ${route}`}
                    >
                      <MdClose />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center text-sm">No shops selected</div>
            )}
          </div>
  
          <div className="max-h-48 overflow-y-auto p-5">
            <h5 className="font-medium text-gray-700 mb-2">Available Shops</h5>
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map((route) => (
                <div
                  key={route}
                  className="p-3 cursor-pointer hover:bg-blue-100 rounded-md text-sm text-gray-700"
                  onClick={() => handleSelectRoute(route)}
                >
                  {route}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center text-sm">No routes found</div>
            )}
          </div>
  
          <div className="p-5">
            <button
              onClick={toggleModal}
              className="py-2 w-full bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default ShopCard;
