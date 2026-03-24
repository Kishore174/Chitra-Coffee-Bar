import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { addset } from '../../../../API/createRoute';
import toast from 'react-hot-toast';
import { deleteShopIntoSet } from '../../../../API/settings';

const ShopCard = ({ shops, routeId, index, selSet, onRefresh }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    setSearchTerm('');
  };

  const handleSubmit = () => {
    setModalOpen(false);
    addset({ setIndex: index, shops: selectedRoutes.map((s) => s._id) }, routeId)
      .then((res) => {
        toast.success(res.message);
        onRefresh?.();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const handleSelectRoute = (route) => {
    if (!selectedRoutes.some((r) => r._id === route._id)) {
      setSelectedRoutes([...selectedRoutes, route]);
    }
  };

  const handleRemoveRoute = (route) => {
    deleteShopIntoSet(routeId, { setIndex: index, shopId: route._id })
      .then((res) => {
        toast.success(res.message);
        setSelectedRoutes(selectedRoutes.filter((r) => r._id !== route._id));
        onRefresh?.();
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  useEffect(() => {
    setSelectedRoutes(selSet);
  }, [selSet]);

  const filteredShops = shops.filter((shop) =>
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      {/* Card body */}
      <div className="flex-1 p-3 min-h-[140px] max-h-[200px] overflow-y-auto">
        {selectedRoutes.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedRoutes.map((route) => (
              <div
                key={route._id}
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
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            No shops assigned
          </div>
        )}
      </div>

      {/* Card footer */}
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
                onClick={toggleModal}
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
                  {selectedRoutes.map((route) => (
                    <div
                      key={route._id}
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

            {/* Available shops list */}
            <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0">
              <h5 className="text-xs font-medium text-gray-500 uppercase px-3 mb-1">
                Available ({filteredShops.length})
              </h5>
              {filteredShops.length > 0 ? (
                filteredShops.map((route) => (
                  <div
                    key={route._id}
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
                <div className="px-3 py-6 text-gray-400 text-center text-sm">
                  No shops found
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={handleSubmit}
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

export default ShopCard;
