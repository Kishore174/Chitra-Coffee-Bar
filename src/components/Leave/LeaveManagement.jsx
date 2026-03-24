import React, { useState, useEffect, useCallback } from "react";
import { getAllLeaveRequests, updateLeaveStatus } from "../../API/leaveRequest";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FaCheck, FaTimes, FaCalendarAlt, FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [remarksMap, setRemarksMap] = useState({});
  const [selectedLeave, setSelectedLeave] = useState(null);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllLeaveRequests(filterStatus);
      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchLeaveRequests();
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
    <div className="p-4 mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
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

      <div className="bg-white rounded-xl shadow-md p-6">
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

                {leave.adminRemarks && leave.status !== "pending" && (
                  <p className="text-sm bg-gray-50 p-2 rounded mt-2">
                    <span className="text-gray-500">Remarks:</span> {leave.adminRemarks}
                  </p>
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
    </div>
  );
};

export default LeaveManagement;
