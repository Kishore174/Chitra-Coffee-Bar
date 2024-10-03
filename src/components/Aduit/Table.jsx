import React from 'react';
import { BsArrowRight } from "react-icons/bs";
import { Link } from 'react-router-dom';

const Table = () => {
  const audits = [
    {
      id: 1,
      shopName: 'R K Tea',
      ownerName: 'Kumar',
      address: '¾, Main road, Katpadi',
      auditStatus: 'Pending',
      contactNumber: '9876543210',
      email: 'dilip@azerotech.com',
      mapLink: 'https://maps.google.com?q=Katpadi',
    },
    {
      id: 2,
      shopName: 'Raj Coffee Bar',
      ownerName: 'Kumar',
      address: '1, 3rd avenue, Vellore',
      auditStatus: 'Completed',
      contactNumber: '9876543210',
      email: 'dilipvinoth@gmail.com',
      mapLink: 'https://maps.google.com?q=Katpadi',

    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen ">
      <h2 className="text-2xl poppins-semibold mb-4">MY ADUIT</h2>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto  rounded-lg">
        <table className="min-w-full bg-white border   border-gray-200">
          <thead className="bg-red-600 text-white poppins-semibold ">
            <tr>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">S.No</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Shop Details</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Audit Status</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Contact Details</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((audit, index) => (
              <tr key={audit.id}>
                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{index + 1}</td>
                <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                  <div className='poppins-regular '>
                  <div className=" ">{audit.shopName}</div>
                  <div>{audit.ownerName}</div>
                  <div>{audit.address}</div>
                  <a href={audit.mapLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    Map Link
                  </a>
                  </div>
                  
                </td>
                <td className={`px-4 py-4 border-b poppins-regular  border-gray-200 text-sm ${audit.auditStatus === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                  {audit.auditStatus}
                </td>
                <td className="px-4 py-4 border-b poppins-regular  border-gray-200 text-sm text-gray-700">
                  <div>{audit.contactNumber}</div>
                  <a href={`mailto:${audit.email}`} className="text-blue-500 hover:underline">
                    {audit.email}
                  </a>
                </td>
                <td className="px-4  py-4 border-b poppins-regular  border-gray-200 text-sm">
                  {audit.auditStatus === 'Pending' ? (
                    <Link to="/add-audit">
                      <BsArrowRight className="text-red-600 text-2xl" />
                    </Link>
                  ) : (
                    <span className="text-blue-500 poppins-regular ">View | Edit</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <div className="md:hidden">
        {audits.map((audit, index) => (
          <div key={audit.id} className="bg-white mb-4 p-4 rounded-lg  shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg poppins-regular">{audit.shopName}</h2>
              <span className="text-sm text-gray-500">#{index + 1}</span>
            </div>
            <div className="text-sm text-gray-700 poppins-regular">
              <p><strong>Owner:</strong> {audit.ownerName}</p>
              <p><strong>Address:</strong> {audit.address}</p>
              <p><strong>Contact:</strong> {audit.contactNumber}</p>
              <p><strong>Email:</strong> <a href={`mailto:${audit.email}`} className="text-blue-500 hover:underline">{audit.email}</a></p>
              <p><strong>Status:</strong> <span className={audit.auditStatus === 'Completed' ? 'text-green-600' : 'text-red-600'}>{audit.auditStatus}</span></p>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              {audit.auditStatus === 'Pending' ?   (
                <Link to="/add-audit">
                  <BsArrowRight className="text-red-600 text-2xl" />
                </Link>
              ) : (
                <span className="text-blue-500">View|Edit</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;