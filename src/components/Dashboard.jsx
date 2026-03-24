import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { BuildingStorefrontIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { getDashboardAdmin, getDashboardAuditor, getExpiryAlerts } from '../API/dashboard';
import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import dayjs from 'dayjs';
import { FaExclamationTriangle } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [shopCount, setShopCount] = useState(0);
  const [auditorsCount, setAuditorsCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [auditsCount, setAuditsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [fssaiAlerts, setFssaiAlerts] = useState([]);
  const [commercialAlerts, setCommercialAlerts] = useState([]);


  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        setIsLoading(true); // Start loading
        try {
          const response =
            user.role === 'super-admin'
              ? await getDashboardAdmin()
              : await getDashboardAuditor(user._id);
          if (response) {
            const {
              auditorsCount,
              shopsCount,
              routesCount,
              totalAudits,
              pendingAudit,
              completedAudits,
            } = response.data;
            setRoutesCount(routesCount || 0);
            setAuditorsCount(auditorsCount || 0);
            setShopCount(shopsCount || 0);
            setAuditsCount(totalAudits || 0);
            setPendingCount(pendingAudit || 0);
            setCompletedCount(completedAudits || 0);
          }
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
        } finally {
          setIsLoading(false); // End loading
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await getExpiryAlerts();
        setFssaiAlerts(res.data.fssaiAlerts || []);
        if (user?.role === 'super-admin') {
          setCommercialAlerts(res.data.commercialAlerts || []);
        }
      } catch (err) {
        console.error('Error fetching expiry alerts:', err);
      }
    };
    if (user) fetchAlerts();
  }, [user]);

  const visibleFssai = [...fssaiAlerts].sort((a, b) => new Date(a.fssiRenewalDate) - new Date(b.fssiRenewalDate));
  const visibleCommercial = [...commercialAlerts].sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate));

  const getDaysLeft = (dateStr) => {
    if (!dateStr) return null;
    const diff = dayjs(dateStr).diff(dayjs(), 'day');
    return diff;
  };

  const SkeletonCard = () => (
    <ContentLoader
      speed={2}
      width="100%"
      height="100%"
      viewBox="0 0 400 100"
      backgroundColor="#EF4444"
      foregroundColor="#ecebeb"
      className="p-6 rounded-lg shadow-lg"
    >
      <rect x="10" y="10" rx="4" ry="4" width="60" height="60" />
      <rect x="80" y="20" rx="4" ry="4" width="200" height="10" />
      <rect x="80" y="40" rx="4" ry="4" width="150" height="10" />
    </ContentLoader>
  );

  return (
    <div className="p-6 min-h-screen poppins-regular">
      <h2 className="text-2xl poppins-semibold mb-2 text-start p-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {user && user.role === 'super-admin' && (
          <>
            <Link to="/myshop">
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
                  <BuildingStorefrontIcon className="text-white h-12 w-12" />
                  <div>
                    <h2 className="text-2xl font-bold text-center text-white">{shopCount}</h2>
                    <p className="text-white whitespace-nowrap">Number of Shops</p>
                  </div>
                </div>
              )}
            </Link>

            <Link to="/auditors">
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
                  <BuildingStorefrontIcon className="text-white h-12 w-12" />
                  <div>
                    <h2 className="text-2xl font-bold text-center text-white">{auditorsCount}</h2>
                    <p className="text-white whitespace-nowrap">Number of Auditors</p>
                  </div>
                </div>
              )}
            </Link>

            <Link to="/routes">
              {isLoading ? (
                <SkeletonCard />
              ) : (
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
                  <BuildingStorefrontIcon className="text-white h-12 w-12" />
                  <div>
                    <h2 className="text-2xl font-bold text-center text-white">{routesCount}</h2>
                    <p className="text-white whitespace-nowrap">Number of Routes</p>
                  </div>
                </div>
              )}
            </Link>
          </>
        )}
      </div>

      {user && user.role === 'super-admin' && (
        <h2 className="text-2xl font-semibold mb-2 text-start p-4">Today Overview</h2>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-blue-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <ClipboardDocumentCheckIcon className="text-white h-12 w-12" />
              <div>
                <h2 className="text-2xl font-bold text-center text-white">{auditsCount}</h2>
                <p className="text-white whitespace-nowrap">Audits</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <ClipboardDocumentCheckIcon className="text-white h-12 w-12" />
              <div>
                <h2 className="text-2xl font-bold text-center text-white">{completedCount}</h2>
                <p className="text-white whitespace-nowrap">Completed Audits</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
              <ClipboardDocumentListIcon className="text-white h-12 w-12" />
              <div>
                <h2 className="text-2xl font-bold text-center text-white">{pendingCount}</h2>
                <p className="text-white whitespace-nowrap">Pending Audits</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Expiry Alerts - Below Today Overview */}
      {(visibleFssai.length > 0 || (user?.role === 'super-admin' && visibleCommercial.length > 0)) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* FSSAI Certificate Expiry Alerts */}
          {visibleFssai.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaExclamationTriangle className="text-orange-500" />
                <h3 className="poppins-semibold text-orange-800 text-sm">FSSAI Certificate Alerts</h3>
                <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full">{visibleFssai.length}</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {visibleFssai.map((shop) => {
                  const days = getDaysLeft(shop.fssiRenewalDate);
                  const isExpired = days !== null && days < 0;
                  return (
                    <div
                      key={shop._id}
                      onClick={() => navigate('/addshop', { state: { shop, isEdit: true } })}
                      className={`flex items-center justify-between ${isExpired ? 'bg-red-50 border-red-200' : 'bg-white border-orange-100'} border rounded-md px-3 py-2 cursor-pointer hover:shadow-sm transition`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm poppins-medium text-gray-800 truncate">{shop.shopName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {dayjs(shop.fssiRenewalDate).format('DD MMM YYYY')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full poppins-medium whitespace-nowrap flex-shrink-0 ml-2 ${isExpired ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {isExpired
                          ? (Math.abs(days) >= 365 ? `Expired ${Math.floor(Math.abs(days) / 365)}y ${Math.floor((Math.abs(days) % 365) / 30)}m ago` : Math.abs(days) >= 30 ? `Expired ${Math.floor(Math.abs(days) / 30)}m ${Math.abs(days) % 30}d ago` : `Expired ${Math.abs(days)}d ago`)
                          : (days >= 365 ? `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m left` : days >= 30 ? `${Math.floor(days / 30)}m ${days % 30}d left` : `${days}d left`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Commercial Agreement Expiry Alerts - Admin Only */}
          {user?.role === 'super-admin' && visibleCommercial.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FaExclamationTriangle className="text-blue-500" />
                <h3 className="poppins-semibold text-blue-800 text-sm">Commercial Agreement Alerts</h3>
                <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-full">{visibleCommercial.length}</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {visibleCommercial.map((shop) => {
                  const days = getDaysLeft(shop.renewalDate);
                  const isExpired = days !== null && days < 0;
                  return (
                    <div
                      key={shop._id}
                      onClick={() => navigate('/addshop', { state: { shop, isEdit: true } })}
                      className={`flex items-center justify-between ${isExpired ? 'bg-red-50 border-red-200' : 'bg-white border-blue-100'} border rounded-md px-3 py-2 cursor-pointer hover:shadow-sm transition`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm poppins-medium text-gray-800 truncate">{shop.shopName}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {dayjs(shop.renewalDate).format('DD MMM YYYY')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full poppins-medium whitespace-nowrap flex-shrink-0 ml-2 ${isExpired ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {isExpired
                          ? (Math.abs(days) >= 365 ? `Expired ${Math.floor(Math.abs(days) / 365)}y ${Math.floor((Math.abs(days) % 365) / 30)}m ago` : Math.abs(days) >= 30 ? `Expired ${Math.floor(Math.abs(days) / 30)}m ${Math.abs(days) % 30}d ago` : `Expired ${Math.abs(days)}d ago`)
                          : (days >= 365 ? `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m left` : days >= 30 ? `${Math.floor(days / 30)}m ${days % 30}d left` : `${days}d left`)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
