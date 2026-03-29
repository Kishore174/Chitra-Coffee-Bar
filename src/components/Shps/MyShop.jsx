import React, { useEffect, useState } from 'react';
import { FaEye, FaPlus, FaSearch, FaStore } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { deleteShop, getAllShops, getShopByAuditor } from '../../API/shop';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { useAuth } from '../../context/AuthProvider';

const MyShop = () => {
  const [shops, setShops] = useState([]);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filteredShops, setFilteredShops] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const getApi = user?.role === 'super-admin' ? getAllShops : getShopByAuditor;
    getApi()
      .then((res) => {
        setShops(res.data);
        setFilteredShops(res.data);
      })
      .catch((err) => toast.error(`Error: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (shop) => navigate('/addshop', { state: { shop, isEdit: true } });
  const handleView = (shop) => navigate('/addshop', { state: { shop, isView: true } });
  const handleDeleteClick = (shop) => { setShopToDelete(shop); setConfirmDialogOpen(true); };

  const confirmDelete = () => {
    if (shopToDelete) {
      deleteShop(shopToDelete._id)
        .then(() => {
          toast.success(`${shopToDelete.shopName} has been deleted.`);
          const updated = shops.filter((s) => s._id !== shopToDelete._id);
          setShops(updated);
          setFilteredShops(updated);
          setShopToDelete(null);
        })
        .catch((err) => toast.error(`Error: ${err.message}`));
      setConfirmDialogOpen(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFilteredShops(
      shops.filter((shop) =>
        Object.keys(shop).some(
          (key) => typeof shop[key] === 'string' && shop[key].toLowerCase().includes(term)
        )
      )
    );
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const paginatedShops = filteredShops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen px-4 py-6 max-w-screen-xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2.5 rounded-xl shadow-sm">
            <FaStore size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Shops</h1>
            <p className="text-sm text-gray-500 mt-0.5">{filteredShops.length} locations found</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm" />
            <input
              type="text"
              placeholder="Search shops..."
              onChange={handleSearch}
              className="w-full sm:w-56 pl-8 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* Add Button */}
          <Link to="/addshop">
            <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-all duration-150 w-full sm:w-auto">
              <FaPlus size={11} />
              Add Shop
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-red-600 text-white">
                  {['#', 'Shop', 'Location', 'Contact', 'Franchise', 'Property', 'Actions'].map((h, i) => (
                    <th
                      key={i}
                      className="text-left text-sm font-semibold uppercase tracking-wider px-4 py-3.5 first:rounded-tl-none last:rounded-tr-none"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedShops.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-gray-400 text-sm">
                      No shops found.
                    </td>
                  </tr>
                ) : (
                  paginatedShops.map((shop, index) => (
                    <tr key={shop._id} className="hover:bg-red-50/40 transition-colors duration-100 group">
                      {/* S.No */}
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-400 w-10">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      {/* Shop Name */}
                      <td className="px-4 py-3.5 max-w-[180px]">
                        <Link to={shop._id}>
                          <p className="font-semibold text-gray-900 hover:text-red-600 transition-colors truncate">
                            {shop.shopName}
                          </p>
                        </Link>
                        <p className="text-sm text-gray-400 mt-0.5 truncate">{shop.ownerName}</p>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 max-w-[140px]">
                        <p
                          className="text-sm text-gray-600 truncate"
                          title={shop.address}
                        >
                          {shop.address?.length > 18
                            ? `${shop.address.slice(0, 18)}…`
                            : shop.address}
                        </p>
                        <a
                          href={shop.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-500 hover:text-red-700 font-medium mt-0.5 block"
                        >
                          View map →
                        </a>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3.5 max-w-[160px]">
                        <p className="text-sm text-gray-700">{shop.phone}</p>
                        <a
                          href={`mailto:${shop.email}`}
                          className="text-sm text-red-500 hover:underline truncate block mt-0.5"
                        >
                          {shop.email?.length > 20 ? `${shop.email.slice(0, 20)}…` : shop.email}
                        </a>
                      </td>

                      {/* Franchise Type */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-block text-sm font-semibold px-2.5 py-1 rounded-full ${
                          shop.franchiseType === 'own'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-orange-50 text-orange-700'
                        }`}>
                          {shop.franchiseType === 'own' ? 'Properties' : shop.franchiseType}
                        </span>
                      </td>

                      {/* Property Type */}
                      <td className="px-4 py-3.5">
                        <span className="inline-block text-sm font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          {shop.propertyType}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleView(shop)}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <FaEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(shop)}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                            title="Edit"
                          >
                            <GrEdit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(shop)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
            {paginatedShops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{shop.shopName}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{shop.ownerName}</p>
                  </div>
                  <span className="text-sm font-semibold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">
                    {shop.franchiseType === 'own' ? 'Properties' : shop.franchiseType}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <p className="text-sm text-gray-500 truncate">📍 {shop.address}</p>
                  <p className="text-sm text-gray-600">{shop.phone}</p>
                  <a href={`mailto:${shop.email}`} className="text-sm text-red-500 hover:underline block truncate">
                    {shop.email}
                  </a>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className="text-sm text-gray-400">{shop.propertyType}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleView(shop)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <FaEye size={13} />
                    </button>
                    <button onClick={() => handleEdit(shop)} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors">
                      <GrEdit size={12} />
                    </button>
                    <button onClick={() => handleDeleteClick(shop)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <MdDelete size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 flex-wrap gap-3">
              <p className="text-sm text-gray-400">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredShops.length)} of{' '}
                {filteredShops.length} shops
              </p>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ‹
                </button>

                {/* Page buttons with ellipsis */}
                {(() => {
                  const pages = [];
                  const delta = 1; // pages around current
                  const left = currentPage - delta;
                  const right = currentPage + delta;

                  let lastPrinted = 0;

                  for (let i = 1; i <= totalPages; i++) {
                    const isEdge = i === 1 || i === totalPages;
                    const isNearCurrent = i >= left && i <= right;

                    if (isEdge || isNearCurrent) {
                      if (lastPrinted && i - lastPrinted > 1) {
                        pages.push(
                          <span key={`dots-${i}`} className="px-1 text-gray-400 text-sm select-none">
                            …
                          </span>
                        );
                      }
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-8 h-8 text-sm font-semibold rounded-lg transition-all duration-150 ${
                            currentPage === i
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
                          }`}
                        >
                          {i}
                        </button>
                      );
                      lastPrinted = i;
                    }
                  }
                  return pages;
                })()}

                {/* Next */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ›
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isConfirmDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-in">
                {/* Red warning icon */}
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                  <MdDelete className="text-red-600" size={22} />
                </div>
                <h2 className="text-base font-bold text-gray-900 text-center mb-1">Delete Shop?</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                  <span className="font-semibold text-gray-700">{shopToDelete?.shopName}</span> will be
                  permanently removed. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialogOpen(false)}
                    className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyShop;