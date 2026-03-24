import React, { useState, useEffect, useCallback } from "react";
import { createLeaveRequest, getMyLeaveRequests, deleteLeaveRequest } from "../../API/leaveRequest";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { FaCalendarPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { MdClose } from "react-icons/md";

const LeaveRequest = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "casual",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const fetchLeaveRequests = useCallback(async () => {
    try {
      const res = await getMyLeaveRequests();
      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fromDate || !formData.toDate || !formData.reason) {
      toast.error("Please fill all fields");
      return;
    }
    if (dayjs(formData.toDate).isBefore(dayjs(formData.fromDate))) {
      toast.error("To date cannot be before from date");
      return;
    }

    setLoading(true);
    try {
      const res = await createLeaveRequest(formData);
      toast.success(res.message);
      setShowForm(false);
      setFormData({ leaveType: "casual", fromDate: "", toDate: "", reason: "" });
      fetchLeaveRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (leaveId) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;
    try {
      const res = await deleteLeaveRequest(leaveId);
      toast.success(res.message);
      fetchLeaveRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl poppins-semibold">Leave Requests</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg poppins-semibold transition text-sm"
        >
          <FaCalendarPlus /> Apply Leave
        </button>
      </div>

      {/* Leave Request Form Popup */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-lg poppins-semibold text-gray-800">Apply for Leave</h3>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Leave Type</label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">To Date</label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Reason</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter the reason for leave..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 resize-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm poppins-medium text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm poppins-semibold transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave Requests List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg poppins-semibold mb-4 flex items-center gap-2">
          <FaCalendarAlt className="text-red-500" /> My Leave Requests
        </h2>

        {leaveRequests.length > 0 ? (
          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <div key={leave._id} className="border rounded-lg p-4 hover:shadow-sm transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getLeaveTypeBadge(leave.leaveType)}
                    {getStatusBadge(leave.status)}
                  </div>
                  {leave.status === "pending" && (
                    <button
                      onClick={() => handleDelete(leave._id)}
                      className="text-red-400 hover:text-red-600 transition"
                      title="Delete request"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <span className="text-gray-500">From:</span>
                    <span className="ml-2 poppins-medium">{dayjs(leave.fromDate).format("DD MMM YYYY")}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">To:</span>
                    <span className="ml-2 poppins-medium">{dayjs(leave.toDate).format("DD MMM YYYY")}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  <span className="text-gray-500">Reason:</span> {leave.reason}
                </p>

                {leave.adminRemarks && (
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    <span className="text-gray-500">Admin Remarks:</span> {leave.adminRemarks}
                  </p>
                )}

                <p className="text-xs text-gray-400 mt-2">
                  Applied on {dayjs(leave.createdAt).format("DD MMM YYYY, hh:mm A")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No leave requests found</p>
        )}
      </div>
    </div>
  );
};

export default LeaveRequest;
