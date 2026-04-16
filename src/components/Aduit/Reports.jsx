import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { filterAudits } from "../../API/audits";
import { useAuth } from "../../context/AuthProvider";
import Loader from "../Loader";
import { formatTime, calculateDuration, formatDuration } from "../../utils/tool";
import { getProducts } from "../../API/settings";
import { getAllShops } from "../../API/shop";
import { getAllEmployees } from "../../API/employee";

const STORAGE_KEY = "reports_filters";

const getSavedFilters = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const Reports = () => {
  const saved = getSavedFilters();
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [fromDate, setFromDate] = useState(saved.fromDate || "");
  const [toDate, setToDate] = useState(saved.toDate || "");
  const [shopFilter, setShopFilter] = useState(saved.shopFilter || "");
  const [employeeFilter, setEmployeeFilter] = useState(saved.employeeFilter || "");
  const [districtFilter, setdistrictFilter] = useState(saved.districtFilter || "");
  const [statusFilter, setStatusFilter] = useState(saved.statusFilter || "");
  const [minRating, setMinRating] = useState(saved.minRating || "");
  const [maxRating, setMaxRating] = useState(saved.maxRating || "");
  const [filterLoading, setFilterLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(saved.currentPage || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const [allShops, setAllShops] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  const { user } = useAuth();

  // Save filters to localStorage whenever they change
  useEffect(() => {
    const filters = { fromDate, toDate, shopFilter, employeeFilter, districtFilter, statusFilter, minRating, maxRating, currentPage };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [fromDate, toDate, shopFilter, employeeFilter, districtFilter, statusFilter, minRating, maxRating, currentPage]);

  // Fetch shops and employees on mount
  useEffect(() => {
    getAllShops().then((res) => setAllShops(res.data || [])).catch(() => {});
    getAllEmployees().then((res) => setAllEmployees(res.data || [])).catch(() => {});
    applyBackendFilter();
  }, []);

  const applyBackendFilter = useCallback(async (overrides = {}) => {
    setFilterLoading(true);
    try {
      const filterData = {
        startDate: fromDate || undefined,
        endDate: toDate || undefined,
        auditor: employeeFilter || undefined,
        shop: shopFilter || undefined,
        status: statusFilter || undefined,
        minRating: minRating || undefined,
        maxRating: maxRating || undefined,
        district: districtFilter || undefined,
        page: currentPage,
        limit: itemsPerPage,
        ...overrides,
      };

      // Clean undefined values
      Object.keys(filterData).forEach(
        (key) => filterData[key] === undefined && delete filterData[key]
      );

      const response = await filterAudits(filterData);
      setFilteredAudits(response.data.audits || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalItems(response.data.pagination?.totalItems || 0);
    } catch (err) {
      console.error("Filter error:", err);
      setFilteredAudits([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setFilterLoading(false);
    }
  }, [fromDate, toDate, employeeFilter, shopFilter, statusFilter, minRating, maxRating, districtFilter, currentPage]);

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setShopFilter("");
    setEmployeeFilter("");
    setdistrictFilter("");
    setStatusFilter("");
    setMinRating("");
    setMaxRating("");
    setCurrentPage(1);
    localStorage.removeItem(STORAGE_KEY);
    // Pass empty overrides to avoid stale state
    applyBackendFilter({
      startDate: undefined,
      endDate: undefined,
      auditor: undefined,
      shop: undefined,
      status: undefined,
      minRating: undefined,
      maxRating: undefined,
      district: undefined,
      page: 1,
    });
  };

  const handleApply = () => {
    setCurrentPage(1);
    applyBackendFilter({ page: 1 });
  };

  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      const filterData = {
        startDate: fromDate || undefined,
        endDate: toDate || undefined,
        auditor: employeeFilter || undefined,
        shop: shopFilter || undefined,
        status: statusFilter || undefined,
        minRating: minRating || undefined,
        maxRating: maxRating || undefined,
        district: districtFilter || undefined,
        page: 1,
        limit: 10000,
      };

      Object.keys(filterData).forEach(
        (key) => filterData[key] === undefined && delete filterData[key]
      );

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
          "Out Time",
          "Duration"
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
          audit.shop?.shopName || "N/A",
          audit.shop?.ownerName || "N/A",
          audit.shop?.address || "N/A",
          audit.shop?.phone || "N/A",
          audit.shop?.email || "N/A",
          audit.auditDate ? new Date(audit.auditDate).toLocaleDateString("en-GB") : "N/A",
          audit.status || "N/A",
          audit.status === "completed" ? audit.rating : 0,
        ];

        // Super-admin details
        if (user?.role === "super-admin") {
          row.push(
            audit.auditor?.name || "N/A",
            audit.auditor?.phone || "N/A",
            audit.auditor?.email || "N/A",
            formatTime(audit.inTime) || "N/A",
            formatTime(audit.outTime) || "N/A",
            formatDuration(calculateDuration(audit.inTime, audit.outTime)) || "N/A"
          );
        }

        // Inside shop areas
        insideShopAreas.forEach(area => {
          const data = audit.insideShop?.[area] || {};
          const images = data.captureImages?.map(img => img.imageUrl).join("; ") || "N/A";
          row.push(data.rating || 0, data.hygiene || "N/A", data.remark || "N/A", images);
        });

        // Wall branding
        wallSections.forEach(section => {
          const data = audit.wallBranding?.[section] || {};
          const images = data.captureImages?.map(img => img.imageUrl).join("; ") || "N/A";
          row.push(data.rating || 0, data.available || "N/A", data.remark || "N/A", images);
        });

        // Tea audit
        const tea = audit.teaAudit || {};
        const teaImages = tea.captureImages?.map(img => img.imageUrl).join("; ") || "N/A";
        row.push(
          tea.quality || "N/A", tea.taste || "N/A", tea.color || "N/A", tea.sugarLevel || "N/A", tea.temperature || "N/A", tea.aroma || "N/A", tea.rating || 0, teaImages
        );

        // Coffee audit
        const coffee = audit.coffeeAudit || {};
        const coffeeImages = coffee.captureImages?.map(img => img.imageUrl).join("; ") || "N/A";
        row.push(
          coffee.quality || "N/A", coffee.taste || "N/A", coffee.color || "N/A", coffee.sugarLevel || "N/A", coffee.temperature || "N/A", coffee.aroma || "N/A", coffee.rating || 0, coffeeImages
        );
        // Bakery products
        const bakeryProducts = audit.bakeryProducts?.map(p => {
          
          const expiry = p.expiryDate ? new Date(p.expiryDate).toLocaleDateString("en-GB") : "N/A";
          return `${products?.data?.find(pro=>pro._id===p.product)?.name || "Unknown"} (${p.quantity}, Exp: ${expiry})`;
        }).join("; ") || "N/A";
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
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl poppins-semibold text-gray-800">Audits</h2>
        <span className="text-sm text-gray-500 poppins-regular">
          {totalItems > 0 && `Showing ${filteredAudits.length} of ${totalItems} results`}
        </span>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              To Date
            </label>
            <input
              type="date"
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Employee Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Employee
            </label>
            <select
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition bg-white"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
            >
              <option value="">All Employees</option>
              {allEmployees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              District
            </label>
            <select
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition bg-white"
              value={districtFilter}
              onChange={(e) => {
                setdistrictFilter(e.target.value);
                setShopFilter("");
              }}
            >
              <option value="">All Districts</option>
              {[...new Set(allShops.map((s) => s.district).filter(Boolean))].map(
                (district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Shop Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Shop
            </label>
            <select
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition bg-white"
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
            >
              <option value="">All Shops</option>
              {allShops
                .filter((s) => !districtFilter || s.district === districtFilter)
                .map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.shopName}
                  </option>
                ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Rating Range */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Min Rating
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Max Rating
            </label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-400 outline-none transition"
              value={maxRating}
              onChange={(e) => setMaxRating(e.target.value)}
              placeholder="5"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={handleApply}
            disabled={filterLoading}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              filterLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
            }`}
          >
            {filterLoading ? "Loading..." : "Apply Filters"}
          </button>
          <button
            onClick={resetFilters}
            disabled={filterLoading}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              filterLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Reset
          </button>
          <button
            onClick={exportToExcel}
            disabled={filteredAudits.length === 0 || exportLoading}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ml-auto ${
              filteredAudits.length === 0 || exportLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
            }`}
          >
            {exportLoading ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {filterLoading ? (
        <Loader />
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="block md:hidden mt-4 space-y-3">
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit) => (
                <div
                  key={audit._id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="poppins-regular">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{audit.shop?.shopName}</div>
                        <div className="text-sm text-gray-500">{audit.shop?.ownerName}</div>
                      </div>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          audit.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : audit.status === "in progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {audit.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 mt-1">{audit.shop?.address}</div>

                    <div className="flex items-center gap-3 mt-3 text-sm">
                      <div className="text-gray-600">
                        {new Date(audit.auditDate).toLocaleDateString("en-GB")}
                      </div>
                      {audit.status === "completed" && (
                        <div className="poppins-semibold text-yellow-500">
                          Rating: {audit.rating}
                        </div>
                      )}
                    </div>

                    {user?.role === "super-admin" && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <span>{formatTime(audit.inTime) || "N/A"}</span>
                        <span>-</span>
                        <span>{formatTime(audit.outTime) || "N/A"}</span>
                        <span className="ml-2 text-blue-500">
                          {formatDuration(calculateDuration(audit.inTime, audit.outTime))}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        <div>{audit.shop?.phone}</div>
                        <a href={`mailto:${audit.shop?.email}`} className="text-blue-500">
                          {audit.shop?.email}
                        </a>
                      </div>
                      <div>
                        {audit.status !== "completed" ? (
                          <Link to={`/add-audit/${audit._id}`}>
                            <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                              Continue
                            </button>
                          </Link>
                        ) : (
                          <Link to={`/report/${audit._id}`}>
                            <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium">
                              View
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 poppins-regular">
                No audits found
              </div>
            )}
          </div>

          {/* Table View for Larger Screens */}
          <div className="hidden md:block mt-4">
            <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100">
              <table className="min-w-full bg-white">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                      Shop Details
                    </th>
                    {user?.role === "super-admin" && (
                      <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                        Auditor
                      </th>
                    )}
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                      Audit Status
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3.5 text-center text-xs font-semibold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAudits.length > 0 ? (
                    filteredAudits.map((audit, index) => (
                      <tr key={audit._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-sm text-gray-500 text-center">
                          {index + 1 + (currentPage - 1) * itemsPerPage}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <div className="poppins-regular">
                            <div className="font-semibold text-gray-900">{audit.shop?.shopName}</div>
                            <div className="text-gray-500">{audit.shop?.ownerName}</div>
                            <div className="text-gray-400 text-xs mt-0.5">
                              {audit.shop?.address?.length > 25
                                ? `${audit.shop?.address.slice(0, 25)}...`
                                : audit.shop?.address}
                            </div>
                            <a
                              href={audit.location}
                              className="text-blue-500 hover:text-blue-700 text-xs mt-1 inline-block"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on Map
                            </a>
                          </div>
                        </td>
                        {user?.role === "super-admin" && (
                          <td className="px-4 py-4 text-sm text-gray-700">
                            <div className="poppins-regular">
                              <div className="font-medium">{audit.auditor?.name}</div>
                              <div className="text-gray-400 text-xs">{audit.auditor?.phone}</div>
                              <div className="text-gray-400 text-xs">{audit.auditor?.email}</div>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-4 text-sm">
                          <div className="text-center space-y-1">
                            {audit.status === "completed" && (
                              <div className="poppins-semibold text-yellow-500 text-lg">
                                {audit.rating}
                              </div>
                            )}
                            <div className="text-gray-800 text-xs">
                              {new Date(audit.auditDate).toLocaleDateString("en-GB")}
                            </div>
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                audit.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : audit.status === "in progress"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {audit.status}
                            </span>
                            {user?.role === "super-admin" && (
                              <div className="flex items-center gap-1 justify-center text-xs text-gray-400 mt-1">
                                <span>{formatTime(audit.inTime) || "N/A"}</span>
                                <span>-</span>
                                <span>{formatTime(audit.outTime) || "N/A"}</span>
                                <span className="ml-2 text-blue-500">
                                  {formatDuration(calculateDuration(audit.inTime, audit.outTime))}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 poppins-regular text-sm text-gray-700">
                          <div>{audit.shop?.phone}</div>
                          <a
                            href={`mailto:${audit.shop?.email}`}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                          >
                            {audit.shop?.email}
                          </a>
                        </td>
                        <td className="px-4 py-4 text-sm text-center">
                          {audit.status !== "completed" &&
                          user?.role !== "super-admin" ? (
                            <Link to={`/add-audit/${audit._id}`}>
                              <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs">
                                Continue
                              </button>
                            </Link>
                          ) : (
                            <Link to={`/report/${audit?._id}`}>
                              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs">
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
                        colSpan={user?.role === "super-admin" ? 7 : 5}
                        className="text-center py-12 text-gray-400 poppins-regular"
                      >
                        No audits found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 mb-4">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              const newPage = currentPage - 1;
              setCurrentPage(newPage);
              applyBackendFilter({ page: newPage });
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300"
            }`}
          >
            Prev
          </button>

          <button
            onClick={() => {
              setCurrentPage(1);
              applyBackendFilter({ page: 1 });
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? "bg-red-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
            }`}
          >
            1
          </button>

          {currentPage > 3 && <span className="px-2 text-gray-400">...</span>}

          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((p) => p > 1 && p < totalPages)
            .map((page) => (
              <button
                key={page}
                onClick={() => {
                  setCurrentPage(page);
                  applyBackendFilter({ page });
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-red-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
                }`}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 2 && <span className="px-2 text-gray-400">...</span>}

          {totalPages > 1 && (
            <button
              onClick={() => {
                setCurrentPage(totalPages);
                applyBackendFilter({ page: totalPages });
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-red-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50"
              }`}
            >
              {totalPages}
            </button>
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              const newPage = currentPage + 1;
              setCurrentPage(newPage);
              applyBackendFilter({ page: newPage });
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300"
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
