import React from 'react';
import { MdClose } from 'react-icons/md';

const SelectedRoutesDisplay = ({
  selectedRoutes,
  toggleModal,
  searchTerm,
  setSearchTerm,
  modalOpen,
  handleSelectRoute,
  filteredRoutes,
  handleRemoveRoute,
}) => {
  return (
    <div>
      <div className="flex justify-between mt-4">
        <button
          onClick={toggleModal}
          className="px-3 py-1 poppins-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Select Shops
        </button>
      </div>

      <div className="flex flex-wrap mt-2 gap-2 poppins-regular mb-4 justify-center">
        {selectedRoutes.map((route, index) => (
          <div
            key={index}
            className="flex items-center justify-start px-3 py-1 bg-gray-200 rounded-full text-black shadow-sm"
          >
            <span className="text-sm">{route}</span>
            <button
              className="ml-1 text-red-500 hover:text-red-700"
              onClick={() => handleRemoveRoute(route)}
              aria-label={`Remove ${route}`}
            >
              <MdClose />
            </button>
          </div>
        ))}
      </div>
      <p className="text-gray-500 text-end mt-2 poppins-medium text-sm">
        Selected Shops: {selectedRoutes.length}
      </p>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <h4 className="text-lg font-semibold">Choose Shops</h4>
              <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
                ✖️
              </button>
            </div>

            <input
              type="text"
              className="w-full p-2 border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Search routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="p-3">
              <h5 className="poppins-medium mb-1">Selected Shops</h5>
              {selectedRoutes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {selectedRoutes.map((route) => (
                    <div
                      key={route}
                      className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-black shadow-sm"
                    >
                      <span className="text-sm">{route}</span>
                      <button
                        className="ml-1 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveRoute(route)}
                        aria-label={`Remove ${route}`}
                      >
                        <MdClose />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center poppins-semibold text-sm">
                  No shops selected
                </div>
              )}
            </div>

            <div className="max-h-40 overflow-y-auto p-3">
              <h5 className="poppins-medium mb-1">Available Shops</h5>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <div
                    key={route}
                    className="p-2 cursor-pointer hover:bg-blue-100 rounded-md text-sm"
                    onClick={() => handleSelectRoute(route)}
                  >
                    {route}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center text-sm">No routes found</div>
              )}
            </div>

            <div className="p-1 w-full">
              <button
                onClick={toggleModal}
                className="py-2 w-full bg-red-600 text-white rounded-md hover:bg-red-700 transition"
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

export default SelectedRoutesDisplay;
