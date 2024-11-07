import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

import { BsArrowRight } from "react-icons/bs";
import { auditdata } from '../../Assets/data';
const daysOfWeek = [ 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Table = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().startOf('week'));
  const navigate = useNavigate(); 
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
    {
      id: 3,
      shopName: 'Coffee Corner',
      ownerName: 'Ravi',
      address: '5th street, Vellore',
      auditStatus: 'Pending',
      contactNumber: '9876541234',
      email: 'ravi@coffee.com',
      mapLink: 'https://maps.google.com?q=Vellore',
      date: dayjs().add(1, 'day').format('YYYY-MM-DD'),  
    },
  ];

  const currentWeekDates = Array(7).fill().map((_, index) => {
    return dayjs().startOf('week').add(index, 'day');
  });

  
  const filteredAudits = audits.filter(audit => {
    return dayjs(audit.date).isSame(selectedDate, 'day');
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
    console.log("Selected Date: ", date.format('YYYY-MM-DD'));
  };

  return (
    <div className="p-4 md:p-6 min-h-screen">
  
      <div className="flex justify-center w-6/6 items-center space-x-2 mb-4">
        {currentWeekDates.map((date, index) => (
          <button
            key={index}
            className={`day-btn px-8 ${selectedDate.isSame(date, 'day') ? 'selected' : ''}`}
            onClick={() => handleDateClick(date)}
          >
            <span className="day-name">{daysOfWeek[index]}</span>
            <span className="day-number">{date.format('D')}</span>
          </button>
        ))}
      </div>

      {/* Audit Table */}
      <h2 className="text-2xl poppins-semibold mb-4">MY AUDIT</h2>
      <div className="table-container">
        

        {/* Your table content */}
        <div className="hidden md:block overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-red-600 text-white poppins-semibold">
              <tr>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">S.No</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Shop Details</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Audit Status</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Contact Details</th>
                <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit, index) => (
                <tr key={audit.id}>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-4 border-b border-gray-200 text-sm text-gray-700">
                    <div className="poppins-regular">
                      <div>{audit.shopName}</div>
                      <div>{audit.ownerName}</div>
                      <div>{audit.address}</div>
                      <a href={audit.mapLink} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                        Map Link
                      </a>
                    </div>
                  </td>
                  <td className={`px-4 py-4 border-b poppins-regular border-gray-200 text-sm ${audit.auditStatus === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                    {audit.auditStatus}
                  </td>
                  <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm text-gray-700">
                    <div>{audit.contactNumber}</div>
                    <a href={`mailto:${audit.email}`} className="text-blue-500 hover:underline">
                      {audit.email}
                    </a>
                  </td>
                  <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm">
                    {audit.auditStatus === 'Pending' ? (
                      <Link to="/add-audit">
                        <BsArrowRight className="text-red-600 text-2xl" />
                      </Link>
                    ) : (
                      <Link to= "/Report" >
                      <button  className="text-blue-500 poppins-regular">View </button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-700">No audits available for this date</td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
