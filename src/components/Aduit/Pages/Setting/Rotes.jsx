import { PencilIcon } from '@heroicons/react/24/solid';
import { Delete, Edit } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { MdClose, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getAllShops } from '../../../../API/shop';
import { addRoute, createRoute, deleteRoute, getRoute } from '../../../../API/createRoute';
import toast from 'react-hot-toast';
import SetRoutes from './SetRoutes';

const RouteCard = ({ routeId, routeName,shops,allShops, onRemoveCard, onEdit }) => {
  const [selectedRoutes, setSelectedRoutes] = useState(shops||[]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [allRoutes, setAllRoutes] = useState(allShops||[]);

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
        console.log("selcted routes",selectedRoutes.map((shop)=>shop._id))
        // Await the API call to add selected routes
        const res = await addRoute(selectedRoutes.map((shop)=>shop._id),routeId); // Assuming selectedRoutes have _id
        toast.success(res.message)
      } catch (error) {
        console.error('Error adding route:', error);
      }
    }
  };


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
              <button onClick={()=>setModalOpen(!modalOpen)} className="text-gray-500 hover:text-gray-700">✖️</button>
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
  const [allRoutes, setAllRoutes] = useState([]);
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await getRoute(); // Update based on parameters if needed
        setRouteCards(routes.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getAllShops();
        const shopNames = res.data.map(shop => ({
          _id : shop._id,
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
  
  console.log("Routes",routeCards)
  const handleAddRouteCard = async () => {
    if (newRouteName.trim()) {
      if (isEdit) {
        setRouteCards(routeCards.map((card) =>
          card.id === editCardId ? { ...card, name: newRouteName } : card
        ));
        await createRoute({ id: editCardId, name: newRouteName });
      } else {
        const res = await createRoute({ name: newRouteName });
        setRouteCards([...routeCards, { id: res.data.id, name: newRouteName }]);
      }
      setNewRouteName('');
      setModalOpen(false);
      setIsEdit(false);
      setEditCardId(null);
    }
  };
  const confirmDelete = () => {
    if ( routeToDelete) {
      deleteRoute(routeToDelete._id)
        .then(() => {
          toast.success(`${routeToDelete.name} has been deleted.`);
          setRouteCards(routeCards.filter((s) => s._id !== routeToDelete._id));
          setRouteToDelete(null); // Clear the selected shop
        })
        .catch((err) => toast.error(`Error: ${err.message}`));
      setConfirmDialogOpen(false);
    }
  };
  const handleRemoveRouteCard = (route) => {
    setRouteToDelete(route);
    setConfirmDialogOpen(true);
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

      {routeCards.length === 0 && (
        <div className="text-gray-500 p-2 text-center text-3xl flex justify-center mx-auto poppins-semibold">
          No Routes Available
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {routeCards &&  routeCards.map((card) => (
          <RouteCard
            key={card._id}
            routeId = {card._id}
            routeName={card.name}
            shops = {card.shops}
            allShops={allRoutes}
            onRemoveCard={() => handleRemoveRouteCard(card)}
            onEdit={() => handleEditCard(card._id, card.name)}
          />
        ))}
         {isConfirmDialogOpen && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this shop?</h2>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setConfirmDialogOpen(false)}>
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
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
