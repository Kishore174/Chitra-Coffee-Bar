import { Delete } from '@mui/icons-material';
import React, { useState } from 'react';
import { MdClose, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const RouteCard = ({ allRoutes, onRemoveCard }) => {
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const filteredRoutes = allRoutes.filter((route) =>
    route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRoute = (route) => {
    if (!selectedRoutes.includes(route)) {
      setSelectedRoutes([...selectedRoutes, route]);
    }
    setSearchTerm('');
  };

  const handleRemoveRoute = (route) => {
    setSelectedRoutes(selectedRoutes.filter((r) => r !== route));
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setSearchTerm(''); // Reset search term when opening/closing
  };

  return (
    <div className="w-full md:w-auto p-4 flex flex-col bg-white shadow-lg rounded-lg mb-4">
      <div className="flex justify-between">
        <button
          onClick={toggleModal}
          className="px-3 py-1 poppins-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Select Shops
        </button>
        <button
          onClick={onRemoveCard}
          className="px-2 py-1 text-red-500 hover:text-red-700 transition"
        >
          <Delete />
        </button>
      </div>

      <div className="flex flex-wrap mt-2 gap-2 poppins-regular mb-4 justify-center">
        {selectedRoutes.map((route, index) => (
          <div
            key={index}
            className="flex  items-center  justify-start px-3 py-1 bg-gray-200 rounded-full text-black shadow-sm"
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

const Routes = () => {
  const [routeCards, setRouteCards] = useState([{ id: 1 }, { id: 2 }]); // Set default 2 cards
  const allRoutes = ['shop 1', 'shop2', 'shop3', 'shop4', 'shop5', 'shop6'];
  const navigate = useNavigate()

  const handleAddRouteCard = () => {
    setRouteCards([...routeCards, { id: Date.now() }]);
  };

  const handleRemoveRouteCard = (id) => {
    setRouteCards(routeCards.filter((card) => card.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
      <button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
          </button>
        <button
          onClick={handleAddRouteCard}
          className="px-3 py-1 mb-3 poppins-semibold bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Add Shops
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routeCards.map((card) => (
          <RouteCard
            key={card.id}
            allRoutes={allRoutes}
            onRemoveCard={() => handleRemoveRouteCard(card.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Routes;