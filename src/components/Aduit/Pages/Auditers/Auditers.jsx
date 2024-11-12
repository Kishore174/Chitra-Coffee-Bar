import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { EyeIcon } from '@heroicons/react/24/outline';
import { BsEye } from 'react-icons/bs';
import { deleteAuditor, getAllAuditors, getAllRoutes } from '../../../../API/auditor';
import SetRoutes from '../Setting/SetRoutes';
import toast from 'react-hot-toast';
const Auditers = () => {
  const [auditors, setauditors] = useState([]);
  const [auditorToDelete, setAuditorToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleEdit = ( auditor) => {
    navigate('/add-Auditers', { state: {   auditor, isEdit: true } });
  };

  const handleView = (auditor) => {
    navigate('/add-Auditers', { state: {  auditor, isView: true } });
  };
  const confirmDelete = () => {
    if (auditorToDelete) {
      deleteAuditor(auditorToDelete._id)
        .then(() => {
          toast.success(`${auditorToDelete.name} has been deleted.`);
          setauditors(auditors.filter((s) => s._id !== auditorToDelete._id));
          setAuditorToDelete(null); // Clear the selected shop
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
    getAllAuditors().then((res) => setauditors(res.data));
  }, []);
  return (
    <div className="p-4 md:p-6 min-h-screen">
 
      <div className="flex flex-col md:flex-row items-start md:items-center justify-end mb-4 md:mb-6">
        <Link to="/add-Auditers">
        <button className="bg-red-600 text-white rounded-lg poppins-semibold py-1 px-3 flex items-center">
            {/* <FaPlus className="mr-2" /> */}
            Add Auditer
          </button>
        </Link>
      </div>

 
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full bg-white border hidden lg:table">
          <thead className="bg-red-600 text-white">
            <tr>
              {['S.No', 'Name', 'Location', 'Contact Details', 'Documents',  'Action'].map((header, idx) => (
                <th key={idx} className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditors.map(( auditor, index) => (
              <tr key={ auditor.id} className="hover:bg-gray-100">
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{index + 1}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{ auditor.name}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  { auditor.address} <br />
                  <a href={ auditor.mapLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Map Link
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  { auditor.phone} <br />
                  <a href={`mailto:${ auditor.email}`} className="text-blue-500 hover:underline">
                    { auditor.email}
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{ auditor.documentType}</td>
                <td className="px-2 py-4 border-b border-gray-200 space-x-2 text-xs md:text-sm">
                  <button className="text-blue-500 hover:underline" onClick={() => handleView( auditor)}>View</button>
                  <button className="text-green-500 hover:underline" onClick={() => handleEdit( auditor)}><GrEdit /></button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick( auditor)}><MdDelete size={20} /></button>
                </td>
              </tr>
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
          </tbody>
        </table>

        {/* Mobile View Section */}
        <div className="lg:hidden">
          {auditors.map((shop, index) => (
            <div key={shop.id} className="bg-white mb-4 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">{shop.name}</h2>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className="text-sm text-gray-700">
                <p><strong>Location:</strong> {shop.address}</p>
                <p><strong>Contact:</strong> {shop.phone}</p>
                <p><strong>Email:</strong> <a href={`mailto:${shop.email}`} className="text-blue-500 hover:underline">{shop.email}</a></p>
                <p><strong>Franchise Name:</strong> {shop.franchise}</p>
                <p><strong>Partnership:</strong> {shop.partnership}</p>
                <a href={shop.mapLink} className="text-blue-500 hover:underline mt-2 block" target="_blank" rel="noopener noreferrer">
                  View on Map
                </a>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button className="text-blue-500 hover:underline">View</button>
                <button className="text-green-500 hover:underline"><GrEdit /></button>
                <button className="text-red-500 hover:underline"><MdDelete size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Auditers