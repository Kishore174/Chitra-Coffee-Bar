import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { getAuditsAll } from "../../API/audits";
import { useAuth } from "../../context/AuthProvider";
import Loader from "../Loader";
import { formatTime } from "../../utils/tool";

const Reports = () => {
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]); // ⭐ ADDED
  const [fromDate, setFromDate] = useState(""); // ⭐ ADDED
  const [toDate, setToDate] = useState(""); // ⭐ ADDED
  const [shopFilter, setShopFilter] = useState(""); // ⭐ ADDED
  const [auditorFilter, setAuditorFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAudits = filteredAudits.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditsAll()
      .then((res) => {
        setAudits(res.data);
        setFilteredAudits(res.data); // ⭐ initial
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  // ⭐ FILTER LOGIC
  useEffect(() => {
    setFilterLoading(true);
    setCurrentPage(1);
    let result = audits;

    // Filter by shop
    if (shopFilter) {
      result = result.filter(
        (a) => a.shop?.shopName?.toLowerCase() === shopFilter.toLowerCase()
      );
    }

    if (auditorFilter) {
      result = result.filter(
        (a) => a.auditor?.name?.toLowerCase() === auditorFilter.toLowerCase()
      );
    }

    // Filter by date range
    if (fromDate) {
      result = result.filter(
        (a) => new Date(a.auditDate) >= new Date(fromDate)
      );
    }

    if (toDate) {
      result = result.filter((a) => new Date(a.auditDate) <= new Date(toDate));
    }

    setFilteredAudits(result);
    setTimeout(() => setFilterLoading(false), 200);
  }, [fromDate, toDate, shopFilter, audits, auditorFilter]);

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <h2 className="text-2xl poppins-semibold ">Audits</h2>

      <div className="bg-white p-4 rounded-lg shadow mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date From */}
        <div>
          <label className="block text-gray-700 poppins-regular">
            From Date
          </label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-gray-700 poppins-regular">To Date</label>
          <input
            type="date"
            className="border p-2 w-full rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {/* Shop Filter */}
        <div>
          <label className="block text-gray-700 poppins-regular">
            Filter by Shop
          </label>
          <select
            className="border p-2 w-full rounded"
            value={shopFilter}
            onChange={(e) => setShopFilter(e.target.value)}
          >
            <option value="">All Shops</option>

            {/* Populate unique shop names */}
            {[...new Set(audits.map((a) => a.shop?.shopName))].map(
              (shop, index) =>
                shop && (
                  <option key={index} value={shop}>
                    {shop}
                  </option>
                )
            )}
          </select>
        </div>
        {/* Auditor Filter */}
        <div>
          <label className="block text-gray-700 poppins-regular">
            Filter by Auditor
          </label>
          <select
            className="border p-2 w-full rounded"
            value={auditorFilter}
            onChange={(e) => setAuditorFilter(e.target.value)}
          >
            <option value="">All Auditors</option>

            {[...new Set(audits.map((a) => a.auditor?.name))].map(
              (auditor, index) =>
                auditor && (
                  <option key={index} value={auditor}>
                    {auditor}
                  </option>
                )
            )}
          </select>
        </div>
      </div>

      {loading || filterLoading ? (
        <Loader />
      ) : (
        <>
          {/* Responsive Card View for Mobile */}
          <div className="block md:hidden mt-4">
            {currentAudits.length > 0 ? (
              currentAudits.map((audit) => (
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
                    <div className="poppins-regular w-fit">
                      {audit.status === "completed" && (
                        <div className="poppins-semibold text-yellow-500">
                          {audit.rating}
                        </div>
                      )}
                      <div className=" text-blue-800">
                        {new Date(audit.auditDate).toLocaleDateString("en-GB")}
                      </div>
                      <div
                        className={
                          audit.status === "Completed"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {audit.status}
                      </div>
                      {user?.role === "super-admin" && (
                        <div className="flex items-center gap-1 justify-center text-sm text-gray-700">
                          <span>{formatTime(audit.inTime) || "0:00"}</span>
                          <span>-</span>
                          <span>{formatTime(audit.outTime) || "0:00"}</span>
                        </div>
                      )}
                    </div>
                    <div>{audit.shop?.phone}</div>
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
                  {currentAudits.length > 0 ? (
                    currentAudits.map((audit, index) => (
                      <tr key={audit.id}>
                        <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 border-b  border-gray-200 text-sm text-gray-700">
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
                            <div className=" text-blue-800">
                              {new Date(audit.auditDate).toLocaleDateString(
                                "en-GB"
                              )}
                            </div>
                            <div>{audit.status}</div>
                            {user?.role === "super-admin" && (
                              <div className="flex items-center gap-1 justify-center text-sm text-gray-700">
                                <span>
                                  {formatTime(audit.inTime) || "0:00"}
                                </span>
                                <span>-</span>
                                <span>
                                  {formatTime(audit.outTime) || "0:00"}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm text-gray-700">
                          <div>{audit.shop?.phone}</div>
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
      {/* ⭐ PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-red-600 text-white"
            }`}
          >
            Prev
          </button>

          {/* Page 1 */}
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1 ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </button>

          {/* Left Ellipsis */}
          {currentPage > 3 && <span className="px-2">...</span>}

          {/* Middle Pages */}
          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((p) => p > 1 && p < totalPages)
            .map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page ? "bg-red-600 text-white" : "bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

          {/* Right Ellipsis */}
          {currentPage < totalPages - 2 && <span className="px-2">...</span>}

          {/* Last Page */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-red-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {totalPages}
          </button>

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-red-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Reports;
