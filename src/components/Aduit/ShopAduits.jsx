import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { assignAuditorsAudit, assignAuditRoute, getAllAudits, getAuditByAuditor, getAuditsAll } from "../../API/audits";
import {getRoutesByAuditor } from "../../API/createRoute"
import { ScaleLoader } from "react-spinners";
import { useAuth } from "../../context/AuthProvider";
import { auditAssign } from "../../API/auditor";
import toast from "react-hot-toast";
import Loader from "../Loader";
import { formatTime } from "../../utils/tool";
import { ArrowBack } from "@mui/icons-material";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ShopAudits = () => {
  const {shopId} = useParams()
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Set to current date
  const [audits, setAudits] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [selectedRoute,setSelectedRoute] = useState('')

  useEffect(() => {
    
        getAuditsAll()
          .then((res) =>{
             setAudits(res.data.filter(d=>d.shop?._id === shopId))
             setSelectedRoute(res.data.find(d=>d.shop?._id === shopId)?.shop?.shopName)
            })
          .catch((err)=>console.log(err))
          .finally(() => {
            setLoading(false);
          });

  }, []);


  return (
    <div className="p-4 md:p-6 min-h-screen">
      <Link to='/myshop'><h2 className="text-xl poppins-semibold capitalize"><ArrowBack/> Back</h2></Link>
      <br />
      <div className="flex justify-between">
        <h2 className="text-2xl poppins-semibold capitalize">{selectedRoute} Audits</h2>
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
      
      </div>

      {loading ? (
         <Loader/>
      ) : (
        <>
          {/* Responsive Card View for Mobile */}
          <div className="block md:hidden mt-4">
            {audits.length > 0 ? (
              audits.map((audit, index) => (
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
                  {audits.length > 0 ? (
                    audits.map((audit, index) => (
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
                            <div className=" text-blue-800">{new Date(audit.auditDate).toLocaleDateString('en-GB')}</div>
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

export default ShopAudits;
