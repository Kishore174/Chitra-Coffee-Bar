import React, { useState, useEffect, useCallback, useRef } from "react";
import { getAllLeaveRequests, updateLeaveStatus } from "../../API/leaveRequest";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FaCheck, FaTimes, FaCalendarAlt, FaFilter, FaBell } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [remarksMap, setRemarksMap] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [newLeaveAlert, setNewLeaveAlert] = useState(null);
  const prevLeavesRef = useRef(new Set());

  const fetchLeaveRequests = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const res = await getAllLeaveRequests(filterStatus, startDate, endDate);
      const fetchedLeaves = res.data || [];
      
      if (isBackground) {
        // Find if there is any new pending leave
        const newPending = fetchedLeaves.find(leave => leave.status === 'pending' && !prevLeavesRef.current.has(leave._id));
        if (newPending) {
            setNewLeaveAlert(newPending);
        }
      }

      prevLeavesRef.current = new Set(fetchedLeaves.map(l => l._id));
      setLeaveRequests(fetchedLeaves);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [filterStatus, startDate, endDate]);

  useEffect(() => {
    fetchLeaveRequests();
    const interval = setInterval(() => {
      fetchLeaveRequests(true);
    }, 10000); // Poll every 10 seconds for new leaves
    return () => clearInterval(interval);
  }, [fetchLeaveRequests]);

  const handleStatusUpdate = async (leaveId, status) => {
    try {
      const res = await updateLeaveStatus(leaveId, {
        status,
        adminRemarks: remarksMap[leaveId] || "",
      });
      toast.success(res.message);
      setSelectedLeave(null);
      fetchLeaveRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getLeaveTypeBadge = (type) => {
    const styles = {
      sick: "bg-red-50 text-red-600",
      casual: "bg-blue-50 text-blue-600",
      personal: "bg-purple-50 text-purple-600",
      emergency: "bg-orange-50 text-orange-600",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${styles[type]}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-8 h-full w-full flex flex-col overflow-hidden bg-white poppins-regular">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 flex-shrink-0">
        <h1 className="text-2xl poppins-semibold flex items-center gap-2">
          <FaCalendarAlt className="text-red-500" /> Leave Management
        </h1>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">Select Date Range (Leave Applied / Overlapping)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <span className="text-gray-500 font-semibold px-1">to</span>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <button
                onClick={() => { setStartDate(dayjs().startOf('month').format("YYYY-MM-DD")); setEndDate(dayjs().format("YYYY-MM-DD")); }}
                className="text-sm text-red-500 hover:underline poppins-medium ml-1"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 flex-1 overflow-auto">
        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <div
                key={leave._id}
                className={`border rounded-lg p-4 hover:shadow-sm transition ${leave.status === "pending" ? "cursor-pointer hover:border-red-300" : ""}`}
                onClick={() => leave.status === "pending" && setSelectedLeave(leave)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={leave.auditor?.profile || "/default-avatar.png"}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      <span className="poppins-semibold">{leave.auditor?.name}</span>
                      <span className="text-sm text-gray-400">({leave.auditor?.email})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getLeaveTypeBadge(leave.leaveType)}
                    {getStatusBadge(leave.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">From:</span>
                    <span className="ml-1 poppins-medium">{dayjs(leave.fromDate).format("DD MMM YYYY")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span>
                    <span className="ml-1 poppins-medium">{dayjs(leave.toDate).format("DD MMM YYYY")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Applied:</span>
                    <span className="ml-1 poppins-medium">{dayjs(leave.createdAt).format("DD MMM YYYY")}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  <span className="text-gray-500">Reason:</span> {leave.reason}
                </p>

                {leave.status !== "pending" && (
                  <div className="bg-gray-50 p-2 rounded mt-2 space-y-1">
                    {leave.adminRemarks && (
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-500">Remarks:</span> {leave.adminRemarks}
                      </p>
                    )}
                    {leave.reviewedBy && (
                      <p className="text-xs text-gray-600">
                        <span className="text-gray-500">{leave.status === "approved" ? "Approved" : "Rejected"} By:</span> {leave.reviewedBy.name}
                        {leave.reviewedAt && ` on ${dayjs(leave.reviewedAt).format("DD MMM YYYY, hh:mm A")}`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No leave requests found</p>
        )}
      </div>

      {/* Approve/Reject Popup Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg poppins-semibold text-gray-800">Review Leave Request</h3>
              <button
                onClick={() => setSelectedLeave(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-5 py-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedLeave.auditor?.profile || "/default-avatar.png"}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <div>
                  <p className="poppins-semibold text-gray-800">{selectedLeave.auditor?.name}</p>
                  <p className="text-xs text-gray-400">{selectedLeave.auditor?.email}</p>
                </div>
                <div className="ml-auto">{getLeaveTypeBadge(selectedLeave.leaveType)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">From</p>
                  <p className="poppins-medium text-gray-800">{dayjs(selectedLeave.fromDate).format("DD MMM YYYY")}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">To</p>
                  <p className="poppins-medium text-gray-800">{dayjs(selectedLeave.toDate).format("DD MMM YYYY")}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Reason</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedLeave.reason}</p>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Admin Remarks (optional)</label>
                <input
                  type="text"
                  placeholder="Enter remarks..."
                  value={remarksMap[selectedLeave._id] || ""}
                  onChange={(e) => setRemarksMap({ ...remarksMap, [selectedLeave._id]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => handleStatusUpdate(selectedLeave._id, "rejected")}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm poppins-medium transition"
              >
                <FaTimes /> Reject
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedLeave._id, "approved")}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm poppins-medium transition"
              >
                <FaCheck /> Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Leave Alert Modal */}
      {newLeaveAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm text-center p-6 relative transform transition-all scale-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4 shadow-inner">
              <FaBell className="h-8 w-8 text-blue-500 animate-bounce" />
            </div>
            <h3 className="text-xl poppins-semibold text-gray-800 mb-2">New Leave Application!</h3>
            <p className="text-sm text-gray-600 mb-4">
              <span className="poppins-semibold text-gray-800">{newLeaveAlert.auditor?.name}</span> has just applied for leave.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-left mb-6 border border-gray-100">
              <p><span className="text-gray-500">From:</span> <span className="poppins-medium">{dayjs(newLeaveAlert.fromDate).format("DD MMM YYYY")}</span></p>
              <p><span className="text-gray-500">To:</span> <span className="poppins-medium">{dayjs(newLeaveAlert.toDate).format("DD MMM YYYY")}</span></p>
              <p className="mt-1 text-gray-600 italic truncate">"{newLeaveAlert.reason}"</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setNewLeaveAlert(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg poppins-medium transition"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  setSelectedLeave(newLeaveAlert);
                  setNewLeaveAlert(null);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg poppins-medium transition shadow-md shadow-blue-500/30"
              >
                Review Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
