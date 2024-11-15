import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { BuildingStorefrontIcon, ClipboardDocumentCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { getDashboardAdmin, getDashboardAuditor } from '../API/dashboard';
import { useAuth } from '../context/AuthProvider';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [shopCount, setShopCount] = useState(0);
  const [auditorsCount, setAuditorsCount] = useState(0);
  const [routesCount, setRoutesCount] = useState(0);
  const [auditsCount, setAuditsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  const data = {
    labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
    datasets: [
      {
        label: 'Audit',
        data: [20, 30, 40, 60, 80, 90, 60, 50, 70, 80, 90, 100],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        borderColor: '#4BC0C0',
        borderWidth: 2,
        pointBorderColor: '#4BC0C0',
        pointBackgroundColor: '#fff',
        pointHoverBackgroundColor: '#4BC0C0',
        pointHoverBorderColor: '#fff',
        pointHoverRadius: 8,
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const response = user.role === "super-admin" 
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
            setRoutesCount(routesCount||0)
            setAuditorsCount(auditorsCount || 0);
            setShopCount(shopsCount || 0);
            setAuditsCount(totalAudits || 0);
            setPendingCount(pendingAudit || 0);
            setCompletedCount(completedAudits || 0);
          }
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  return (
    <div className="p-6 min-h-screen poppins-regular">
      <h2 className="text-3xl font-semibold mb-2 text-start p-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
       {user && user.role === "super-admin" &&
        <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <BuildingStorefrontIcon className="text-white h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold text-white">{shopCount}</h2>
            <p className="text-white">Number of Shops</p>
          </div>
        </div>}

        {user && user.role === "super-admin" &&
        <div className="bg-gradient-to-r from-pink-500 to-pink-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <BuildingStorefrontIcon className="text-white h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold text-white">{auditorsCount}</h2>
            <p className="text-white">Number of Auditors</p>
          </div>
        </div>}

        {user && user.role === "super-admin" &&
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <BuildingStorefrontIcon className="text-white h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold text-white">{routesCount}</h2>
            <p className="text-white">Number of Routes</p>
          </div>
        </div>}
        
      </div>
      {user && user.role === "super-admin" &&
      <h2 className="text-3xl font-semibold mb-2 text-start p-4">Audit Overview</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Completed Audits */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <ClipboardDocumentCheckIcon className="text-white h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold text-white">{auditsCount}</h2>
            <p className="text-white">Audits</p>
          </div>
        </div>
        
        {/* Completed Audits */}
        <div className="bg-gradient-to-r from-green-500 to-green-800 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <ClipboardDocumentCheckIcon className="text-white h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold text-white">{completedCount}</h2>
            <p className="text-white">Completed Audits</p>
          </div>
        </div>

        {/* Pending Audits */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
          <ClipboardDocumentListIcon className="text-white h-12 w-12" />
          <div>
            <h2 className="text-2xl font-bold text-white">{pendingCount}</h2>
            <p className="text-white">Pending Audits</p>
          </div>
        </div>
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Audit Overview</h2>
        <Line data={data} options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
            },
            y: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              },
              beginAtZero: true,
            },
          },
        }} />
      </div> */}
    </div>
  );
};

export default Dashboard;
