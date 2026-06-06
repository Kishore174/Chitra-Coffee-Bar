import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaStar, FaStore, FaSearch, FaUserTie, FaMapMarkerAlt } from 'react-icons/fa';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { getAllShops } from '../../API/shop';
import { getAllAuditsV2, assignManualAuditsV2 } from '../../API/auditV2';
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

  const EXPIRY_DAYS = 30;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shopsRes, auditsRes, auditorsRes, routesRes, expiryRes] = await Promise.all([
        getAllShops(),
        getAllAuditsV2(),
        getAllAuditors(),
        getRoute(),
        getExpiryAlerts()
      ]);

      const shopsData = shopsRes?.data || [];
      const auditsData = auditsRes?.data || [];
      const auditorsData = auditorsRes?.data || [];
      const routesData = routesRes?.data || [];
      const expiredProductShops = expiryRes?.data?.expiredProductAlerts?.map(s => s._id) || [];

      setAuditors(auditorsData);
      setRoutes(routesData);

      const processedShops = shopsData.map(shop => {
        const shopAudits = auditsData.filter(a => a.shop?._id === shop._id);
        shopAudits.sort((a, b) => new Date(b.auditDate) - new Date(a.auditDate));
        const latestAudit = shopAudits[0] || null;

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
      await assignManualAuditsV2({ auditorId: auditor._id, shopIds });
      toast.success(`Successfully scheduled ${assignedShops.length} shop(s) for ${auditor.name}`);
      fetchData(); // Refresh the list from the server
    } catch (err) {
      toast.error(`Failed to schedule for ${auditor.name}: ` + (err.response?.data?.message || err.message));
    }
  };

  const selectedRoute = routes.find(r => r._id === selectedRouteId);
  const shopsInSelectedRoute = selectedRoute ? selectedRoute.shops.map(s => s._id) : null;

  const unassignedShops = shops.filter(s => {
    if (s.assignedAuditorId) return false;
    if (searchTerm && !s.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) && !s.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (shopsInSelectedRoute && !shopsInSelectedRoute.includes(s._id)) return false;
    return true;
  });

  return (
    <div className="min-h-screen px-4 py-6 max-w-screen-xl mx-auto flex flex-col h-[calc(100vh-64px)] overflow-hidden">
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
                          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            {assignedShops.length}
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
    </div>
  );
};

// Reusable Shop Card Component
const ShopCard = ({ shop, onDragStart, onDragEnd, compact = false }) => {
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
        <p className="flex items-center text-[10px] text-purple-600 font-semibold mb-2 bg-purple-50 px-2 py-1 rounded w-fit border border-purple-200">
          <FaStoreSlash className="mr-1" /> Expired Products Detected
        </p>
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
