import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosintance } from "../../API/Api";
import { toast } from "react-hot-toast";
import { FaPlus, FaSearch, FaCommentDots, FaEye, FaEdit, FaTrashAlt, FaPaperclip, FaTimes, FaDownload } from 'react-icons/fa';
import Loader from "../Loader"; // Assuming Loader is at src/components/Loader

const ITEMS_PER_PAGE = 5;

const ComplaintManagement = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, complaintId: null });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axiosintance.get(`/complaints`);
      if (response.data.success) {
        setComplaints(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, complaintId: id });
  };

  const confirmDelete = async () => {
    const { complaintId } = deleteModal;
    try {
      const response = await axiosintance.delete(`/complaints/${complaintId}`);
      if (response.data.success) {
        toast.success("Complaint deleted successfully");
        fetchComplaints();
      }
    } catch (error) {
      toast.error("Failed to delete complaint");
    } finally {
      setDeleteModal({ isOpen: false, complaintId: null });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axiosintance.put(`/complaints/${id}`, { status: newStatus });
      if (response.data.success) {
        toast.success("Status updated successfully");
        setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const filteredComplaints = complaints.filter(comp => {
    const matchesSearch = comp.outlet?.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      comp.complaint?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.registeredBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    let matchesDate = true;
    if (startDate || endDate) {
      const compDate = new Date(comp.complaintDate);
      if (startDate) {
        matchesDate = matchesDate && compDate >= new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && compDate <= end;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const currentComplaints = filteredComplaints.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const handlePageChange = (page) => setCurrentPage(page);

  const tableHeaders = [
    '#', 'OUTLET', 'COMPLAINT', 'DATES', 'PERSONNEL', 'STATUS', 'CA/PA', 'REMARKS', 'ACTIONS'
  ];

  const exportToCSV = () => {
    try {
      const headers = [
        "S.No",
        "Outlet",
        "Complaint",
        "Complaint Date",
        "Target Date",
        "Actual Date",
        "Registered By",
        "Responsibility",
        "Status",
        "CA/PA",
        "Remarks"
      ];

      const rows = filteredComplaints.map((item, index) => {
        return [
          index + 1,
          item.outlet?.shopName || "N/A",
          item.complaint || "N/A",
          formatDate(item.complaintDate),
          formatDate(item.targetDate),
          formatDate(item.actualDate),
          item.registeredBy?.name || "N/A",
          item.responsibility?.name || "N/A",
          item.status || "Pending",
          item.caPa || "N/A",
          item.remarks || "N/A"
        ];
      });

      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Complaints_Report_${new Date().toISOString().split("T")[0]}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-white">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-[#da251d] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
            <FaCommentDots size={24} />
          </div>
          <div>
            <h1 className="text-2xl poppins-semibold text-gray-900 tracking-tight">Manage Complaints</h1>
            <p className="text-sm text-gray-500 poppins-regular mt-0.5">{filteredComplaints.length} complaints found</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-6 md:mt-0 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#da251d]"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-[#da251d]"
            />
          </div>
          <button 
            onClick={exportToCSV}
            disabled={filteredComplaints.length === 0}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-full md:w-auto ${
              filteredComplaints.length === 0 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
            }`}
          >
            <FaDownload /> Export CSV
          </button>
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search complaints..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#da251d] text-sm poppins-regular"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Desktop/Tablet View */}
          <div className="hidden md:block bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full w-full whitespace-nowrap">
                <thead className="bg-[#da251d] text-white">
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th key={idx} className={`px-6 py-4 text-left text-xs poppins-semibold uppercase tracking-wider ${idx === 0 ? 'rounded-tl-xl' : ''} ${idx === tableHeaders.length - 1 ? 'rounded-tr-xl' : ''}`}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentComplaints.map((item, index) => (
                    <tr key={item._id} className="hover:bg-red-50/40 transition-colors duration-150">
                      <td className="px-6 py-5 text-sm text-gray-500 poppins-regular">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm poppins-semibold text-gray-800">{item.outlet?.shopName || "-"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular truncate max-w-[200px]" title={item.complaint}>
                          {item.complaint}
                        </div>
                        {item.attachments && item.attachments.length > 0 && (
                          <div className="mt-2 flex space-x-2">
                            {item.attachments.map((url, idx) => (
                              <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:text-red-800 flex items-center gap-1" title="View Attachment">
                                <FaPaperclip size={14} />
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular">
                          <span className="font-semibold text-gray-800">Reg:</span> {formatDate(item.complaintDate)}
                        </div>
                        <div className="text-sm text-gray-600 poppins-regular mt-1">
                          <span className="font-semibold text-gray-800">Tgt:</span> {formatDate(item.targetDate)}
                        </div>
                        {item.actualDate && (
                          <div className="text-sm text-gray-600 poppins-regular mt-1">
                            <span className="font-semibold text-[#22C55E]">Act:</span> {formatDate(item.actualDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular">
                           <span className="font-semibold text-gray-800">Reg By:</span> {item.registeredBy?.name || "-"}
                        </div>
                        <div className="text-sm text-gray-600 poppins-regular mt-1">
                           <span className="font-semibold text-gray-800">Resp:</span> {item.responsibility?.name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <select 
                          value={item.status || "Pending"}
                          onChange={(e) => handleStatusChange(item._id, e.target.value)}
                          className={`px-3 py-1 pr-8 rounded-full text-xs poppins-semibold outline-none cursor-pointer border ${
                            item.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            item.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                            item.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            item.status === 'On Hold' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                            item.status === 'Closed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="On Hold">On Hold</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular truncate max-w-[150px]" title={item.caPa}>
                          {item.caPa || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 poppins-regular truncate max-w-[150px]" title={item.remarks}>
                          {item.remarks || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => setViewComplaint(item)} className="text-blue-600 hover:text-blue-800 transition-colors" title="View">
                            <FaEye size={16} />
                          </button>
                          <button onClick={() => navigate(`/edit-complaint/${item._id}`)} className="text-green-500 hover:text-green-700 transition-colors" title="Edit">
                            <FaEdit size={16} />
                          </button>
                          <button onClick={() => handleDelete(item._id)} className="text-[#da251d] hover:text-red-800 transition-colors" title="Delete">
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentComplaints.length === 0 && (
                    <tr>
                      <td colSpan={tableHeaders.length} className="px-6 py-8 text-center text-gray-500 poppins-regular">
                        No complaints match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View Section */}
          <div className="md:hidden space-y-4">
            {currentComplaints.map((item, index) => (
              <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="text-base poppins-semibold text-gray-800">{item.outlet?.shopName || "-"}</h2>
                    <span className="text-xs text-gray-500 poppins-regular">{formatDate(item.complaintDate)}</span>
                  </div>
                  <span className="text-sm text-gray-400 poppins-medium">#{ (currentPage - 1) * ITEMS_PER_PAGE + index + 1 }</span>
                </div>
                
                <div className="space-y-2 mt-4 text-sm">
                  <div>
                    <span className="text-gray-400 poppins-regular text-xs block mb-0.5">Complaint</span>
                    <p className="text-gray-700 poppins-medium">{item.complaint}</p>
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-2 flex space-x-2">
                        {item.attachments.map((url, idx) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:text-red-800 flex items-center gap-1 text-xs poppins-medium">
                            <FaPaperclip size={12} /> Attachment
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-50 flex justify-between">
                    <div>
                      <span className="text-gray-400 poppins-regular text-xs block mb-0.5">Reg By</span>
                      <p className="text-gray-700 poppins-medium">{item.registeredBy?.name || "-"}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 poppins-regular text-xs block mb-0.5">Resp</span>
                      <p className="text-gray-700 poppins-medium">{item.responsibility?.name || "-"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs poppins-medium">
                       Tgt: {formatDate(item.targetDate)}
                    </span>
                    <select 
                      value={item.status || "Pending"}
                      onChange={(e) => handleStatusChange(item._id, e.target.value)}
                      className={`px-2 py-1 pr-6 rounded-full text-[10px] poppins-semibold outline-none cursor-pointer border ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        item.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        item.status === 'On Hold' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        item.status === 'Closed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex space-x-4">
                    <button onClick={() => setViewComplaint(item)} className="text-blue-600">
                      <FaEye size={18} />
                    </button>
                    <button onClick={() => navigate(`/edit-complaint/${item._id}`)} className="text-green-500">
                      <FaEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-[#da251d]">
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentComplaints.length === 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 poppins-regular">
                No complaints match your search.
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
        </>
      )}

      {viewComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl poppins-semibold text-gray-800 flex items-center gap-2">
                <FaCommentDots className="text-[#da251d]" /> Complaint Details
              </h3>
              <button onClick={() => setViewComplaint(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto poppins-regular text-gray-700 space-y-4">
              <div><strong className="text-gray-900 block mb-1">Outlet:</strong> {viewComplaint.outlet?.shopName || "-"}</div>
              <div><strong className="text-gray-900 block mb-1">Complaint:</strong> {viewComplaint.complaint}</div>
              <div className="grid grid-cols-2 gap-4">
                <div><strong className="text-gray-900 block mb-1">Complaint Date:</strong> {formatDate(viewComplaint.complaintDate)}</div>
                <div><strong className="text-gray-900 block mb-1">Target Date:</strong> {formatDate(viewComplaint.targetDate)}</div>
                <div><strong className="text-gray-900 block mb-1">Registered By:</strong> {viewComplaint.registeredBy?.name || "-"}</div>
                <div><strong className="text-gray-900 block mb-1">Responsibility:</strong> {viewComplaint.responsibility?.name || "-"}</div>
                {viewComplaint.actualDate && <div><strong className="text-[#22C55E] block mb-1">Actual Date:</strong> {formatDate(viewComplaint.actualDate)}</div>}
                <div><strong className="text-gray-900 block mb-1">Status:</strong> 
                  <span className={`px-2 py-1 rounded-full text-xs poppins-semibold ${
                      viewComplaint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      viewComplaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      viewComplaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      viewComplaint.status === 'On Hold' ? 'bg-orange-100 text-orange-800' :
                      viewComplaint.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {viewComplaint.status || "Pending"}
                  </span>
                </div>
              </div>
              {viewComplaint.caPa && <div><strong className="text-gray-900 block mb-1">CA/PA:</strong> {viewComplaint.caPa}</div>}
              {viewComplaint.remarks && <div><strong className="text-gray-900 block mb-1">Remarks:</strong> {viewComplaint.remarks}</div>}
              
              {viewComplaint.attachments && viewComplaint.attachments.length > 0 && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <strong className="text-gray-900 block mb-2">Attachments:</strong>
                  <div className="flex flex-wrap gap-2">
                    {viewComplaint.attachments.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm poppins-medium hover:bg-red-100 transition-colors">
                        <FaPaperclip size={12} /> View File {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setViewComplaint(null)} className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors poppins-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden p-6 text-center transform transition-all scale-100 opacity-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <FaTrashAlt className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Complaint</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this complaint? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, complaintId: null })}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 rounded-xl text-white font-medium hover:bg-red-700 shadow-md shadow-red-500/30 transition-all hover:-translate-y-0.5"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;
