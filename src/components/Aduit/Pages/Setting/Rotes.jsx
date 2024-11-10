import { PencilIcon } from '@heroicons/react/24/solid';
import { Delete, Edit } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { MdClose, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getAllShops } from '../../../../API/shop';
import { addRoute, createRoute } from '../../../../API/createRoute';

const RouteCard = ({ routeName, onRemoveCard, onEdit }) => {
  const [selectedRoutes, setSelectedRoutes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [allRoutes, setAllRoutes] = useState([]);

  // Filter routes based on the search term
  const filteredRoutes = allRoutes.filter((route) =>
    route.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRoute = (route) => {
    if (!selectedRoutes.some(r => r.shopName === route.shopName)) {
      setSelectedRoutes([...selectedRoutes, route]);
    }
    setSearchTerm(''); // Reset search term after selection
  };

  const handleRemoveRoute = (route) => {
    setSelectedRoutes(selectedRoutes.filter((r) => r.shopName !== route.shopName));
  };

  const toggleModal = async () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setSearchTerm('');  // Reset search term when modal is opened
    } else {
      try {
        // Await the API call to add selected routes
        await addRoute(selectedRoutes.map(route => route._id)); // Assuming selectedRoutes have _id
        console.log('Selected routes added:', selectedRoutes);
      } catch (error) {
        console.error('Error adding route:', error);
      }
    }
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getAllShops();
        const shopNames = res.data.map(shop => ({
          shopName: shop.shopName,
          address: shop.address,
        }));
        setAllRoutes(shopNames);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    fetchRoutes();
  }, []);

  return (
    <div className="md:w-auto p-0.5 flex flex-col bg-white shadow-lg rounded-lg mb-4">
      <div className="flex justify-between bg-red-600 items-center rounded-br-2xl p-2 poppins-semibold">
        <button className="p-2 text-white px-2 py-1">{routeName}</button>
        <div>
          <button onClick={onRemoveCard} className="px-2 py-1 text-white transition">
            <Delete />
          </button>
          <button onClick={onEdit} className="px-2 py-1 text-white transition">
            <Edit />
          </button>
        </div>
      </div>

      <div className="m-2 flex justify-end">
        <button onClick={toggleModal} className="px-2 m-0.5 py-1 text-white bg-red-600 rounded-md transition">
          Select Shops
        </button>
      </div>

      <div className="flex flex-wrap mt-2 gap-2 mb-4">
        {selectedRoutes.length === 0 && (
          <div className="text-gray-500 p-2 text-center flex justify-center mx-auto poppins-semibold text-sm">
            No shops Available
          </div>
        )}
        {selectedRoutes.map((route, index) => (
          <div key={index} className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-black shadow-sm">
            <span className="text-sm">{route.shopName}</span>
            <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveRoute(route)} aria-label={`Remove ${route.shopName}`}>
              <MdClose />
            </button>
          </div>
        ))}
      </div>

      <p className="text-gray-500 text-end p-2 poppins-medium text-sm">
        Selected Shops: {selectedRoutes.length}
      </p>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <h4 className="text-lg font-semibold">Choose Shops</h4>
              <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">✖️</button>
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
                  {selectedRoutes.map((route, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-gray-200 rounded-full text-black shadow-sm">
                      <span className="text-sm">{route.shopName}</span>
                      <button className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveRoute(route)} aria-label={`Remove ${route.shopName}`}>
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
                filteredRoutes.map((route, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-blue-100 rounded-md text-sm"
                    onClick={() => handleSelectRoute(route)}
                  >
                    {route.shopName}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center text-sm">No routes found</div>
              )}
            </div>

            <div className="p-3 w-full">
              <button onClick={toggleModal} className="py-2 w-full bg-red-600 text-white rounded-md hover:bg-red-700 transition">
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
  const [routeCards, setRouteCards] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRouteName, setNewRouteName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
   const[allRoutes,setAllRoutes] =useState([])
  const navigate = useNavigate();

  const handleAddRouteCard = async () => {
    if (newRouteName.trim()) {
      if (isEdit) {
        setRouteCards(routeCards.map((card) =>
          card.id === editCardId ? { ...card, name: newRouteName } : card
        ));
        const res = await createRoute(newRouteName); // make this awaitable
        console.log(res);
      } else {
        setRouteCards([...routeCards, { id: Date.now(), name: newRouteName }]);
      }
      setNewRouteName('');
      setModalOpen(false);
      setIsEdit(false);
      setEditCardId(null);
    }
  };
  
 
  
  console.log(allRoutes)
  const handleRemoveRouteCard = (id) => {
    setRouteCards(routeCards.filter((card) => card.id !== id));
  };

  const handleEditCard = (id, name) => {
    setIsEdit(true);
    setEditCardId(id);
    setNewRouteName(name);
    setModalOpen(true);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setNewRouteName('');
    setIsEdit(false);
    setEditCardId(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-700 flex hover:text-red-600 transition duration-200"
        >
          <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Create Route
        </button>
      </div>
      { routeCards.length === 0  &&
    <div className="text-gray-500 p-2 text-center text-3xl flex justify-center mx-auto poppins-semibold ">
                 No Routes Available
                </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routeCards.map((card) => (
          <RouteCard
            key={card.id}
            routeName={card.name}
            // allRoutes={allRoutes}
            onRemoveCard={() => handleRemoveRouteCard(card.id)}
            onEdit={() => handleEditCard(card.id, card.name)}
          />
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="flex justify-between mb-3">
              <h2>{isEdit ? "Edit Route" : "Create Route"}</h2>
              <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
                ✖️
              </button>
            </div>
    
            <input
              type="text"
              className="w-full border rounded-md p-2 mb-4"
              placeholder="Enter route name"
              value={newRouteName}
              onChange={(e) => setNewRouteName(e.target.value)}
            />
    
            <button
              onClick={handleAddRouteCard}
              className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              {isEdit ? "Update Route" : "Add Route"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
