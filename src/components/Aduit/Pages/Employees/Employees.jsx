import React, { useEffect, useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrashAlt, FaUsers, FaSearch, FaKey } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEmployee, getAllEmployees, resetEmployeePassword } from '../../../../API/employee';
import toast from 'react-hot-toast';
import Loader from '../../../Loader';

const ITEMS_PER_PAGE = 5;

const Employees = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);
  const [employeeToReset, setEmployeeToReset] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleResetClick = (employee) => {
    setEmployeeToReset(employee);
    setNewPassword('');
    setResetModalOpen(true);
  };

  const submitResetPassword = () => {
    if (!newPassword.trim()) {
      toast.error('Please enter a new password');
      return;
    }
    resetEmployeePassword(employeeToReset._id, newPassword)
      .then(() => {
        toast.success(`Password for ${employeeToReset.name} has been reset.`);
        setResetModalOpen(false);
        setEmployeeToReset(null);
      })
      .catch((err) => toast.error(`Error: ${err.message}`));
  };

  useEffect(() => {
    getAllEmployees().then((res) => setEmployees(res.data)).finally(() => {
      setLoading(false);  
    });
  }, []);

  const filteredEmployees = employees.filter(emp => 
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const currentEmployees = filteredEmployees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="p-4 md:p-8 min-h-screen bg-white">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-[#da251d] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
            <FaUsers size={24} />
          </div>
          <div>
            <h1 className="text-2xl poppins-semibold text-gray-900 tracking-tight">Employees</h1>
            <p className="text-sm text-gray-500 poppins-regular mt-0.5">{filteredEmployees.length} employees found</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-6 md:mt-0 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#da251d] text-sm poppins-regular"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          <Link to="/add-employees" className="w-full md:w-auto whitespace-nowrap">
            <button className="w-full bg-[#da251d] hover:bg-red-700 text-white rounded-lg poppins-medium py-2 px-5 flex items-center justify-center transition-colors">
              <FaPlus className="mr-2" /> 
              Add Employee
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader/>
      ) : (
        <>
          {/* Desktop/Tablet View */}
          <div className="hidden md:block bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full w-full whitespace-nowrap">
                <thead className="bg-[#da251d] text-white">
                  <tr>
                    {['#', 'EMPLOYEE', 'LOCATION', 'CONTACT', 'TIMING', 'ACTIONS'].map((header, idx) => (
                      <th key={idx} className={`px-6 py-4 text-left text-xs poppins-semibold uppercase tracking-wider ${idx === 0 ? 'rounded-tl-xl' : ''} ${idx === 5 ? 'rounded-tr-xl' : ''}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentEmployees.map((employee, index) => (
                    <tr key={employee._id || index} className="hover:bg-red-50/40 transition-colors duration-150">
                      <td className="px-6 py-5 text-sm text-gray-500 poppins-regular">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm poppins-semibold text-gray-800">{employee.name}</div>
                        <div className="text-xs text-gray-400 poppins-regular mt-1 capitalize">{employee.role || 'Staff'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular truncate max-w-[200px]" title={employee?.address}>
                          {employee?.address || 'N/A'}
                        </div>
                        {employee.mapLink && (
                          <a href={employee.mapLink} className="text-[#da251d] hover:underline text-xs poppins-medium mt-1 inline-block" target="_blank" rel="noopener noreferrer">
                            View map &rarr;
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular">{employee.phone || 'N/A'}</div>
                        <a href={`mailto:${employee.email}`} className="text-[#da251d] hover:underline text-xs poppins-regular mt-1 block truncate max-w-[180px]">
                          {employee.email || 'N/A'}
                        </a>
                      </td>

                      <td className="px-6 py-5">
                        <div className="text-sm poppins-medium text-gray-700 whitespace-nowrap">
                          {employee.shiftStartTime || "09:00"} - {employee.shiftEndTime || "18:00"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => handleView(employee)} className="text-blue-600 hover:text-blue-800 transition-colors" title="View">
                            <FaEye size={16} />
                          </button>
                          <button onClick={() => handleEdit(employee)} className="text-green-500 hover:text-green-700 transition-colors" title="Edit">
                            <FaEdit size={16} />
                          </button>
                          <button onClick={() => handleResetClick(employee)} className="text-yellow-500 hover:text-yellow-700 transition-colors" title="Reset Password">
                            <FaKey size={16} />
                          </button>
                          <button onClick={() => handleDeleteClick(employee)} className="text-[#da251d] hover:text-red-800 transition-colors" title="Delete">
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentEmployees.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 poppins-regular">
                        No employees match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View Section (keeping it clean for mobile too) */}
          <div className="md:hidden space-y-4">
            {currentEmployees.map((employee, index) => (
              <div key={employee._id || index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-base poppins-semibold text-gray-800">{employee.name}</h2>
                    <span className="text-xs text-gray-500 poppins-regular capitalize">{employee.role || 'Staff'}</span>
                  </div>
                  <span className="text-sm text-gray-400 poppins-medium">#{ (currentPage - 1) * ITEMS_PER_PAGE + index + 1 }</span>
                </div>
                
                <div className="space-y-2 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400 poppins-regular text-xs block mb-0.5">Location</span>
                    <p className="text-gray-700 poppins-medium">{employee?.address || 'N/A'}</p>
                    {employee.mapLink && (
                      <a href={employee.mapLink} className="text-[#da251d] hover:underline text-xs poppins-medium mt-0.5 inline-block" target="_blank" rel="noopener noreferrer">View map &rarr;</a>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                    <span className="text-gray-400 poppins-regular text-xs block mb-0.5">Contact</span>
                    <p className="text-gray-700 poppins-medium">{employee.phone || 'N/A'}</p>
                    <a href={`mailto:${employee.email}`} className="text-[#da251d] hover:underline text-xs poppins-medium block truncate">{employee.email || 'N/A'}</a>
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 poppins-regular text-xs block mb-0.5">Timing</span>
                      <p className="text-gray-700 poppins-medium">{employee.shiftStartTime || "09:00"} - {employee.shiftEndTime || "18:00"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end items-center mt-5 pt-4 border-t border-gray-100">
                  <div className="flex space-x-4">
                    <button className="text-blue-600" onClick={() => handleView(employee)}>
                      <FaEye size={18} />
                    </button>
                    <button className="text-green-500" onClick={() => handleEdit(employee)}>
                      <FaEdit size={18} />
                    </button>
                    <button className="text-yellow-500" onClick={() => handleResetClick(employee)}>
                      <FaKey size={18} />
                    </button>
                    <button className="text-[#da251d]" onClick={() => handleDeleteClick(employee)}>
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentEmployees.length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 poppins-regular">
                No employees match your search.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-lg poppins-medium text-sm transition-colors flex items-center justify-center ${
                    currentPage === index + 1 
                      ? 'bg-[#da251d] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          {/* Confirmation Dialog */}
          {isConfirmDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
              <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                <h2 className="text-lg poppins-semibold text-gray-800 mb-2">Delete Employee</h2>
                <p className="text-sm text-gray-600 mb-6 poppins-regular">
                  Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 poppins-medium transition-colors text-sm" 
                    onClick={() => setConfirmDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-[#da251d] text-white rounded-lg hover:bg-red-700 shadow-sm poppins-medium transition-colors text-sm" 
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reset Password Modal */}
          {isResetModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4">
              <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                <h2 className="text-lg poppins-semibold text-gray-800 mb-2">Reset Password</h2>
                <p className="text-sm text-gray-600 mb-4 poppins-regular">
                  Enter a new password for <strong>{employeeToReset?.name}</strong>.
                </p>
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="New Password"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#da251d] text-sm poppins-regular"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 poppins-medium transition-colors text-sm" 
                    onClick={() => {
                      setResetModalOpen(false);
                      setNewPassword('');
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 shadow-sm poppins-medium transition-colors text-sm" 
                    onClick={submitResetPassword}
                  >
                    Reset
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

export default Employees;