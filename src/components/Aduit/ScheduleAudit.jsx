import React, { useEffect, useState, useRef } from 'react';
import { FaCalendarAlt, FaStar, FaStore, FaSearch, FaUserTie, FaMapMarkerAlt, FaCheck, FaTimes } from 'react-icons/fa';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { getAllShops } from '../../API/shop';
import { assignManualAuditsV2, deleteAuditV2, approveAuditV2 } from '../../API/auditV2';
import { getAllAuditors } from '../../API/auditor';
import { getRoute } from '../../API/createRoute';
import { getExpiryAlerts } from '../../API/dashboard';
import { FaStoreSlash } from 'react-icons/fa';

const ScheduleAudit = () => {
  const [shops, setShops] = useState([]);
  const [auditors, setAuditors] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedAuditorId, setSelectedAuditorId] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, auditId: null, shopName: '' });
  const [expiredProductsModal, setExpiredProductsModal] = useState({ isOpen: false, shopName: '', products: [] });
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const [filterNoAudit, setFilterNoAudit] = useState(false);
  const [filterExpiry, setFilterExpiry] = useState(false);
  const [filterLowRate, setFilterLowRate] = useState(false);
  const [filterAgeing, setFilterAgeing] = useState(false);

  const EXPIRY_DAYS = 30;
  const baseDataRef = useRef({ shops: [], auditors: [], routes: [], expiry: [] });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchData();
    }
  }, []);

  const fetchData = async (refreshOnly = false) => {
    setLoading(true);
    try {
      let shopsData, auditorsData, routesData, expiredProductAlerts;

      if (!refreshOnly) {
        const [shopsRes, auditorsRes, routesRes, expiryRes] = await Promise.all([
          getAllShops({ withLatestAudit: true }),
          getAllAuditors({ withFutureAudits: true }),
          getRoute(),
          getExpiryAlerts()
        ]);
        shopsData = shopsRes?.data || [];
        auditorsData = (auditorsRes?.data || []).filter(a => a.role === 'auditor');
        routesData = routesRes?.data || [];
        expiredProductAlerts = expiryRes?.data?.expiredProductAlerts || [];

        baseDataRef.current = {
          shops: shopsData,
          auditors: auditorsData,
          routes: routesData,
          expiry: expiredProductAlerts
        };
      } else {
        const [shopsRes, auditorsRes] = await Promise.all([
          getAllShops({ withLatestAudit: true }),
          getAllAuditors({ withFutureAudits: true })
        ]);
        shopsData = shopsRes?.data || [];
        auditorsData = (auditorsRes?.data || []).filter(a => a.role === 'auditor');
        routesData = baseDataRef.current.routes;
        expiredProductAlerts = baseDataRef.current.expiry;
      }
      const expiredProductShops = expiredProductAlerts.map(s => s._id);

      const enhancedAuditors = auditorsData.map(auditor => {
        return { ...auditor, allAudits: auditor.allAudits || [] };
      });

      setAuditors(enhancedAuditors);
      setRoutes(routesData);

      const processedShops = shopsData.map(shop => {
        const latestAudit = shop.latestAudit || null;

        let rating = null;
        let auditDate = null;
        let expiryDate = null;
        let ageingDays = null;
        let isExpired = false;
        let badgeType = 'none';
        let badgeText = 'No Audit';

        if (latestAudit) {
          rating = latestAudit.overallRating || latestAudit.rating || 0;
          auditDate = dayjs(latestAudit.auditDate);
          expiryDate = auditDate.add(EXPIRY_DAYS, 'day');
          
          const now = dayjs();
          ageingDays = now.diff(auditDate, 'day');
          const daysToExpiry = expiryDate.diff(now, 'day');

          if (daysToExpiry < 0) {
            isExpired = true;
            badgeType = 'expired';
            badgeText = `Expired (${Math.abs(daysToExpiry)}d ago)`;
          } else if (daysToExpiry <= 7) {
            badgeType = 'warning';
            badgeText = `Expiring (${daysToExpiry}d)`;
          } else {
            badgeType = 'good';
            badgeText = `Valid (${daysToExpiry}d left)`;
          }
        } else {
          isExpired = true;
          badgeType = 'expired';
          badgeText = 'No Prior Audit';
        }

        const hasExpiredProducts = expiredProductShops.includes(shop._id);
        const expiredProductsList = hasExpiredProducts 
          ? (expiredProductAlerts.find(s => s._id === shop._id)?.expiredProducts || [])
          : [];

        return {
          ...shop,
          latestAudit,
          rating,
          auditDate: auditDate ? auditDate.toDate() : null,
          expiryDate: expiryDate ? expiryDate.toDate() : null,
          ageingDays,
          isExpired,
          badgeType,
          badgeText,
          hasExpiredProducts,
          expiredProductsList,
          assignedAuditorId: null // Track where it's dropped
        };
      });

      processedShops.sort((a, b) => {
        if (!a.latestAudit && b.latestAudit) return -1;
        if (a.latestAudit && !b.latestAudit) return 1;
        if (a.isExpired && !b.isExpired) return -1;
        if (!a.isExpired && b.isExpired) return 1;
        
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingA !== ratingB) return ratingA - ratingB;

        const expA = a.expiryDate ? a.expiryDate.getTime() : 0;
        const expB = b.expiryDate ? b.expiryDate.getTime() : 0;
        return expA - expB;
      });

      setShops(processedShops);
    } catch (err) {
      toast.error('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, shopId) => {
    e.dataTransfer.setData('shopId', shopId);
    e.target.classList.add('opacity-50');
  };

  const handleViewExpiredProducts = (shop) => {
    setExpiredProductsModal({
      isOpen: true,
      shopName: shop.shopName,
      products: shop.expiredProductsList
    });
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e, auditorId) => {
    e.preventDefault();
    const shopId = e.dataTransfer.getData('shopId');
    if (!shopId) return;

    // Check if already assigned to this auditor
    const shop = shops.find(s => s._id === shopId);
    if (shop?.assignedAuditorId === auditorId) return;

    setShops(prevShops => prevShops.map(s => 
      s._id === shopId ? { ...s, assignedAuditorId: auditorId } : s
    ));
    
    // We removed the toast here so it doesn't spam on drag and drop. 
    // They can click "Schedule" to finalize.
  };

  const handleScheduleAuditor = async (auditor, assignedShops) => {
    if (assignedShops.length === 0) return;

    try {
      const shopIds = assignedShops.map(s => s._id);
      const auditDate = weekDates[selectedDayIndex];
      await assignManualAuditsV2({ auditorId: auditor._id, shopIds, auditDate });
      toast.success(`Successfully scheduled ${assignedShops.length} shop(s) for ${auditor.name} on ${dayShortLabels[selectedDayIndex]}`);
      fetchData(true); // Refresh only audits
    } catch (err) {
      toast.error(`Failed to schedule for ${auditor.name}: ` + (err.response?.data?.message || err.message));
      setShops(prevShops => prevShops.map(s => 
        s.assignedAuditorId === auditor._id ? { ...s, assignedAuditorId: null } : s
      ));
    }
  };

  const handleRemoveAudit = (auditId, shopName) => {
    setDeleteModal({ isOpen: true, auditId, shopName });
  };

  const confirmRemoveAudit = async () => {
    const { auditId, shopName } = deleteModal;
    try {
      await deleteAuditV2(auditId);
      toast.success(`Successfully removed scheduled audit for ${shopName}`);
      fetchData(true); // Refresh only audits
    } catch (err) {
      toast.error(`Failed to remove audit: ` + (err.response?.data?.message || err.message));
    } finally {
      setDeleteModal({ isOpen: false, auditId: null, shopName: '' });
    }
  };

  const handleApproveAudit = async (auditId) => {
    try {
      await approveAuditV2(auditId);
      toast.success('Audit approved successfully');
      fetchData(true); // Refresh only audits
    } catch (err) {
      toast.error(`Failed to approve audit: ` + (err.response?.data?.message || err.message));
    }
  };

  const selectedRoute = routes.find(r => r._id === selectedRouteId);
  const shopsInSelectedRoute = selectedRoute ? selectedRoute.shops.map(s => s._id) : null;

  const unassignedShops = shops.filter(s => {
    if (s.assignedAuditorId) return false;
    if (searchTerm && !s.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) && !s.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (shopsInSelectedRoute && !shopsInSelectedRoute.includes(s._id)) return false;

    if (filterNoAudit && s.latestAudit) return false;
    if (filterExpiry && !s.hasExpiredProducts) return false;
    if (filterLowRate && (s.rating === null || s.rating >= 3)) return false;
    if (filterAgeing && !(s.badgeType === 'expired' || s.badgeType === 'warning')) return false;

    return true;
  });

  const getWeekDates = () => {
    const dates = [];
    const curr = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(curr);
      nextDate.setDate(curr.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  };
  const weekDates = getWeekDates();
  const dayShortLabels = weekDates.map(d => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${dayNames[d.getDay()]} (${d.getDate()} ${monthNames[d.getMonth()]})`;
  });

  return (
    <div className="h-full w-full flex flex-col overflow-hidden max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-2.5 rounded-xl shadow-sm">
            <FaCalendarAlt size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Schedule Audit</h1>
            <p className="text-sm text-gray-500 mt-0.5">Drag and drop shops to assign auditors</p>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-1 gap-6 overflow-hidden">
          
          {/* Left Column: Shops List */}
          <div className="w-1/3 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FaStore className="text-gray-500" /> 
                Available Shops ({unassignedShops.length})
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2 mb-1">
                  <button
                    onClick={() => setFilterNoAudit(!filterNoAudit)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${filterNoAudit ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    No Audit
                  </button>
                  <button
                    onClick={() => setFilterExpiry(!filterExpiry)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${filterExpiry ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Expired Products
                  </button>
                  <button
                    onClick={() => setFilterLowRate(!filterLowRate)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${filterLowRate ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Low Rating (&lt;3)
                  </button>
                  <button
                    onClick={() => setFilterAgeing(!filterAgeing)}
                    className={`px-2 py-1 text-xs rounded-full border transition-colors ${filterAgeing ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                  >
                    Ageing (Overdue)
                  </button>
                </div>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Routes</option>
                  {routes.map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search available shops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 scrollbar-custom"
                 onDragOver={handleDragOver}
                 onDrop={(e) => handleDrop(e, null)} // Allow dropping back to unassigned
            >
              {unassignedShops.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-10">No available shops found.</div>
              ) : (
                unassignedShops.map(shop => (
                  <ShopCard 
                    key={shop._id} 
                    shop={shop} 
                    onDragStart={(e) => handleDragStart(e, shop._id)}
                    onDragEnd={handleDragEnd}
                    onViewExpiredProducts={handleViewExpiredProducts}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column: Auditor Cart */}
          <div className="w-2/3 flex flex-col bg-gray-50 rounded-2xl border border-gray-200 p-4 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaUserTie className="text-gray-500" /> 
                Auditor Cart
              </h2>
              <select
                value={selectedAuditorId}
                onChange={(e) => setSelectedAuditorId(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Auditor...</option>
                {auditors.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>

            {selectedAuditorId && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-custom flex-shrink-0">
                {dayShortLabels.map((label, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDayIndex(index)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      selectedDayIndex === index
                        ? "bg-red-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-custom">
              {!selectedAuditorId ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
                  Please select an auditor to assign shops
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {auditors.filter(a => a._id === selectedAuditorId).map(auditor => {
                    const assignedShops = shops.filter(s => s.assignedAuditorId === auditor._id);
                  
                  return (
                    <div 
                      key={auditor._id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, auditor._id)}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[250px] transition-colors hover:border-red-300"
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/80 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800">{auditor.name}</span>
                          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full" title="Newly Assigned in Cart">
                            {assignedShops.length} in cart
                          </span>
                        </div>
                        <button 
                          onClick={() => handleScheduleAuditor(auditor, assignedShops)}
                          disabled={assignedShops.length === 0}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                        >
                          Schedule
                        </button>
                      </div>

                      {(() => {
                        const selectedDateStart = dayjs(weekDates[selectedDayIndex]).startOf('day');
                        const selectedDateEnd = dayjs(weekDates[selectedDayIndex]).endOf('day');
                        
                        const dayAudits = auditor.allAudits?.filter(a => {
                          const aDate = dayjs(a.auditDate);
                          return aDate.isAfter(selectedDateStart) && aDate.isBefore(selectedDateEnd);
                        }) || [];

                        return dayAudits.length > 0 && (
                          <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex flex-wrap gap-1 items-center">
                            <span className="text-xs font-semibold text-blue-800 mr-2">Scheduled for {dayShortLabels[selectedDayIndex]} ({dayAudits.length}):</span>
                            {dayAudits.map((a, idx) => (
                              <div key={a._id || idx} className={`flex items-center text-[11px] px-2.5 py-1 rounded-md border ${a.status === 'pending_approval' ? 'bg-yellow-50 text-yellow-800 border-yellow-300 shadow-sm' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                                <span className="font-medium">{a.shop?.shopName || 'Unknown Shop'} {a.status === 'pending_approval' ? <span className="font-normal italic text-[10px] opacity-80 ml-1">(Pending Approval)</span> : a.status === 'completed' ? '(Done)' : ''}</span>
                                {a.status === 'pending_approval' && (
                                  <button 
                                    onClick={() => handleApproveAudit(a._id)}
                                    className="ml-2 bg-green-500 hover:bg-green-600 text-white rounded p-1 transition-colors shadow-sm flex items-center justify-center"
                                    title="Approve Scheduled Audit"
                                  >
                                    <FaCheck size={10} />
                                  </button>
                                )}
                                {a.status !== 'completed' && (
                                  <button 
                                    onClick={() => handleRemoveAudit(a._id, a.shop?.shopName)}
                                    className={`ml-1 hover:text-white rounded p-1 transition-colors shadow-sm flex items-center justify-center ${a.status === 'pending_approval' ? 'text-red-600 bg-red-100 hover:bg-red-500' : 'text-blue-600 hover:bg-blue-600 hover:text-white'}`}
                                    title="Remove Scheduled Audit"
                                  >
                                    <FaTimes size={10} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                      
                      <div className="p-3 flex-1 overflow-y-auto space-y-2 bg-slate-50/30">
                        {assignedShops.length === 0 ? (
                          <div className="text-center text-gray-400 text-sm py-6 border-2 border-dashed border-gray-200 rounded-lg">
                            Drop shops here
                          </div>
                        ) : (
                          assignedShops.map(shop => (
                            <ShopCard 
                              key={shop._id} 
                              shop={shop} 
                              compact 
                              onDragStart={(e) => handleDragStart(e, shop._id)}
                              onDragEnd={handleDragEnd}
                              onViewExpiredProducts={handleViewExpiredProducts}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden p-6 text-center transform transition-all scale-100 opacity-100">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <FaStoreSlash className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Scheduled Audit</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove the scheduled audit for <span className="font-semibold text-gray-800">{deleteModal.shopName}</span>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, auditId: null, shopName: '' })}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRemoveAudit}
                className="flex-1 px-4 py-2 bg-red-600 rounded-xl text-white font-medium hover:bg-red-700 shadow-md shadow-red-500/30 transition-all hover:-translate-y-0.5"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expired Products Modal */}
      {expiredProductsModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4 pr-6">Expired Products - {expiredProductsModal.shopName}</h3>
            <div className="max-h-96 overflow-y-auto pr-2">
              {expiredProductsModal.products?.length > 0 ? (
                <ul className="space-y-3">
                  {expiredProductsModal.products.map((prod, idx) => (
                    <li key={idx} className="bg-red-50 p-3 rounded-lg border border-red-100">
                      <p className="font-semibold text-gray-800 text-sm">{prod.name}</p>
                      <p className="text-red-600 text-xs mt-1">Details: {prod.details}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No expired products details available.</p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setExpiredProductsModal({ isOpen: false, shopName: '', products: [] })} 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Shop Card Component
const ShopCard = ({ shop, onDragStart, onDragEnd, compact = false, onViewExpiredProducts }) => {
  const badgeColors = {
    expired: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    good: 'bg-green-50 text-green-700 border-green-200',
    none: 'bg-gray-50 text-gray-600 border-gray-200'
  };

  return (
    <div 
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white border rounded-lg cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-all group ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold text-gray-900 group-hover:text-red-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
          {shop.shopName}
        </h3>
        {shop.latestAudit && (
          <div className={`flex items-center gap-1 font-bold text-xs ${shop.rating < 3 ? 'text-red-500' : 'text-green-600'}`}>
            {shop.rating} <FaStar size={10} />
          </div>
        )}
      </div>
      
      {!compact && (
        <p className="flex items-center text-xs text-gray-500 mb-3 truncate" title={shop.address}>
          <FaMapMarkerAlt className="mr-1 flex-shrink-0" /> {shop.address}
        </p>
      )}

      {shop.hasExpiredProducts && (
        <div 
          onClick={() => onViewExpiredProducts && onViewExpiredProducts(shop)}
          className="flex items-center text-[10px] text-purple-600 font-semibold mb-2 bg-purple-50 px-2 py-1 rounded w-fit border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors"
        >
          <FaStoreSlash className="mr-1" /> Expired Products Detected
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColors[shop.badgeType]}`}>
          {shop.badgeText}
        </span>
        {shop.expiryDate && !compact && (
          <span className="text-[10px] text-gray-400 font-medium">
            Exp: {dayjs(shop.expiryDate).format('DD MMM')}
          </span>
        )}
      </div>
    </div>
  );
};

export default ScheduleAudit;
