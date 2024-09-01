import React from 'react';
import { Line } from 'react-chartjs-2';
import { FaUsers, FaBox, FaDollarSign, FaClock } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const data = {
    labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
    datasets: [
      {
        label: 'Sales',
        data: [20, 30, 40, 60, 80, 90, 60, 50, 70, 80, 90, 100],
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: '#4BC0C0',
        pointBorderColor: '#4BC0C0',
        pointBackgroundColor: '#4BC0C0',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4BC0C0',
      },
    ],
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Users */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <FaUsers className="text-purple-500 text-4xl" />
          <div>
            <h2 className="text-2xl font-bold">40,689</h2>
            <p className="text-gray-600">Total Users</p>
            <p className="text-green-500">8.5% Up from yesterday</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <FaBox className="text-yellow-500 text-4xl" />
          <div>
            <h2 className="text-2xl font-bold">10,293</h2>
            <p className="text-gray-600">Total Orders</p>
            <p className="text-green-500">1.3% Up from past week</p>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <FaDollarSign className="text-green-500 text-4xl" />
          <div>
            <h2 className="text-2xl font-bold">$89,000</h2>
            <p className="text-gray-600">Total Sales</p>
            <p className="text-red-500">4.3% Down from yesterday</p>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
          <FaClock className="text-orange-500 text-4xl" />
          <div>
            <h2 className="text-2xl font-bold">2,040</h2>
            <p className="text-gray-600">Total Pending</p>
            <p className="text-green-500">1.8% Up from yesterday</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Sales Details</h2>
        <Line data={data} />
      </div>
    </div>
  );
};

export default Dashboard;
