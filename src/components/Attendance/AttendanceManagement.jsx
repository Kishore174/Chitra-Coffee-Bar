import React, { useState, useEffect, useCallback } from "react";
import { getAllAttendance } from "../../API/attendance";
import { getAllAuditors } from "../../API/auditor";
import { getLeavesByDate } from "../../API/leaveRequest";
import dayjs from "dayjs";
import {
  FaFingerprint,
  FaCalendarAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarMinus,
} from "react-icons/fa";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [previewImage, setPreviewImage] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [attRes, audRes, leaveRes] = await Promise.allSettled([
        getAllAttendance(selectedDate),
        getAllAuditors(),
        getLeavesByDate(selectedDate),
      ]);
      if (attRes.status === "rejected") console.error("Attendance API failed:", attRes.reason);
      if (audRes.status === "rejected") console.error("Auditors API failed:", audRes.reason);
      if (leaveRes.status === "rejected") console.error("Leaves API failed:", leaveRes.reason);

      setAttendance(attRes.status === "fulfilled" ? attRes.value.data || [] : []);
      setAuditors(
        audRes.status === "fulfilled" ? audRes.value.data || [] : []
      );
      setLeaves(leaveRes.status === "fulfilled" ? leaveRes.value.data || [] : []);

      // console.log("Leaves response:", leaveRes.status === "fulfilled" ? leaveRes.value.data : "FAILED");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeDate = (offset) => {
    setSelectedDate(dayjs(selectedDate).add(offset, "day").format("YYYY-MM-DD"));
  };

  // Map attendance records by auditor ID (string key)
  const attendanceMap = {};
  attendance.forEach((record) => {
    const id = String(record.auditor?._id || "");
    if (id) attendanceMap[id] = record;
  });

  // Map leave requests by auditor ID (string key)
  const leaveMap = {};
  leaves.forEach((leave) => {
    const id = String(leave.auditor?._id || "");
    if (id) leaveMap[id] = leave;
  });

  // Merge auditors with attendance + leave data
  const mergedData = auditors.map((auditor) => ({
    auditor,
    record: attendanceMap[String(auditor._id)] || null,
    leave: leaveMap[String(auditor._id)] || null,
  }));

  const getStatusInfo = (record, leave) => {
    if (leave && !record) {
      return {
        label: "On Leave",
        color: "bg-purple-100 text-purple-600",
        dotColor: "bg-purple-500",
      };
    }
    if (!record) {
      return { label: "Absent", color: "bg-red-100 text-red-600", dotColor: "bg-red-500" };
    }
    if (record.status === "checked-out") {
      return { label: "Present", color: "bg-green-100 text-green-600", dotColor: "bg-green-500" };
    }
    if (record.status === "checked-in") {
      return { label: "Checked In", color: "bg-yellow-100 text-yellow-600", dotColor: "bg-yellow-500" };
    }
    return { label: "Unknown", color: "bg-gray-100 text-gray-600", dotColor: "bg-gray-500" };
  };

  const getLeaveTypeBadge = (type) => {
    const styles = {
      sick: "bg-red-50 text-red-600 border-red-200",
      casual: "bg-blue-50 text-blue-600 border-blue-200",
      personal: "bg-purple-50 text-purple-600 border-purple-200",
      emergency: "bg-orange-50 text-orange-600 border-orange-200",
    };
    return (
      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold capitalize ${styles[type] || ""}`}>
        {type}
      </span>
    );
  };

  const isToday = dayjs(selectedDate).isSame(dayjs(), "day");

  // Stats
  const totalPresent = mergedData.filter((d) => d.record?.status === "checked-out").length;
  const totalCheckedIn = mergedData.filter((d) => d.record?.status === "checked-in").length;
  const totalOnLeave = mergedData.filter((d) => d.leave && !d.record).length;
  const totalAbsent = mergedData.filter((d) => !d.record && !d.leave).length;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl poppins-semibold flex items-center gap-2">
          <FaFingerprint className="text-red-500" /> Attendance Management
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg border hover:bg-gray-100 transition"
          >
            <FaChevronLeft className="text-gray-500 text-sm" />
          </button>
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg border hover:bg-gray-100 transition"
          >
            <FaChevronRight className="text-gray-500 text-sm" />
          </button>
          {!isToday && (
            <button
              onClick={() => setSelectedDate(dayjs().format("YYYY-MM-DD"))}
              className="text-sm text-red-500 hover:underline poppins-medium ml-1"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Selected Date Display */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-lg poppins-semibold text-gray-800">
            {dayjs(selectedDate).format("dddd, DD MMMM YYYY")}
          </p>
          <p className="text-xs text-gray-400">
            {isToday ? "Today" : dayjs(selectedDate).fromNow ? dayjs(selectedDate).format("DD/MM/YYYY") : ""}
          </p>
        </div>
        {isToday && (
          <span className="px-3 py-1 rounded-full text-xs poppins-semibold bg-green-100 text-green-600">
            Today
          </span>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-gray-800">{auditors.length}</p>
          <p className="text-xs text-gray-500 poppins-medium">Total</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-green-600">{totalPresent}</p>
          <p className="text-xs text-gray-500 poppins-medium">Present</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-yellow-600">{totalCheckedIn}</p>
          <p className="text-xs text-gray-500 poppins-medium">Checked In</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-purple-600">{totalOnLeave}</p>
          <p className="text-xs text-gray-500 poppins-medium">On Leave</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-red-600">{totalAbsent}</p>
          <p className="text-xs text-gray-500 poppins-medium">Absent</p>
        </div>
      </div>

      {/* Auditor Attendance List */}
      <div className="bg-white rounded-xl shadow-md">
        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading...</p>
        ) : mergedData.length > 0 ? (
          <div className="divide-y">
            {mergedData.map(({ auditor, record, leave }) => {
              const status = getStatusInfo(record, leave);
              return (
                <div key={auditor._id} className="p-4 hover:bg-gray-50/50 transition">
                  {/* Row: Auditor Info + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 poppins-semibold text-sm shrink-0 overflow-hidden">
                        {auditor.profile ? (
                          <img
                            src={auditor.profile}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.textContent =
                                auditor.name?.charAt(0)?.toUpperCase() || "?";
                            }}
                          />
                        ) : (
                          auditor.name?.charAt(0)?.toUpperCase() || "?"
                        )}
                      </div>
                      <div>
                        <p className="poppins-semibold text-gray-800">{auditor.name}</p>
                        <p className="text-xs text-gray-400">{auditor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Working Hours */}
                      {record && (
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Working Hours</p>
                          <p className="poppins-semibold text-gray-800 text-sm">
                            {record.status === "checked-out"
                              ? `${record.totalHours} hrs`
                              : record.checkIn?.time
                              ? `${((Date.now() - new Date(record.checkIn.time).getTime()) / (1000 * 60 * 60)).toFixed(1)} hrs`
                              : "-"}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${status.dotColor}`}></span>
                        <span className={`px-3 py-1 rounded-full text-xs poppins-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Check-in / Check-out Details with Selfie */}
                  {record && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-[52px]">
                      {/* Check-in */}
                      <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                        <div className="shrink-0">
                          {record.checkIn?.selfieUrl ? (
                            <img
                              src={record.checkIn.selfieUrl}
                              alt="Check-in selfie"
                              className="w-16 h-16 rounded-lg object-cover border-2 border-green-200 cursor-pointer hover:opacity-80 transition"
                              onClick={() => setPreviewImage(record.checkIn.selfieUrl)}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-green-100 border-2 border-green-200 flex items-center justify-center">
                              <FaSignInAlt className="text-green-400 text-lg" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs poppins-semibold text-green-700 flex items-center gap-1 mb-1">
                            <FaSignInAlt /> Check-in
                          </p>
                          <p className="text-sm poppins-medium text-gray-800 flex items-center gap-1">
                            <FaClock className="text-green-500 text-xs" />
                            {record.checkIn?.time
                              ? dayjs(record.checkIn.time).format("DD MMM YYYY, hh:mm A")
                              : "-"}
                          </p>
                          {record.checkIn?.location?.latitude !== 0 && (
                            <a
                              href={`https://www.google.com/maps?q=${record.checkIn.location.latitude},${record.checkIn.location.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 mt-1 underline"
                            >
                              <FaMapMarkerAlt className="text-green-500 shrink-0" />
                              View Location
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Check-out */}
                      {record.checkOut ? (
                        <div className="flex items-start gap-3 rounded-lg p-3 bg-blue-50">
                          <div className="shrink-0">
                            {record.checkOut.selfieUrl ? (
                              <img
                                src={record.checkOut.selfieUrl}
                                alt="Check-out selfie"
                                className="w-16 h-16 rounded-lg object-cover border-2 border-blue-200 cursor-pointer hover:opacity-80 transition"
                                onClick={() => setPreviewImage(record.checkOut.selfieUrl)}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-blue-100 border-2 border-blue-200 flex items-center justify-center">
                                <FaSignOutAlt className="text-blue-400 text-lg" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs poppins-semibold text-blue-700 flex items-center gap-1 mb-1">
                              <FaSignOutAlt /> Check-out
                            </p>
                            <p className="text-sm poppins-medium text-gray-800 flex items-center gap-1">
                              <FaClock className="text-blue-500 text-xs" />
                              {dayjs(record.checkOut.time).format("DD MMM YYYY, hh:mm A")}
                            </p>
                            {record.checkOut.location?.latitude !== 0 && (
                              <a
                                href={`https://www.google.com/maps?q=${record.checkOut.location.latitude},${record.checkOut.location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-1 underline"
                              >
                                <FaMapMarkerAlt className="text-blue-500 shrink-0" />
                                View Location
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-lg p-3 bg-yellow-50 border border-yellow-200">
                          <FaClock className="text-yellow-500" />
                          <span className="text-sm poppins-medium text-yellow-700">Waiting for check-out</span>
                        </div>
                      )}

                      {/* Check-in & Check-out times */}
                      <div className="sm:col-span-2 flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaSignInAlt className="text-green-500" />
                          {record.checkIn?.time ? dayjs(record.checkIn.time).format("hh:mm A") : "-"}
                        </span>
                        <span className="text-gray-300">—</span>
                        <span className="flex items-center gap-1">
                          <FaSignOutAlt className="text-blue-500" />
                          {record.checkOut?.time ? dayjs(record.checkOut.time).format("hh:mm A") : "--:--"}
                        </span>
                        {record.totalHours > 0 && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="flex items-center gap-1 poppins-semibold text-gray-700">
                              <FaClock className="text-red-500" />
                              {record.totalHours} hrs
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Leave Info - always show if leave exists */}
                  {leave && (
                    <div className={`ml-[52px] ${record ? "mt-3" : ""} flex items-center gap-3 bg-purple-50 rounded-lg p-3`}>
                      <FaCalendarMinus className="text-purple-500 text-lg shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs poppins-semibold text-purple-700">Leave Request</span>
                          {getLeaveTypeBadge(leave.leaveType)}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${
                              leave.status === "approved"
                                ? "bg-green-100 text-green-600"
                                : leave.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {dayjs(leave.fromDate).format("DD MMM YYYY")} - {dayjs(leave.toDate).format("DD MMM YYYY")}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">Reason: {leave.reason}</p>
                        {leave.adminRemarks && (
                          <p className="text-xs text-gray-500 mt-0.5">Remarks: {leave.adminRemarks}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Absent - No record and no leave */}
                  {!record && !leave && (
                    <div className="ml-[52px] text-sm text-red-400 italic">
                      No check-in recorded — Absent
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">No auditors found</p>
        )}
      </div>

      {/* Selfie Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImage}
              alt="Selfie preview"
              className="w-full rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;
