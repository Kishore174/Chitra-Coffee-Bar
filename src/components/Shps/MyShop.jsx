import React, { useEffect, useState } from 'react';
import { FaEye, FaPlus, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { deleteShop, getAllShops, getShopByAuditor } from '../../API/shop';
import toast from 'react-hot-toast';
// import { LineWave } from 'react-loader-spinner';/ // Import the loader/
 
import Loader from '../Loader';
import { useAuth } from '../../context/AuthProvider';

const MyShop = () => {
  const [shops, setShops] = useState([]);
  const [shopToDelete, setShopToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set items per page
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const [filteredShops, setFilteredShops] = useState([]);
  const {user} = useAuth()
  useEffect(() => {
    setLoading(true);
    const getApi = user?.role === "super-admin" ? getAllShops : getShopByAuditor
    getApi()
      .then((res) => {
        setShops(res.data);
        setFilteredShops(res.data);
      })
      .catch((err) => {
        toast.error(`Error: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);  
      });
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
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const paginatedShops = filteredShops.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSearch = (e) => {
    const lowercasedTerm = e.target.value.toLowerCase() ;
    setFilteredShops(
      shops.filter((shop) =>
        Object.keys(shop).some((key) => 
          typeof shop[key] === 'string' && shop[key].toLowerCase().includes(lowercasedTerm)
        )
      )
    );
  };
  return (
    <div className=" max-w-screen-lg mx-auto  mt-2  min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">

        <h1 className="text-2xl md:text-2xl poppins-semibold mb-4  md:mb-0">My Shop</h1>
        <div className="relative w-full md:w-64">
      <input
        type="text"
        placeholder="Search shop..."
        className="w-full py-2 pr-4 text-sm border p-2 rounded-lg poppins-medium focus:outline-none focus:ring-1 focus:ring-red-400"
        onChange={handleSearch}
      />
      <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
    </div>
        <Link to="/addshop">
          <button className="bg-red-600 text-white rounded-lg poppins-semibold py-1 px-3 flex items-center">
            <FaPlus className="mr-2" /> Add Shop
          </button>
        </Link>
      </div>

   
      {loading ? (
        <Loader/>
      ) : (
        <>
          {/* Responsive Table for Desktop */}
          <div className='md:block hidden'>

          <table className="min-w-full  mt-4 bg-white border">


    <thead className="bg-red-600 whitespace-nowrap text-white">
      <tr>
        {['S.No', 'Shop Name', 'Location', 'Contact Details', 'Franchise Type', 'Property Type', 'Action'].map((header, idx) => (
          <th key={idx} className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-xs poppins-semibold uppercase tracking-wider">
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {paginatedShops.map((shop, index) => (
        <tr key={shop._id} className="hover:bg-gray-100 poppins-regular">
          <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
          <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
            <div>
              <Link to={shop._id}><p className='font-semibold'>{shop.shopName}</p></Link>
              <p>{shop.ownerName}</p>
            </div>
          </td>
          <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">  
            <div title={shop.address} className=' cursor-context-menu'>{shop?.address?.length > 15 
                        ? `${shop?.address.slice(0, 15)}...` 
                        : shop?.address}
            </div>
          
            <a href={shop.location} target="_blank" className="text-blue-500 cursor-pointer" rel="noopener noreferrer">
              Map Link
            </a>
          </td>
          <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
            {shop.phone} <br />
            <a href={`mailto:${shop.email}`} className="text-blue-500 lowercase hover:underline">
              {shop.email.slice(0,16)}...
            </a>
          </td>
          <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.franchiseType==="own" ? "Properties" : shop.franchiseType}</td>
          <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.propertyType}</td>
          <td className="px-2 py-4 border-b border-gray-200 space-x-2 text-xs whitespace-nowrap md:text-sm">
            {/* Eye Icon for "View" */}
            <button className="text-blue-500 hover:underline" onClick={() => handleView(shop)}>
            
              <FaEye/>
            </button>
            <button className="text-green-500 hover:underline" onClick={() => handleEdit(shop)}>
              <GrEdit />
            </button>
            <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(shop)}>
              <MdDelete size={20} />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          {/* Card Layout for Mobile and Tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden lg:hidden gap-4">
            {paginatedShops.map((shop, index) => (
              <div key={shop._id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold">{shop.shopName}</h3>
                <p><strong>Location:</strong> {shop.location}</p>
                <p><strong>Contact:</strong> {shop.phone} <br />
                  <a href={`mailto:${shop.email}`} className="text-blue-500 hover:underline">{shop.email}</a>
                </p>
                <p><strong>Franchise:</strong> {shop.franchiseType}</p>
                <p><strong>Partnership:</strong> {shop.partnership}</p>
                <div className="flex justify-between mt-2">
                  <button className="text-blue-500 hover:underline" onClick={() => handleView(shop)}>View</button>
                  <button className="text-green-500 hover:underline" onClick={() => handleEdit(shop)}><GrEdit /></button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(shop)}><MdDelete size={20} /></button>
                </div>
              </div>
            ))}
          </div>

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
            <div className ="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-50">
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
        </>
      )}
    </div>
  );
};

export default MyShop;