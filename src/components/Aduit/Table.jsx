import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight, BsTrash } from "react-icons/bs";
import { FaClipboardCheck, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaEye, FaTrashAlt, FaStar, FaHistory } from "react-icons/fa";
import { assignAuditorsAudit, assignAuditRoute, getAllAudits, getAuditByAuditor } from "../../API/audits";
import { getAuditDataV2, getAuditByAuditorV2 } from "../../API/auditV2";
import { getRoutesByAuditor } from "../../API/createRoute"
import { ScaleLoader } from "react-spinners";
import { useAuth } from "../../context/AuthProvider";
import { auditAssign, deleteAudit } from "../../API/employee";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { formatTime, calculateDuration, formatDuration } from "../../utils/tool";

const daysOfWeek = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Table = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [audits, setAudits] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routes, setRoutes] = useState([])
  const [showOldAudits, setShowOldAudits] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState(null);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const currentWeekDates = Array(7)
    .fill()
    .map((_, index) => {
      return dayjs()
        .startOf("week")
        .add(index, "day");
    });

  const filteredAudits = audits.filter((audit) => {
    return dayjs(audit.auditDate).isSame(selectedDate, "day");
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      if (showOldAudits) {
        if (user.role === "super-admin") {
          getAllAudits({date : selectedDate.format("YYYY-MM-DD")})
            .then((res) => setAudits(res.data))
            .finally(() => setLoading(false));
        } else {
          getAuditByAuditor(user._id,{date : selectedDate.format("YYYY-MM-DD")})
            .then((res) => setAudits(res.data))
            .finally(() => setLoading(false));
        }
      } else {
        if (user.role === "super-admin") {
          getAuditDataV2({date : selectedDate.format("YYYY-MM-DD")})
            .then((res) => setAudits(res.data))
            .finally(() => setLoading(false));
        } else {
          getAuditByAuditorV2(user._id,{date : selectedDate.format("YYYY-MM-DD")})
            .then((res) => setAudits(res.data))
            .finally(() => setLoading(false));
        }
      }
    }
  }, [selectedDate, showOldAudits, user]);

  useEffect(() => {
    getRoutesByAuditor(user?._id).then(res => {
      setRoutes(res.data)
    }).catch(err => {
      console.log(err)
    })
  }, [user])

  const handleToAsign = () => {
    auditAssign()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  const handleDeleteClick = (audit) => {
    setAuditToDelete(audit);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (auditToDelete) {
      deleteAudit(auditToDelete._id)
        .then((res) => {
          toast.success(res.message);
          setAudits(audits.filter(a => a._id !== auditToDelete._id));
          setAuditToDelete(null);
          setConfirmDialogOpen(false);
        })
        .catch((err) => {
          toast.error(err.response?.data?.message);
          setConfirmDialogOpen(false);
        });
    }
  };

  const handleToAsignAuditor = () => {
    assignAuditorsAudit(selectedRoute)
      .then((res) => {
        toast.success(res.message);
        setLoading(true)
        setSelectedRoute(null)
        if (user) {
            getAuditByAuditor(user._id)
              .then((res) => setAudits(res.data))
              .finally(() => {
                setLoading(false);
              });
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-white">
      
      {/* Calendar Area */}
      <div className="flex justify-center w-full mb-8">
        <div className="flex items-center space-x-1 sm:space-x-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 overflow-x-auto shadow-sm">
          {currentWeekDates.map((date, index) => {
            const isSelected = selectedDate.isSame(date, "day");
            return (
              <button
                key={index}
                className={`flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px] py-2 px-1 rounded-xl transition-all duration-200 ${
                  isSelected ? "bg-[#da251d] text-white shadow-lg shadow-red-500/30 transform scale-105" : "bg-transparent text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => handleDateClick(date)}
              >
                <span className={`text-xs poppins-medium ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>{daysOfWeek[date.day()]}</span>
                <span className="text-lg poppins-bold mt-0.5">{date.format("D")}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Header Area */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-[#da251d] text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
            <FaClipboardCheck size={24} />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl poppins-semibold text-gray-900 tracking-tight">
                {showOldAudits ? "Old Audits" : "My Audit V2"}
              </h1>
              <button
                className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg poppins-medium py-1.5 px-3 border border-gray-200 text-xs transition-colors"
                onClick={() => setShowOldAudits(!showOldAudits)}
              >
                <FaHistory className="mr-1.5" />
                {showOldAudits ? "Show V2" : "Show Old"}
              </button>
            </div>
            <p className="text-sm text-gray-500 poppins-regular mt-0.5">{audits.length} audits scheduled for {selectedDate.format("MMM D, YYYY")}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6 md:mt-0 w-full md:w-auto bg-gray-50 p-2 rounded-xl border border-gray-100">
          <label htmlFor="route" className="text-sm poppins-medium text-gray-600 ml-2">Route</label>
          <select 
            onChange={(e)=>setSelectedRoute(e.target.value)} 
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm poppins-regular focus:outline-none focus:border-[#da251d] min-w-[120px]"
          >
            <option value=""> - Select - </option>
            {routes && routes.map(route=>(
              <option key={route._id} value={route._id}>{route.name}</option>
            ))}
          </select>
          {selectedRoute && (
            <button
              className="bg-[#da251d] hover:bg-red-700 text-white rounded-lg poppins-medium py-2 px-4 transition-colors text-sm shadow-sm whitespace-nowrap"
              onClick={handleToAsignAuditor}
            >
             {audits.length === 0 ? "Schedule" : "Re-schedule"}
            </button>
          )}
        </div>
      </div>

      {loading ? (
         <Loader/>
      ) : (
        <>
          {/* Desktop/Tablet View */}
          <div className="hidden md:block bg-white rounded-xl shadow-[0_2px_10px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full w-full whitespace-nowrap">
                <thead className="bg-[#da251d] text-white">
                  <tr>
                    <th className="px-6 py-4 border-b-0 text-left text-xs poppins-semibold uppercase tracking-wider rounded-tl-xl">S.No</th>
                    <th className="px-6 py-4 border-b-0 text-left text-xs poppins-semibold uppercase tracking-wider">Shop Details</th>
                    {user?.role === "super-admin" && (
                      <th className="px-6 py-4 border-b-0 text-left text-xs poppins-semibold uppercase tracking-wider">Auditor</th>
                    )}
                    <th className="px-6 py-4 border-b-0 text-left text-xs poppins-semibold uppercase tracking-wider">Audit Status</th>
                    <th className="px-6 py-4 border-b-0 text-left text-xs poppins-semibold uppercase tracking-wider">Contact Details</th>
                    <th className="px-6 py-4 border-b-0 text-left text-xs poppins-semibold uppercase tracking-wider rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {audits.length > 0 ? (
                    audits.map((audit, index) => (
                      <tr key={audit._id || index} className="hover:bg-red-50/40 transition-colors duration-150">
                        <td className="px-6 py-5 text-sm text-gray-500 poppins-regular">
                          {index + 1}
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm poppins-semibold text-gray-800">{audit.shop?.shopName}</div>
                          <div className="text-xs text-gray-400 poppins-regular mt-0.5">{audit.shop?.ownerName}</div>
                          <div className="flex items-start mt-2">
                            <FaMapMarkerAlt className="text-red-400 mr-1.5 mt-0.5 flex-shrink-0" size={12} />
                            <div>
                              <div className="text-xs text-gray-600 poppins-regular truncate max-w-[200px]" title={audit.shop?.address}>
                                {audit.shop?.address?.length > 25 ? `${audit.shop?.address.slice(0, 25)}...` : (audit.shop?.address || 'N/A')}
                              </div>
                              {audit.location && (
                                <a href={audit.location} className="text-[#da251d] hover:underline text-[11px] poppins-medium mt-0.5 inline-block" target="_blank" rel="noopener noreferrer">
                                  View map &rarr;
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        {user?.role === "super-admin" && (
                          <td className="px-6 py-5">
                            <div className="text-sm text-gray-800 poppins-semibold">{audit.auditor?.name || 'N/A'}</div>
                            <div className="flex items-center text-xs text-gray-500 poppins-regular mt-1">
                              <FaPhoneAlt className="mr-1.5 text-gray-400" size={10} />
                              {audit.auditor?.phone || 'N/A'}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 poppins-regular mt-0.5">
                              <FaEnvelope className="mr-1.5 text-gray-400" size={10} />
                              <span className="truncate max-w-[150px]">{audit.auditor?.email || 'N/A'}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-start space-y-2">
                            {audit.status?.toLowerCase() === "completed" ? (
                              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs poppins-semibold border border-green-200">
                                COMPLETED
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs poppins-semibold border border-red-200">
                                {audit.status?.toUpperCase() || 'PENDING'}
                              </span>
                            )}
                            
                            {audit.status?.toLowerCase() === "completed" && (
                              <div className="flex items-center text-yellow-500 text-xs poppins-semibold ml-1">
                                <FaStar className="mr-1" /> {(audit.overallRating || audit.rating || 0).toFixed(1)}
                              </div>
                            )}

                            {user?.role === "super-admin" && audit.inTime && (
                              <div className="flex flex-col text-[11px] text-gray-500 poppins-medium bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                <span className="mb-0.5">In: {formatTime(audit.inTime)}</span>
                                {audit.outTime && <span>Out: {formatTime(audit.outTime)}</span>}
                                {audit.outTime && (
                                  <span className="text-blue-600 mt-1 poppins-semibold">
                                    Duration: {formatDuration(calculateDuration(audit.inTime, audit.outTime))}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-600 poppins-regular">{audit.shop?.phone || 'N/A'}</div>
                          {audit.shop?.email && (
                            <a href={`mailto:${audit.shop?.email}`} className="text-[#da251d] hover:underline text-xs poppins-regular mt-1 block truncate max-w-[150px]">
                              {audit.shop?.email}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            {audit.status !== "completed" && user?.role !== "super-admin" ? (
                              <Link to={showOldAudits ? `/add-audit/${audit._id}` : `/perform-audit/${audit._id}`}>
                                <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Perform Audit">
                                  <BsArrowRight size={18} />
                                </button>
                              </Link>
                            ) : (
                              <Link to={showOldAudits ? `/report/${audit?._id}` : `/report-v2/${audit?._id}`}>
                                <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm poppins-medium" title="View Report">
                                  <FaEye className="mr-1.5" size={16} /> View
                                </button>
                              </Link>
                            )}
                            {user?.role === "super-admin" && (
                              <button 
                                className="text-red-500 hover:text-red-700 transition-colors p-1" 
                                onClick={() => handleDeleteClick(audit)}
                                title="Delete Audit"
                              >
                                <FaTrashAlt size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={user?.role === "super-admin" ? 6 : 5} className="px-6 py-8 text-center text-gray-500 poppins-regular">
                        No audits available for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile View Section */}
          <div className="md:hidden space-y-4 mt-6">
            {audits.length > 0 ? (
              audits.map((audit, index) => (
                <div key={audit._id || index} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#da251d]"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-base poppins-semibold text-gray-800">{audit.shop?.shopName}</h2>
                      <span className="text-xs text-gray-500 poppins-regular capitalize">{audit.shop?.ownerName}</span>
                    </div>
                    {audit.status?.toLowerCase() === "completed" ? (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] poppins-semibold border border-green-200">COMPLETED</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-[10px] poppins-semibold border border-red-200">{audit.status?.toUpperCase() || 'PENDING'}</span>
                    )}
                  </div>
                  
                  <div className="space-y-2 mt-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div>
                      <span className="text-gray-400 poppins-regular text-[10px] uppercase tracking-wider block mb-0.5">Location</span>
                      <p className="text-gray-700 poppins-medium text-xs">{audit.shop?.address || 'N/A'}</p>
                      {audit.location && (
                        <a href={audit.location} className="text-[#da251d] hover:underline text-[11px] poppins-medium mt-0.5 inline-block" target="_blank" rel="noopener noreferrer">View map &rarr;</a>
                      )}
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-gray-400 poppins-regular text-[10px] uppercase tracking-wider block mb-0.5">Contact</span>
                      <p className="text-gray-700 poppins-medium text-xs">{audit.shop?.phone || 'N/A'}</p>
                      {audit.shop?.email && (
                        <a href={`mailto:${audit.shop?.email}`} className="text-[#da251d] hover:underline text-xs poppins-medium block truncate mt-0.5">{audit.shop?.email}</a>
                      )}
                    </div>
                    {user?.role === "super-admin" && audit.auditor && (
                       <div className="pt-2 border-t border-gray-100">
                         <span className="text-gray-400 poppins-regular text-[10px] uppercase tracking-wider block mb-0.5">Auditor</span>
                         <p className="text-gray-700 poppins-medium text-xs">{audit.auditor?.name}</p>
                       </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div>
                      {audit.status?.toLowerCase() === "completed" && (
                        <div className="flex items-center text-yellow-500 text-sm poppins-semibold">
                          <FaStar className="mr-1" /> {(audit.overallRating || audit.rating || 0).toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      {audit.status !== "completed" && user?.role !== "super-admin" ? (
                        <Link to={showOldAudits ? `/add-audit/${audit._id}` : `/perform-audit/${audit._id}`}>
                          <button className="flex items-center px-3 py-1.5 rounded-lg bg-[#da251d] text-white hover:bg-red-700 transition-colors text-xs poppins-medium shadow-sm">
                            Perform <BsArrowRight className="ml-1.5" />
                          </button>
                        </Link>
                      ) : (
                        <Link to={showOldAudits ? `/report/${audit?._id}` : `/report-v2/${audit?._id}`}>
                          <button className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-xs poppins-medium">
                            <FaEye className="mr-1.5" /> View
                          </button>
                        </Link>
                      )}
                      {user?.role === "super-admin" && (
                        <button className="text-red-500 bg-red-50 p-1.5 rounded-lg hover:bg-red-100" onClick={() => handleDeleteClick(audit)}>
                          <FaTrashAlt size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center text-gray-500 poppins-regular text-sm">
                No audits available for this date.
              </div>
            )}
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      {isConfirmDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
              <BsTrash className="text-red-600 text-xl" />
            </div>
            <h2 className="text-lg poppins-semibold text-center text-gray-900 mb-2">Delete Audit</h2>
            <p className="text-sm text-gray-500 text-center mb-6 poppins-regular">
              Are you sure you want to delete the audit for <strong>{auditToDelete?.shop?.shopName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <button 
                className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 poppins-medium transition-colors text-sm w-full" 
                onClick={() => { setConfirmDialogOpen(false); setAuditToDelete(null); }}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 bg-[#da251d] text-white rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/30 poppins-medium transition-colors text-sm w-full" 
                onClick={confirmDelete}
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

export default Table;
