import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { assignAuditorsAudit, assignAuditRoute, getAllAudits, getAuditByAuditor } from "../../API/audits";
import {getRoutesByAuditor } from "../../API/createRoute"
import { ScaleLoader } from "react-spinners";
import { useAuth } from "../../context/AuthProvider";
import { auditAssign } from "../../API/auditor";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { formatTime } from "../../utils/tool";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Table = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Set to current date
  const [audits, setAudits] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedRoute,setSelectedRoute] = useState(null)
  const [routes,setRoutes] = useState([])

  const currentWeekDates = Array(6)
    .fill()
    .map((_, index) => {
      return dayjs()
        .startOf("week")
        .add(index + 1, "day");
    });

  const filteredAudits = audits.filter((audit) => {
    return dayjs(audit.auditDate).isSame(selectedDate, "day");
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (user) {
      if (user.role === "super-admin") {
        getAllAudits({date : selectedDate})
          .then((res) => setAudits(res.data))
          .finally(() => {
            setLoading(false);
          });
      } else {
        getAuditByAuditor(user._id,{date : selectedDate})
          .then((res) => setAudits(res.data))
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [selectedDate]);

  useEffect(()=>{
    getRoutesByAuditor(user?._id).then(res=>{
      setRoutes(res.data)
    }).catch(err=>{
      console.log(err)
    })
  },[user])

  const handleToAsign = () => {
    auditAssign()
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message);
      });
  };
  const handleToAsignAuditor = () => {
    // assignAuditorsAudit()
    //   .then((res) => {
    //     toast.success(res.message);
    //     setLoading(true)
    //     if (user) {
    //       if (user.role === "super-admin") {
    //         getAllAudits()
    //           .then((res) => setAudits(res.data))
    //           .finally(() => {
    //             setLoading(false);
    //           });
    //       } else {
    //         getAuditByAuditor(user._id)
    //           .then((res) => setAudits(res.data))
    //           .finally(() => {
    //             setLoading(false);
    //           });
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     toast.error(err.response?.data?.message);
    //   });
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
  const scheduleDays = [0, 1]; // Active days: Sunday to Wednesday

  // Find the next active day
  const getNextActiveDay = () => {
    const today = dayjs().day();
    const nextActiveDay = scheduleDays.find((day) => day > today);
    if (nextActiveDay !== undefined) {
      return nextActiveDay - today; // Days remaining to the next active day
    }
    return 7 - today + scheduleDays[0]; // Wrap around to the next week
  };

  const daysToActive = getNextActiveDay();

  const today = dayjs(); // Get the current date
  const isScheduleDay = today.day() === 0 || today.day() === 1; // Sunday = 0, Monday = 1

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex justify-center w-full items-center space-x-2 mb-4">
        {currentWeekDates.map((date, index) => (
          <button
            key={index}
            className={`day-btn px-8 w-12 ${
              selectedDate.isSame(date, "day") ? "selected" : ""
            }`}
            onClick={() => handleDateClick(date)}
          >
            <span className="day-name">{daysOfWeek[index]}</span>
            <span className="day-number">{date.format("D")}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <h2 className="text-2xl poppins-semibold">My Audit</h2>
        {/* {user && user.role === "super-admin" && audits.length < 0 && isScheduleDay ? (
          <button
            className={`${
              !isScheduleDay ? "bg-red-400" : "bg-red-600"
            } text-white rounded-lg poppins-semibold py-1 px-3 flex items-center`}
            // disabled={isScheduleDay}
            onClick={handleToAsign}
          >
            Schedule
          </button>
        ) : (
          user.role === "super-admin" && (
            <p className="text-red-600 poppins-semibold">
              {daysToActive} day{daysToActive > 1 ? "s" : ""} to active
            </p>
          )
        )} */}
      {filteredAudits.length === 0  && 
        <div className=" flex gap-2">
          <label htmlFor="route">Route</label>
          <select onChange={(e)=>setSelectedRoute(e.target.value)} className=" border">
            <option value=""> - </option>
            {routes && routes.map(route=>(
              <option value={route._id}>{route.name}</option>
            ))}
          </select>
          {selectedRoute && <button
            className={`${
               "bg-red-600"
            } text-white rounded-lg poppins-semibold py-1 px-3 flex items-center`}
            // disabled={isScheduleDay}
            onClick={handleToAsignAuditor}
          >
            Schedule
          </button>}
        </div>
      }
      </div>

      {loading ? (
         <Loader/>
      ) : (
        <>
          {/* Responsive Card View for Mobile */}
          <div className="block md:hidden mt-4">
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit, index) => (
                <div
                  key={audit._id}
                  className="border rounded-lg p-4 mb-4 shadow-md"
                >
                  <div className="poppins-regular">
                    <div className="font-semibold">{audit.shop?.shopName}</div>
                    <div>{audit.shop?.ownerName}</div>
                    <div>{audit.shop?.address}</div>
                    <a
                      href={audit.location}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Map Link
                    </a>
                    <div
                      className={`mt-2 ${
                        audit.status === "Completed"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {audit.status}
                    </div>
                    <div>{audit.shop.phone}</div>
                    <a
                      href={`mailto:${audit.shop?.email}`}
                      className="text-blue-500 hover:underline"
                    >
                      {audit.shop?.email}
                    </a>
                    <div className="mt-2">
                      {audit.status !== "completed" ? (
                        <Link to={`/add-audit/${audit._id}`}>
                          <BsArrowRight className="text-red-600 text-2xl" />
                        </Link>
                      ) : (
                        <Link to={`/report/${audit._id}`}>
                          <button className="text-blue-500 poppins-regular">
                            View
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-700">
                No audits available for this date
              </div>
            )}
          </div>

          {/* Table View for Larger Screens */}
          <div className="hidden md:block mt-4">
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-red-600 text-white poppins-semibold">
                  <tr>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold uppercase">
                      S.No
                    </th>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold uppercase">
                      Shop Details
                    </th>
                    {user?.role === "super-admin" && (
                      <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold uppercase">
                        Auditor
                      </th>
                    )}
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold uppercase">
                      Audit Status
                    </th>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold uppercase">
                      Contact Details
                    </th>
                    <th className="px-4 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.length > 0 ? (
                    filteredAudits.map((audit, index) => (
                      <tr key={audit.id}>
                        <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 border-b capitalize border-gray-200 text-sm text-gray-700">
                          <div className="poppins-regular overflow-hidden">
                            <div>{audit.shop?.shopName}</div>
                            <div>{audit.shop?.ownerName}</div>
                            <div>
                              {audit.shop?.address?.length > 15
                                ? `${audit.shop?.address.slice(0, 15)}...`
                                : audit.shop?.address}
                            </div>
                            <a
                              href={audit.location}
                              className="text-blue-500 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Map Link
                            </a>
                          </div>
                        </td>
                        {user?.role === "super-admin" && (
                          <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                            <div className="poppins-regular">
                              <div>{audit.auditor?.name}</div>
                              <div>{audit.auditor?.phone}</div>
                              <div>{audit.auditor?.email}</div>
                            </div>
                          </td>
                        )}
                        <td
                          className={`border-b poppins-regular border-gray-200 text-sm ${
                            audit.status === "Completed"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div className="poppins-regular text-center">
                            {audit.status === "completed" && (
                              <div className="poppins-semibold text-yellow-500">
                                {audit.rating}
                              </div>
                            )}
                            <div>{audit.status}</div>
                              {user?.role === "super-admin" && (
                                <div className="flex items-center gap-1 justify-center text-sm text-gray-700">
                                  <span>{formatTime(audit.inTime) || "0:00"}</span>
                                  <span>-</span>
                                  <span>{formatTime(audit.outTime) || "0:00"}</span>
                                </div>
                              )}
                            </div>
                        </td>
                        <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm text-gray-700">
                          <div>{audit.shop.phone}</div>
                          <a
                            href={`mailto:${audit.shop?.email}`}
                            className="text-blue-500 hover:underline"
                          >
                            {audit.shop?.email}
                          </a>
                        </td>
                        <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm">
                          {audit.status !== "completed" &&
                          user?.role !== "super-admin" ? (
                            <Link to={`/add-audit/${audit._id}`}>
                              <BsArrowRight className="text-red-600 text-2xl" />
                            </Link>
                          ) : (
                            <Link to={`/report/${audit?._id}`}>
                              <button className="text-blue poppins-regular">
                                View
                              </button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-6 poppins-semibold"
                      >
                        No audits available for this date
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Table;
