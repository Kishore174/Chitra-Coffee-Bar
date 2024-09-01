import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyShop = () => {
  const shops = [
    {
      id: 1,
      name: 'R K Tea',
      location: '¾, Main road, Katpadi',
      contact: '9876543210',
      email: 'dilip@azerotech.com',
      franchise: 'Kumar',
      partnership: 'Partnership',
      mapLink: 'https://maps.google.com?q=Katpadi',
    },
    {
      id: 2,
      name: 'Raj Coffee Bar',
      location: '1, 3rd avenue, Vellore',
      contact: '9677659728',
      email: 'dilipvinoth@gmail.com',
      franchise: 'Kishore',
      partnership: 'Partnership',
      mapLink: 'https://maps.google.com?q=Vellore',
    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-0">My Shop</h1>
        <Link to="/addshop">
          <button className="bg-red-600 text-white rounded-lg p-3 flex items-center">
            <FaPlus className="mr-2" />
            Add Shop
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg hidden md:table">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">S.No</th>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">Shop Name</th>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">Location</th>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">Contact Details</th>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">Franchise Name</th>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">Partnership</th>
              <th className="px-2 py-3 border-b-2 border-gray-300 text-left text-xs md:text-sm font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, index) => (
              <tr key={shop.id} className="hover:bg-gray-100">
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{index + 1}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.name}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  {shop.location} <br />
                  <a href={shop.mapLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Map Link
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">
                  {shop.contact} <br />
                  <a href={`mailto:${shop.email}`} className="text-blue-500 hover:underline">
                    {shop.email}
                  </a>
                </td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.franchise}</td>
                <td className="px-2 py-4 border-b border-gray-200 text-xs md:text-sm">{shop.partnership}</td>
                <td className="px-2 py-4 border-b border-gray-200 space-x-2 text-xs md:text-sm">
                  <button className="text-blue-500 hover:underline">View</button>
                  <button className="text-green-500 hover:underline">Edit</button>
                  <button className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile View */}
        <div className="md:hidden">
          {shops.map((shop, index) => (
            <div key={shop.id} className="bg-white mb-4 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{shop.name}</h2>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className="text-sm text-gray-700">
                <p><strong>Location:</strong> {shop.location}</p>
                <p><strong>Contact:</strong> {shop.contact}</p>
                <p><strong>Email:</strong> <a href={`mailto:${shop.email}`} className="text-blue-500 hover:underline">{shop.email}</a></p>
                <p><strong>Franchise Name:</strong> {shop.franchise}</p>
                <p><strong>Partnership:</strong> {shop.partnership}</p>
                <a href={shop.mapLink} className="text-blue-500 hover:underline mt-2 block" target="_blank" rel="noopener noreferrer">View on Map</a>
              </div>
              <div className="flex justify-end space-x-2 mt-2">
                <button className="text-blue-500 hover:underline">View</button>
                <button className="text-green-500 hover:underline">Edit</button>
                <button className="text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyShop;
