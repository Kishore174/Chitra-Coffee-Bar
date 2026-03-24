import { Delete, Edit } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { MdClose, MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { addRoute, createRoute, deleteRoute, getRoute } from '../../../../API/createRoute';
import toast from 'react-hot-toast';
import { deleteShopIntoRoute, getUnassignedShops } from '../../../../API/settings';
import Loader from '../../../Loader';

const RouteCard = ({ routeId, routeName, shops, onRemoveCard, onEdit }) => {
  const [selectedRoutes, setSelectedRoutes] = useState(shops || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [allRoutes, setAllRoutes] = useState([]);

  const filteredRoutes = allRoutes.filter((route) =>
    route.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectRoute = (route) => {
    if (!selectedRoutes.some(r => r.shopName === route.shopName)) {
      setSelectedRoutes([...selectedRoutes, route]);
    }
    setSearchTerm('');
  };

  const handleRemoveRoute = (route) => {
    deleteShopIntoRoute(routeId, { shopId: route._id }).then(res => {
      toast.success(res.message);
      setSelectedRoutes(selectedRoutes.filter((r) => r.shopName !== route.shopName));
    }).catch(err => {
      toast.error(err.response?.data?.message);
    });
  };

  const toggleModal = async () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setSearchTerm('');
    } else {
      try {
        const res = await addRoute(selectedRoutes.map((shop) => shop._id), routeId);
        toast.success(res.message);
      } catch (error) {
        console.error('Error adding route:', error);
      }
    }
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getUnassignedShops();
        const shopNames = res.data.map(shop => ({
          _id: shop._id,
          shopName: shop.shopName,
          address: shop.address,
        }));
        setAllRoutes(shopNames);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };
    fetchRoutes();
  }, [modalOpen]);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-[24px]">
      {/* Header */}
      <div className="flex justify-between items-center bg-red-600 px-4 py-3">
        <span className="text-white poppins-semibold truncate text-xl">{routeName}</span>
        <div className="flex gap-1">
          <button onClick={onEdit} className="text-white/80 hover:text-white p-1 transition">
            <Edit fontSize="small" />
          </button>
          <button onClick={onRemoveCard} className="text-white/80 hover:text-white p-1 transition">
            <Delete fontSize="small" />
          </button>
        </div>
      </div>

      {/* Shop list */}
      <div className="flex-1 p-3 min-h-[140px] max-h-[220px] overflow-y-auto">
        {selectedRoutes.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-300">
            No shops assigned
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selectedRoutes.map((route, index) => (
              <div
                key={index}
                className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-700 group hover:border-red-200 hover:bg-red-50 transition"
              >
                <span className="truncate max-w-[120px]">{route.shopName}</span>
                <button
                  className="text-gray-400 group-hover:text-red-500 transition flex-shrink-0"
                  onClick={() => handleRemoveRoute(route)}
                >
                  <MdClose size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
        <span className="text-xs text-gray-400">{selectedRoutes.length} shops</span>
        <button
          onClick={toggleModal}
          className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition poppins-medium"
        >
          + Add Shop
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
              <h4 className="text-lg poppins-semibold text-gray-800">Choose Shops</h4>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 text-sm"
                placeholder="Search shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Selected shops */}
            {selectedRoutes.length > 0 && (
              <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
                <h5 className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Selected ({selectedRoutes.length})
                </h5>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {selectedRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2.5 py-1 bg-red-50 border border-red-200 rounded-md text-xs text-red-700"
                    >
                      <span className="truncate max-w-[140px]">{route.shopName}</span>
                      <button
                        className="text-red-400 hover:text-red-600 flex-shrink-0"
                        onClick={() => handleRemoveRoute(route)}
                      >
                        <MdClose size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available shops */}
            <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0">
              <h5 className="text-xs font-medium text-gray-500 uppercase px-3 mb-1">
                Available ({filteredRoutes.length})
              </h5>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 cursor-pointer rounded-lg text-sm transition ${
                      selectedRoutes.some((r) => r._id === route._id)
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    onClick={() => handleSelectRoute(route)}
                  >
                    {route.shopName}
                  </div>
                ))
              ) : (
                <div className="px-3 py-6 text-gray-400 text-center text-sm">No shops found</div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={toggleModal}
                className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition poppins-medium text-sm"
              >
                Save Changes
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
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await getRoute();
        setRouteCards(routes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

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
    if (routeToDelete) {
      deleteRoute(routeToDelete._id)
        .then(() => {
          toast.success(`${routeToDelete.name} has been deleted.`);
          setRouteCards(routeCards.filter((s) => s._id !== routeToDelete._id));
          setRouteToDelete(null);
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
    <div className="p-6 min-h-screen text-[24px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 flex items-center gap-1 hover:text-red-600 transition text-sm mb-1"
          >
            <MdKeyboardDoubleArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-2xl poppins-semibold text-gray-800">Routes</h1>
          <p className="text-sm text-gray-500">Manage routes and assign shops</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-red-600 text-white rounded-lg poppins-semibold hover:bg-red-700 transition shadow-sm text-sm"
        >
          + Create Route
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {routeCards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="poppins-medium text-lg">No routes available</p>
              <p className="text-sm mt-1">Create a route to get started</p>
            </div>
          )}

          {/* Route Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {routeCards &&
              routeCards.map((card) => (
                <RouteCard
                  key={card._id}
                  routeId={card._id}
                  routeName={card.name}
                  shops={card.shops}
                  onRemoveCard={() => handleRemoveRouteCard(card)}
                  onEdit={() => handleEditCard(card._id, card.name)}
                />
              ))}
          </div>

          {/* Confirm Delete Dialog */}
          {isConfirmDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
                <h2 className="text-lg poppins-semibold text-gray-800 mb-2">Delete Route</h2>
                <p className="text-sm text-gray-500 mb-5">
                  Are you sure you want to delete <strong>{routeToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    onClick={() => setConfirmDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create/Edit Route Modal */}
          {modalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg poppins-semibold text-gray-800">
                    {isEdit ? "Edit Route" : "Create Route"}
                  </h2>
                  <button
                    onClick={toggleModal}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 text-sm"
                  placeholder="Enter route name"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                />
                <button
                  onClick={handleAddRouteCard}
                  className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition poppins-medium text-sm"
                >
                  {isEdit ? "Update Route" : "Add Route"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Routes;
