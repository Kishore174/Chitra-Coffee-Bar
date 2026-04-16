import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { GrEdit } from 'react-icons/gr';
import { MdDelete } from 'react-icons/md';
import { deleteEmployee, getAllEmployees } from '../../../../API/employee';
import toast from 'react-hot-toast';
  
import Loader from '../../../Loader';


const ITEMS_PER_PAGE = 5; // Set the number of items per page

const Employees = () => {
const [loading, setLoading] = useState(true); // Loading state

  const [employees, setEmployees] = useState([]);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const navigate = useNavigate();

  const handleEdit = (employee) => {
    navigate('/add-employees', { state: { employee, isEdit: true } });
  };

  const handleView = (employee) => {
    navigate('/add-employees', { state: { employee, isView: true } });
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete._id)
        .then(() => {
          toast.success(`${employeeToDelete.name} has been deleted.`);
          setEmployees(employees.filter((s) => s._id !== employeeToDelete._id));
          setEmployeeToDelete(null);
        })
        .catch((err) => toast.error(`Error: ${err.message}`));
      setConfirmDialogOpen(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setConfirmDialogOpen(true);
  };

  useEffect(() => {
    getAllEmployees().then((res) => setEmployees(res.data)).finally(() => {
      setLoading(false);  
    });
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(employees.length / ITEMS_PER_PAGE);

  // Get the employees for the current page
  const currentEmployees = employees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
 const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
      <h1 className="text-2xl md:text-3xl poppins-semibold mb-4  md:mb-0">Employees</h1>

        <Link to="/add-employees">
          <button className="bg-red-600 text-white rounded-md  poppins-semibold py-1 px-3 flex items-center">
            <FaPlus className="mr-2" /> Add Employee
          </button>
        </Link>
      </div>
      {loading ? (
      <Loader/>
      ) : (
<>
      <div className=" ">
         <div className='md:block hidden'>
        <table className="min-w-full  mt-4 bg-white border">
          <thead className="bg-red-600 text-white w-full">
            <tr>
              {['S.No', 'Name', 'Location', 'Contact Details', 'Documents', 'Action'].map((header, idx) => (
                <th key={idx} className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm poppins-semibold uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='w-full'>
            {currentEmployees.map((employee, index) => (
              <tr key={employee.id} className="hover:bg-gray-100 poppins-regular ">
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{employee.name}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                <div>{employee?.address?.length > 15 
                                  ? `${employee?.address.slice(0, 15)}...` 
                                  : employee?.address}
                            </div> <br />
                  <a href={employee.mapLink} className="text-blue- 500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Map Link
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  {employee.phone} <br />
                  <a href={`mailto:${employee.email}`} className="text-blue-500 hover:underline">
                    {employee.email}
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{employee.documentType}</td>
                <td className="px-2 py-4 border-b border-gray-200 space-x-2 text-xs  md:text-sm">
                  <button className="text-blue-500 hover:underline" onClick={() => handleView(employee)}>View</button>
                  <button className="text-green-500 hover:underline" onClick={() => handleEdit(employee)}><GrEdit /></button>
                  <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(employee)}><MdDelete size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* Mobile View Section */}
        <div className="lg:hidden md:hidden">
          {currentEmployees.map((employee, index) => (
            <div key={employee.id} className="bg-white mb-4 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">{employee.name}</h2>
                <span className="text-sm text-gray-500">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
              </div>
              <div className="text-sm text-gray-700">
                <p><strong>Location:</strong>   <div>{employee?.address?.length > 15 
                                  ? `${employee?.address.slice(0, 15)}...` 
                                  : employee?.address}
                            </div></p>
                <p><strong>Contact:</strong> {employee.phone}</p>
                <p><strong>Email:</strong> <a href={`mailto:${employee.email}`} className="text-blue-500 hover:underline">{employee.email}</a></p>
                <p><strong>Document Type:</strong> {employee.documentType}</p>
                <a href={employee.mapLink} className="text-blue-500 hover:underline mt-2 block" target="_blank" rel="noopener noreferrer">
                  View on Map
                </a>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button className="text-blue-500 hover:underline" onClick={() => handleView(employee)}>View</button>
                <button className="text-green-500 hover:underline" onClick={() => handleEdit(employee)}><GrEdit /></button>
                <button className="text-red-500 hover:underline" onClick={() => handleDeleteClick(employee)}><MdDelete size={20} /></button>
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
              <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this employee?</h2>
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

export default Employees;