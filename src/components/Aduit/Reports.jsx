import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import { filterAudits } from "../../API/audits";
import { useAuth } from "../../context/AuthProvider";
import Loader from "../Loader";
import { formatTime } from "../../utils/tool";
import { getProducts } from "../../API/settings";

const Reports = () => {
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [shopFilter, setShopFilter] = useState("");
  const [auditorFilter, setAuditorFilter] = useState("");
  const [districtFilter, setdistrictFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAudits = filteredAudits

  const { user } = useAuth();

  // Backend Filter Logic
  useEffect(() => {
    applyBackendFilter();
  }, []);

  const applyBackendFilter = async () => {
    setFilterLoading(true);
    try {
      const filterData = {
        startDate: fromDate || undefined,
        endDate: toDate || undefined,
        auditor: auditorFilter ? filteredAudits.find(a => a.auditor?.name === auditorFilter)?.auditor?._id : undefined,
        shop: shopFilter ? filteredAudits.find(a => a.shop?.shopName === shopFilter)?.shop?._id : undefined,
        status: statusFilter || undefined,
        minRating: minRating || undefined,
        maxRating: maxRating || undefined,
        district: districtFilter || undefined,
        page: currentPage,
        limit: itemsPerPage
      };

      const response = await filterAudits(filterData);
      setFilteredAudits(response.data.audits || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Filter error:", err);
      setFilteredAudits([]);
      setTotalPages(1);
    } finally {
      setFilterLoading(false);
    }
  };

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setShopFilter("");
    setAuditorFilter("");
    setdistrictFilter("");
    setStatusFilter("");
    setMinRating("");
    setMaxRating("");
    setCurrentPage(1);
    applyBackendFilter()
  };

  const handleApply = () => {
    setCurrentPage(1);
    applyBackendFilter();
  };

  const exportToExcel = async() => {
    setExportLoading(true);
    try {
      // Fetch all data for export (without pagination)
      const filterData = {
        startDate: fromDate || undefined,
        endDate: toDate || undefined,
        auditor: auditorFilter ? filteredAudits.find(a => a.auditor?.name === auditorFilter)?.auditor?._id : undefined,
        shop: shopFilter ? filteredAudits.find(a => a.shop?.shopName === shopFilter)?.shop?._id : undefined,
        status: statusFilter || undefined,
        minRating: minRating || undefined,
        maxRating: maxRating || undefined,
        district: districtFilter || undefined,
        page: 1,
        limit: 10000 // Large limit to get all data
      };

      const response = await filterAudits(filterData);
      const allFilteredAudits = response.data.audits || [];

      // Basic headers
      const headers = [
        "S.No",
        "Shop Name",
        "Owner Name",
        "Address",
        "Phone",
        "Email",
        "Audit Date",
        "Status",
        "Overall Rating",
      ];

      // Add auditor info for super-admin
      if (user?.role === "super-admin") {
        headers.push(
          "Auditor Name",
          "Auditor Phone",
          "Auditor Email",
          "In Time",
          "Out Time"
        );
      }

      // Add inside shop areas dynamically
      const insideShopAreas = [
        "dining",
        "dustbin",
        "frontView",
        "handWash",
        "hotCounter",
        "iceCreamCounter",
        "juiceBar",
        "liveSnackDisplay",
        "normalCounter",
        "snackCounter",
        "teaCounter"
      ];

      insideShopAreas.forEach(area => {
        headers.push(`${area} Rating`, `${area} Hygiene`, `${area} Remark`, `${area} Image URLs`);
      });

      // Wall branding sections
      const wallSections = ["bakshanamSection", "bunzoSection", "map", "menuBrand", "pillarBranding"];
      wallSections.forEach(section => {
        headers.push(`${section} Rating`, `${section} Available`, `${section} Remark`, `${section} Image URLs`);
      });

      // Tea & Coffee audit details
      headers.push(
        "Tea Quality", "Tea Taste", "Tea Color", "Tea Sugar Level", "Tea Temperature", "Tea Aroma", "Tea Rating", "Tea Image URLs",
        "Coffee Quality", "Coffee Taste", "Coffee Color", "Coffee Sugar Level", "Coffee Temperature", "Coffee Aroma", "Coffee Rating", "Coffee Image URLs"
      );

      // Bakery stock
      headers.push("Bakery Products"); // We'll combine product info into a single cell
      const products = await getProducts()

      // Generate rows
      const rows = allFilteredAudits.map((audit, index) => {
        const row = [
          index + 1,
          audit.shop?.shopName || "",
          audit.shop?.ownerName || "",
          audit.shop?.address || "",
          audit.shop?.phone || "",
          audit.shop?.email || "",
          audit.auditDate ? new Date(audit.auditDate).toLocaleDateString("en-GB") : "",
          audit.status || "",
          audit.status === "completed" ? audit.rating : "",
        ];

        // Super-admin details
        if (user?.role === "super-admin") {
          row.push(
            audit.auditor?.name || "",
            audit.auditor?.phone || "",
            audit.auditor?.email || "",
            formatTime(audit.inTime) || "0:00",
            formatTime(audit.outTime) || "0:00"
          );
        }

        // Inside shop areas
        insideShopAreas.forEach(area => {
          const data = audit.insideShop?.[area] || {};
          const images = data.captureImages?.map(img => img.imageUrl).join("; ") || "";
          row.push(data.rating || "", data.hygiene || "", data.remark || "", images);
        });

        // Wall branding
        wallSections.forEach(section => {
          const data = audit.wallBranding?.[section] || {};
          const images = data.captureImages?.map(img => img.imageUrl).join("; ") || "";
          row.push(data.rating || "", data.available || "", data.remark || "", images);
        });

        // Tea audit
        const tea = audit.teaAudit || {};
        const teaImages = tea.captureImages?.map(img => img.imageUrl).join("; ") || "";
        row.push(
          tea.quality || "", tea.taste || "", tea.color || "", tea.sugarLevel || "", tea.temperature || "", tea.aroma || "", tea.rating || "", teaImages
        );

        // Coffee audit
        const coffee = audit.coffeeAudit || {};
        const coffeeImages = coffee.captureImages?.map(img => img.imageUrl).join("; ") || "";
        row.push(
          coffee.quality || "", coffee.taste || "", coffee.color || "", coffee.sugarLevel || "", coffee.temperature || "", coffee.aroma || "", coffee.rating || "", coffeeImages
        );
        // Bakery products
        const bakeryProducts = audit.bakeryProducts?.map(p => {
          
          const expiry = p.expiryDate ? new Date(p.expiryDate).toLocaleDateString("en-GB") : "N/A";
          return `${products?.data?.find(pro=>pro._id===p.product)?.name || "Unknown"} (${p.quantity}, Exp: ${expiry})`;
        }).join("; ") || "";
        row.push(bakeryProducts);

        return row;
      });

      // Convert to CSV
      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Audit_Reports_${fromDate || "All"}_to_${toDate || "All"}_${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export data. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <h2 className="text-2xl poppins-semibold ">Audits</h2>

      <div className="bg-white p-4 rounded-lg shadow mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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

            {[...new Set(filteredAudits.map((a) => a.auditor?.name))].map(
              (auditor, index) =>
                auditor && (
                  <option key={index} value={auditor}>
                    {auditor}
                  </option>
                )
            )}
          </select>
        </div>
        {/* district Filter */}
        <div>
          <label className="block text-gray-700 poppins-regular">
            Filter by district
          </label>
          <select
            className="border p-2 w-full rounded"
            value={districtFilter}
            onChange={(e) => setdistrictFilter(e.target.value)}
          >
            <option value="">All districts</option>

            {/* Populate unique districts */}
            {[
              ...new Set(
                filteredAudits
                  .filter((a) => {

                    const auditorMatch = auditorFilter
                      ? a.auditor?.name?.toLowerCase() === auditorFilter.toLowerCase()
                      : true;

                    return auditorMatch;
                  })
                  .map((a) => a.shop?.district)
                  .filter(Boolean)
              ),
            ].map(
              (district, index) =>
                district && (
                  <option key={index} value={district}>
                    {district}
                  </option>
                )
            )}
          </select>
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

            {/* Populate unique shop names based on selected district */}
            {[
              ...new Set(
                filteredAudits
                  .filter((a) => {
                    const districtMatch = districtFilter
                      ? a.shop?.district?.toLowerCase() === districtFilter.toLowerCase()
                      : true;

                    const auditorMatch = auditorFilter
                      ? a.auditor?.name?.toLowerCase() === auditorFilter.toLowerCase()
                      : true;

                    return districtMatch && auditorMatch;
                  })
                  .map((a) => a.shop?.shopName)
                  .filter(Boolean)
              ),
            ].map(
              (shop, index) =>
                shop && (
                  <option key={index} value={shop}>
                    {shop}
                  </option>
                )
            )}
          </select>
        </div>
        {/* Status Filter */}
        <div>
          <label className="block text-gray-700 poppins-regular">
            Filter by Status
          </label>
          <select
            className="border p-2 w-full rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {/* Rating Range Filter */}
        <div>
          <label className="block text-gray-700 poppins-regular">
            Min Rating
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="border p-2 w-full rounded"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-gray-700 poppins-regular">
            Max Rating
          </label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            className="border p-2 w-full rounded"
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            placeholder="5"
          />
        </div>
        {/* Apply Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={handleApply}
            disabled={filterLoading}
            className={`px-4 py-2 w-full rounded font-semibold ${
              filterLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Apply
          </button>
        </div>
        {/* Reset Button */}
        <div className="flex justify-center items-center">
          <button
            onClick={resetFilters}
            disabled={filterLoading}
            className={`px-4 py-2 w-full rounded font-semibold ${
              filterLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Reset
          </button>
        </div>
        {/* Export Button */}
        <div className=" flex justify-center items-center">
          <button
            onClick={exportToExcel}
            disabled={filteredAudits.length === 0 || exportLoading}
            className={`px-4 py-2 w-full rounded font-semibold ${
              filteredAudits.length === 0 || exportLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {exportLoading ? "Exporting..." : "Export"}
          </button>
        </div>
      </div>

      {filterLoading ? (
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
                          audit.status === "completed"
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
                      <tr key={audit._id}>
                        <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
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
                            audit.status === "completed"
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
                        colSpan={user?.role === "super-admin" ? 6 : 5}
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
            onClick={() => {
              setCurrentPage((p) => p - 1);
              applyBackendFilter();
            }}
            className={`px-3 py-1 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-red-600 text-white"
            }`}
          >
            Prev
          </button>

          {/* Page 1 */}
          <button
            onClick={() => {
              setCurrentPage(1);
              applyBackendFilter();
            }}
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
                onClick={() => {
                  setCurrentPage(page);
                  applyBackendFilter();
                }}
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
            onClick={() => {
              setCurrentPage(totalPages);
              applyBackendFilter();
            }}
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
            onClick={() => {
              setCurrentPage((p) => p + 1);
              applyBackendFilter();
            }}
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
