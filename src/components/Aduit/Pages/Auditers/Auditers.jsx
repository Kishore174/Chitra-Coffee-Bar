import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { deleteAuditor, getAllAuditors } from '../../../../API/auditor';
import toast from 'react-hot-toast';
 
import Loader from '../../../Loader';


const ITEMS_PER_PAGE = 5; // Set the number of items per page

const Auditers = () => {
const [loading, setLoading] = useState(true); // Loading state

  const [auditors, setAuditors] = useState([]);
  const [auditorToDelete, setAuditorToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const navigate = useNavigate();

  const handleEdit = (auditor) => {
    navigate('/add-Auditers', { state: { auditor, isEdit: true } });
  };

  const handleView = (auditor) => {
    navigate('/add-Auditers', { state: { auditor, isView: true } });
  };

  const confirmDelete = () => {
    if (auditorToDelete) {
      deleteAuditor(auditorToDelete._id)
        .then(() => {
          toast.success(`${auditorToDelete.name} has been deleted.`);
          setAuditors(auditors.filter((s) => s._id !== auditorToDelete._id));
          setAuditorToDelete(null);
        })
        .catch((err) => toast.error(`Error: ${err.message}`));
      setConfirmDialogOpen(false);
    }
  };

  const handleDeleteClick = (auditor) => {
    setAuditorToDelete(auditor);
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    getAllAuditors().then((res) => setAuditors(res.data)).finally(() => {
      setLoading(false);  
    });
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(auditors.length / ITEMS_PER_PAGE);

  // Get the auditors for the current page
  const currentAuditors = auditors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
 const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-end mb-4 md:mb-6">
        <Link to="/add-auditers">
          <button className="bg-red-600 text-white rounded-lg poppins-semibold py-1 px-3 flex items-center">
            <FaPlus className="mr-2" /> Add Auditer
          </button>
        </Link>
      </div>
      {loading ? (
      <Loader/>
      ) : (
<>
      <div className="hidden md:block mt-4">
        {/* Desktop View Table */}
        <table className="w-full bg-white border">
          <thead className="bg-red-600 text-white">
            <tr>
              {['S.No', 'Name', 'Location', 'Contact Details', 'Documents', 'Action'].map((header, idx) => (
                <th key={idx} className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentAuditors.map((auditor, index) => (
              <tr key={auditor.id} className="hover:bg-gray-100 poppins-regular capitalize">
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{auditor.name}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                <div>{auditor?.address?.length > 15 
                                  ? `${auditor?.address.slice(0, 15)}...` 
                                  : auditor?.address}
                            </div> <br />
                  <a href={auditor.mapLink} className="text-blue- 500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Map Link
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  {auditor.phone} <br />
                  <a href={`mailto:${auditor.email}`} className="text-blue-500 hover:underline">
                    {auditor.email}
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{auditor.documentType}</td>
                <td className="px-2 py-4 border-b border-gray-200 space-x-2 text-xs  md:text-sm">
                  <button className="text-blue-500 hover:underline" onClick={() => handleView(auditor)}>View</button>
                  <button className="text-green-500 hover:underline" onClick={() => handleEdit(auditor)}><GrEdit /></button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(auditor)}><MdDelete size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View Section */}
        <div className="lg:hidden md:hidden">
          {currentAuditors.map((auditor, index) => (
            <div key={auditor.id} className="bg-white mb-4 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">{auditor.name}</h2>
                <span className="text-sm text-gray-500">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
              </div>
              <div className="text-sm text-gray-700">
                <p><strong>Location:</strong>   <div>{auditor?.address?.length > 15 
                                  ? `${auditor?.address.slice(0, 15)}...` 
                                  : auditor?.address}
                            </div></p>
                <p><strong>Contact:</strong> {auditor.phone}</p>
                <p><strong>Email:</strong> <a href={`mailto:${auditor.email}`} className="text-blue-500 hover:underline">{auditor.email}</a></p>
                <p><strong>Document Type:</strong> {auditor.documentType}</p>
                <a href={auditor.mapLink} className="text-blue-500 hover:underline mt-2 block" target="_blank" rel="noopener noreferrer">
                  View on Map
                </a>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button className="text-blue-500 hover:underline" onClick={() => handleView(auditor)}>View</button>
                <button className="text-green-500 hover:underline" onClick={() => handleEdit(auditor)}><GrEdit /></button>
                <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(auditor)}><MdDelete size={20} /></button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
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
              <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this auditor?</h2>
              <div className="flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setConfirmDialogOpen(false)}>
                  Cancel
                </button>
                <button class Name="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
};

export default Auditers;