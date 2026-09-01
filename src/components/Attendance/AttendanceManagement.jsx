import React, { useState, useEffect, useCallback } from "react";
import { getAllAttendance } from "../../API/attendance";
import { getAllEmployees } from "../../API/employee";
import { getLeavesByDate } from "../../API/leaveRequest";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
  FaFileExport,
  FaUsersSlash,
  FaTimes
} from "react-icons/fa";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [previewImage, setPreviewImage] = useState(null);
  const [showAbsents, setShowAbsents] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [attRes, audRes, leaveRes] = await Promise.allSettled([
        getAllAttendance(null, startDate, endDate),
        getAllEmployees(),
        getLeavesByDate(null, startDate, endDate),
      ]);
      if (attRes.status === "rejected") console.error("Attendance API failed:", attRes.reason);
      if (audRes.status === "rejected") console.error("Employees API failed:", audRes.reason);
      if (leaveRes.status === "rejected") console.error("Leaves API failed:", leaveRes.reason);

      setAttendance(attRes.status === "fulfilled" ? attRes.value.data || [] : []);
      setEmployees(audRes.status === "fulfilled" ? audRes.value.data || [] : []);
      setLeaves(leaveRes.status === "fulfilled" ? leaveRes.value.data || [] : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const changeDate = (offset) => {
    setStartDate(dayjs(startDate).add(offset, "day").format("YYYY-MM-DD"));
    setEndDate(dayjs(endDate).add(offset, "day").format("YYYY-MM-DD"));
  };

  const isSingleDay = startDate === endDate;
  const isToday = isSingleDay && dayjs(startDate).isSame(dayjs(), "day");

  const datesInRange = [];
  let currDate = dayjs(startDate);
  const lastDate = dayjs(endDate);
  while (currDate.isBefore(lastDate) || currDate.isSame(lastDate, 'day')) {
    datesInRange.push(currDate.format("YYYY-MM-DD"));
    currDate = currDate.add(1, 'day');
  }
  const totalDays = datesInRange.length;

  const attendanceMap = {};
  attendance.forEach((record) => {
    const id = String(record.auditor?._id || "");
    if (id) {
        if (!attendanceMap[id]) attendanceMap[id] = [];
        attendanceMap[id].push(record);
    }
  });

  const leaveMap = {};
  leaves.forEach((leave) => {
    const id = String(leave.auditor?._id || "");
    if (id) {
        if (!leaveMap[id]) leaveMap[id] = [];
        leaveMap[id].push(leave);
    }
  });

  const mergedData = employees.map((employee) => {
    const empId = String(employee._id);
    const empAttendance = attendanceMap[empId] || [];
    const empLeaves = leaveMap[empId] || [];

    let presentDays = 0;
    let checkedInDays = 0;
    let totalHours = 0;
    let onLeaveDays = 0;
    let absentDays = 0;

    datesInRange.forEach(d => {
        const dStr = dayjs(d).format("YYYY-MM-DD");
        const record = empAttendance.find(a => dayjs(a.date).format("YYYY-MM-DD") === dStr);
        const leave = empLeaves.find(l => dayjs(l.fromDate).format("YYYY-MM-DD") <= dStr && dayjs(l.toDate).format("YYYY-MM-DD") >= dStr);

        if (record) {
            if (record.status === "checked-out") {
                presentDays++;
                totalHours += (record.totalHours || 0);
            } else {
                checkedInDays++;
            }
        } else if (leave) {
            onLeaveDays++;
        } else {
            absentDays++;
        }
    });

    return {
      employee,
      presentDays,
      checkedInDays,
      onLeaveDays,
      absentDays,
      totalHours,
      record: empAttendance.find(a => dayjs(a.date).format("YYYY-MM-DD") === dayjs(startDate).format("YYYY-MM-DD")) || null,
      leave: empLeaves.find(l => dayjs(l.fromDate).format("YYYY-MM-DD") <= dayjs(startDate).format("YYYY-MM-DD") && dayjs(l.toDate).format("YYYY-MM-DD") >= dayjs(startDate).format("YYYY-MM-DD")) || null
    };
  });

  const getAbsentsList = () => {
    const absents = [];
    datesInRange.forEach(d => {
        const dStr = dayjs(d).format("YYYY-MM-DD");
        const absentEmployees = [];
        employees.forEach(emp => {
            const empId = String(emp._id);
            const empAttendance = attendanceMap[empId] || [];
            const empLeaves = leaveMap[empId] || [];
            
            const record = empAttendance.find(a => dayjs(a.date).format("YYYY-MM-DD") === dStr);
            const leave = empLeaves.find(l => dayjs(l.fromDate).format("YYYY-MM-DD") <= dStr && dayjs(l.toDate).format("YYYY-MM-DD") >= dStr);
            
            if (!record && !leave) {
                absentEmployees.push(emp.name);
            }
        });
        if (absentEmployees.length > 0) {
            absents.push({ date: dStr, names: absentEmployees });
        }
    });
    return absents;
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    
    // Sheet 1: Summary
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Employee Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Total Days in Range", key: "totalDays", width: 20 },
      { header: "Present Days", key: "presentDays", width: 15 },
      { header: "Checked In (Not Checked Out)", key: "checkedInDays", width: 25 },
      { header: "Leave Days", key: "leaveDays", width: 15 },
      { header: "Absent Days", key: "absentDays", width: 15 },
      { header: "Total Hours Worked", key: "totalHours", width: 20 },
    ];
    
    // Header style
    summarySheet.getRow(1).font = { bold: true };
    
    mergedData.forEach(d => {
      summarySheet.addRow({
        name: d.employee.name,
        phone: d.employee.phone,
        totalDays: totalDays,
        presentDays: d.presentDays,
        checkedInDays: d.checkedInDays,
        leaveDays: d.onLeaveDays,
        absentDays: d.absentDays,
        totalHours: d.totalHours.toFixed(2)
      });
    });

    // Sheet 2: Date-wise
    const dateWiseSheet = workbook.addWorksheet("Date-wise");
    const dateColumns = datesInRange.map(d => ({
      header: dayjs(d).format("DD MMM YYYY"),
      key: d,
      width: 20
    }));
    
    dateWiseSheet.columns = [
      { header: "Employee Name", key: "name", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      ...dateColumns
    ];
    dateWiseSheet.getRow(1).font = { bold: true };
    
    employees.forEach(emp => {
      const empId = String(emp._id);
      const empAttendance = attendanceMap[empId] || [];
      const empLeaves = leaveMap[empId] || [];
      
      const rowData = {
        name: emp.name,
        phone: emp.phone
      };
      
      datesInRange.forEach(d => {
        const dStr = dayjs(d).format("YYYY-MM-DD");
        const record = empAttendance.find(a => dayjs(a.date).format("YYYY-MM-DD") === dStr);
        const leave = empLeaves.find(l => dayjs(l.fromDate).format("YYYY-MM-DD") <= dStr && dayjs(l.toDate).format("YYYY-MM-DD") >= dStr);
        
        let text = "Absent";
        if (record) {
          const inTime = record.checkIn?.time ? dayjs(record.checkIn.time).format("hh:mm A") : "-";
          const outTime = record.checkOut?.time ? dayjs(record.checkOut.time).format("hh:mm A") : "-";
          const hours = record.totalHours ? record.totalHours.toFixed(1) + " hrs" : "-";

          if (record.status === "checked-out") {
            text = `Present\nIn: ${inTime}\nOut: ${outTime}\nWork: ${hours}`;
          } else {
            text = `Checked In\nIn: ${inTime}`;
          }
        } else if (leave) {
          text = "On Leave";
        }
        
        rowData[d] = text;
      });
      
      const row = dateWiseSheet.addRow(rowData);
      
      // Color-coding and wrap text based on status
      datesInRange.forEach((d, index) => {
         const cell = row.getCell(3 + index);
         const val = String(cell.value || "");
         
         cell.alignment = { wrapText: true, vertical: 'top' };
         
         if (val.startsWith("Present")) {
            cell.font = { color: { argb: "FF008000" } }; // Green
         } else if (val.startsWith("Absent")) {
            cell.font = { color: { argb: "FFFF0000" } }; // Red
         } else if (val.startsWith("On Leave")) {
            cell.font = { color: { argb: "FF800080" } }; // Purple
         } else if (val.startsWith("Checked In")) {
            cell.font = { color: { argb: "FFFFA500" } }; // Orange
         }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Attendance_Export_${startDate}_to_${endDate}.xlsx`);
  };

  const getStatusInfo = (record, leave) => {
    if (leave && !record) {
      return { label: "On Leave", color: "bg-purple-100 text-purple-600", dotColor: "bg-purple-500" };
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

  const totalPresent = isSingleDay ? mergedData.filter((d) => d.record?.status === "checked-out").length : mergedData.reduce((acc, curr) => acc + curr.presentDays, 0);
  const totalCheckedIn = isSingleDay ? mergedData.filter((d) => d.record?.status === "checked-in").length : mergedData.reduce((acc, curr) => acc + curr.checkedInDays, 0);
  const totalOnLeave = isSingleDay ? mergedData.filter((d) => d.leave && !d.record).length : mergedData.reduce((acc, curr) => acc + curr.onLeaveDays, 0);
  const totalAbsent = isSingleDay ? mergedData.filter((d) => !d.record && !d.leave).length : mergedData.reduce((acc, curr) => acc + curr.absentDays, 0);

  return (
    <div className="p-4 md:p-8 min-h-full w-full bg-white poppins-regular">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl poppins-semibold flex items-center gap-2">
          <FaFingerprint className="text-red-500" /> Attendance Management
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAbsents(true)}
            className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm font-semibold hover:bg-gray-50 text-gray-700 transition"
          >
            <FaUsersSlash className="text-red-500" /> View Absents
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
          >
            <FaFileExport /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-600 mb-1">Select Date Range</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => changeDate(-1)} className="p-2 rounded-lg border hover:bg-gray-100 transition"><FaChevronLeft className="text-gray-500 text-sm" /></button>
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
            <button onClick={() => changeDate(1)} className="p-2 rounded-lg border hover:bg-gray-100 transition"><FaChevronRight className="text-gray-500 text-sm" /></button>
            {!isToday && (
              <button
                onClick={() => { setStartDate(dayjs().format("YYYY-MM-DD")); setEndDate(dayjs().format("YYYY-MM-DD")); }}
                className="text-sm text-red-500 hover:underline poppins-medium ml-1"
              >
                Today
              </button>
            )}
          </div>
        </div>
        <div className="text-right">
            <p className="text-lg poppins-semibold text-gray-800">
                {isSingleDay ? dayjs(startDate).format("dddd, DD MMM YYYY") : `${dayjs(startDate).format("DD MMM")} - ${dayjs(endDate).format("DD MMM YYYY")}`}
            </p>
            <p className="text-xs text-gray-400">
                {totalDays} Day{totalDays !== 1 ? 's' : ''} Selected
            </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-gray-800">{employees.length}</p>
          <p className="text-xs text-gray-500 poppins-medium">Total Employees</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-green-600">{totalPresent}</p>
          <p className="text-xs text-gray-500 poppins-medium">Total Present Days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-yellow-600">{totalCheckedIn}</p>
          <p className="text-xs text-gray-500 poppins-medium">Total Checked In</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-purple-600">{totalOnLeave}</p>
          <p className="text-xs text-gray-500 poppins-medium">Total Leave Days</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-4 text-center">
          <p className="text-2xl poppins-semibold text-red-600">{totalAbsent}</p>
          <p className="text-xs text-gray-500 poppins-medium">Total Absent Days</p>
        </div>
      </div>

      {/* Auditor Attendance List */}
      <div className="bg-white rounded-xl shadow-md">
        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading...</p>
        ) : mergedData.length > 0 ? (
          <div className="divide-y">
            {mergedData.map(({ employee, presentDays, absentDays, onLeaveDays, totalHours, record, leave }) => {
              const status = isSingleDay ? getStatusInfo(record, leave) : null;
              return (
                <div key={employee._id} className="p-4 hover:bg-gray-50/50 transition">
                  {/* Row: Employee Info + Status */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 poppins-semibold text-sm shrink-0 overflow-hidden">
                        {employee.profile ? (
                          <img
                            src={employee.profile}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.textContent = employee.name?.charAt(0)?.toUpperCase() || "?";
                            }}
                          />
                        ) : (
                          employee.name?.charAt(0)?.toUpperCase() || "?"
                        )}
                      </div>
                      <div>
                        <p className="poppins-semibold text-gray-800">{employee.name}</p>
                        <p className="text-xs text-gray-400">{employee.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Working Hours */}
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Total Hours</p>
                        <p className="poppins-semibold text-gray-800 text-sm">
                            {totalHours.toFixed(1)} hrs
                        </p>
                      </div>
                      {isSingleDay && status && (
                        <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${status.dotColor}`}></span>
                            <span className={`px-3 py-1 rounded-full text-xs poppins-semibold ${status.color}`}>
                            {status.label}
                            </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {!isSingleDay ? (
                      <div className="ml-[52px] flex items-center gap-4 text-sm mt-2">
                        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md font-semibold text-xs"><FaSignInAlt /> {presentDays} Present</div>
                        <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md font-semibold text-xs"><FaSignOutAlt /> {absentDays} Absent</div>
                        <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-md font-semibold text-xs"><FaCalendarMinus /> {onLeaveDays} Leave</div>
                      </div>
                  ) : (
                      <>
                      {/* Single Day Details */}
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
                                {record.checkIn?.time ? dayjs(record.checkIn.time).format("DD MMM YYYY, hh:mm A") : "-"}
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
                        </div>
                      )}
    
                      {/* Leave Info */}
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
                          </div>
                        </div>
                      )}
    
                      {/* Absent */}
                      {!record && !leave && (
                        <div className="ml-[52px] text-sm text-red-400 italic">
                          No check-in recorded — Absent
                        </div>
                      )}
                      </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">No employees found</p>
        )}
      </div>

      {/* Absents Modal */}
      {showAbsents && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowAbsents(false)}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-lg flex items-center gap-2"><FaUsersSlash className="text-red-500" /> Absents List</h3>
                    <button onClick={() => setShowAbsents(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 bg-gray-50/50">
                    {getAbsentsList().length === 0 ? (
                        <p className="text-center text-gray-500 py-6 italic">No absences found in this date range.</p>
                    ) : (
                        <div className="space-y-4">
                            {getAbsentsList().map((item, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <h4 className="font-semibold text-gray-800 mb-2 border-b pb-1 text-sm">{dayjs(item.date).format("dddd, DD MMM YYYY")}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {item.names.map((name, i) => (
                                            <span key={i} className="bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded text-xs font-medium">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Selfie Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Selfie preview" className="w-full rounded-xl shadow-2xl" />
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
