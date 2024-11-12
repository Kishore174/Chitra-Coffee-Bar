import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { deleteShop, getAllShops } from '../../API/shop';
import toast from 'react-hot-toast';

const MyShop = () => {
  const [shops, setShops] = useState([]);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set items per page
  const navigate = useNavigate();

  useEffect(() => {
    getAllShops().then((res) => setShops(res.data));
  }, []);

  const handleEdit = (shop) => {
    navigate('/addshop', { state: { shop, isEdit: true } });
  };

  const handleView = (shop) => {
    navigate('/addshop', { state: { shop, isView: true } });
  };

  const handleDeleteClick = (shop) => {
    setShopToDelete(shop);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (shopToDelete) {
      deleteShop(shopToDelete._id)
        .then(() => {
          toast.success(`${shopToDelete.shopName} has been deleted.`);
          setShops(shops.filter((s) => s._id !== shopToDelete._id));
          setShopToDelete(null);
        })
        .catch((err) => toast.error(`Error: ${err.message}`));
      setConfirmDialogOpen(false);
    }
  };

  // Pagination controls
  const totalPages = Math.ceil(shops.length / itemsPerPage);
  const paginatedShops = shops.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">My Shop</h1>
        <Link to="/addshop">
          <button className="bg-red-600 text-white rounded-lg poppins-semibold py-1 px-3 flex items-center">
            <FaPlus className="mr-2" /> Add Shop
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full bg-white border hidden lg:table">
          <thead className="bg-red-600 text-white">
            <tr>
              {['S.No', 'Shop Name', 'Location', 'Contact Details', 'Franchise Name', 'Partnership', 'Action'].map((header, idx) => (
                <th key={idx} className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedShops.map((shop, index) => (
              <tr key={shop._id} className="hover:bg-gray-100">
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.shopName}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  {shop.location} <br />
                  <a href={shop.mapLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Map Link
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  {shop.phone} <br />
                  <a href={`mailto:${shop.email}`} className="text-blue-500 hover:underline">
                    {shop.email}
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.franchiseType}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.partnership}</td>
                <td className="px-2 py-4 border-b border-gray-200 space-x-2 text-xs md:text-sm">
                  <button className="text-blue-500 hover:underline" onClick={() => handleView(shop)}>View</button>
                  <button className="text-green-500 hover:underline" onClick={() => handleEdit(shop)}><GrEdit /></button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(shop)}><MdDelete size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 mx-1 rounded ${currentPage === index + 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Confirmation Dialog */}
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
    </div>
  );
};

export default MyShop;
