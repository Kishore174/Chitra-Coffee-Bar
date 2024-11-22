import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { BuildingStorefrontIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { getDashboardAdmin, getDashboardAuditor } from '../API/dashboard';
import { useAuth } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import ContentLoader from 'react-content-loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [shopCount, setShopCount] = useState(0);
  const [auditorsCount, setAuditorsCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [auditsCount, setAuditsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

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
    </div>
  );
};

export default Dashboard;
