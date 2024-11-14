import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowRight } from "react-icons/bs";
import { getAllAudits } from '../../API/audits';
import { ScaleLoader } from "react-spinners";

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Table = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Set to current date
  const [audits, setAudits] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const currentWeekDates = Array(6).fill().map((_, index) => {
    return dayjs().startOf('week').add(index + 1, 'day');
  });

  const filteredAudits = audits.filter(audit => {
    return dayjs(audit.auditDate).isSame(selectedDate, 'day');
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    getAllAudits().then((res) => setAudits(res.data)).finally(() => {
      setLoading(false);
    });
  }, []);

  const isScheduleButtonDisabled = dayjs().add(6, 'days').isAfter(selectedDate);  

  return (
    <div className="p-4 md:p-6 min-h-screen">
      <div className="flex justify-center w-full items-center space-x-2 mb-4">
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

      <div className='flex justify-between'>
        <h2 className="text-2xl poppins-semibold">MY AUDIT</h2>
        <button
    className={`${
      isScheduleButtonDisabled ? 'bg-red-400' : 'bg-red-600'
    } text-white rounded-lg poppins-semibold py-1 px-3 flex items-center`}
    disabled={isScheduleButtonDisabled}
  >
    Schedule
  </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <ScaleLoader height="15" width="7" color="#FF0000" />
        </div>
      ) : (
        <>
          {/* Responsive Card View for Mobile */}
          <div className="block md:hidden mt-4">
            {filteredAudits.length > 0 ? (
              filteredAudits.map((audit, index) => (
                <div key={audit.id} className="border rounded-lg p-4 mb-4 shadow-md">
                  <div className="poppins-regular">
                    <div className="font-semibold">{audit.shop?.shopName}</div>
                    <div>{audit.shop?.ownerName}</div>
                    <div>{audit.shop?.address}</div>
                    <a href={audit.location} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                      Map Link
                    </a>
                    <div className={`mt-2 ${audit.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                      {audit.status}
                    </div>
                    <div>{audit.shop.phone}</div>
                    <a href={`mailto:${audit.shop?.email}`} className="text-blue-500 hover:underline">
                      {audit.shop?.email}
                    </a>
                    <div className="mt-2">
                      {audit.status === 'pending' ? (
                        <Link to={`/add-audit/${audit._id}`}>
                          <BsArrowRight className="text-red-600 text-2xl" />
                        </Link>
                      ) : (
                        <Link to="/Report">
                          <button className="text-blue-500 poppins-regular">View</button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-700">No audits available for this date</div>
            )}
          </div>

          {/* Table View for Larger Screens */}
          <div className="hidden md:block mt-4">
            <div className="overflow-x-auto rounded-lg">
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
                            <div>{audit.shop?.shopName}</div>
                            <div>{audit.shop?.ownerName}</div>
                            <div>{audit.shop?.address}</div>
                            <a href={audit.location} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                              Map Link
                            </a>
                          </div>
                        </td>
                        <td className={`px-4 py-4 border-b poppins-regular border-gray-200 text-sm ${audit.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                          {audit.status}
                        </td>
                        <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm text-gray-700">
                          <div>{audit.shop.phone}</div>
                          <a href={`mailto:${audit.shop?.email}`} className="text-blue-500 hover:underline">
                            {audit.shop?.email}
                          </a>
                        </td>
                        <td className="px-4 py-4 border-b poppins-regular border-gray-200 text-sm">
                          {audit.status === 'pending' ? (
                            <Link to={`/add-audit/${audit._id}`}>
                              <BsArrowRight className="text-red-600 text-2xl" />
                            </Link>
                          ) : (
                            <Link to="/Report">
                              <button className="text-blue-500 poppins-regular">View</button>
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
        </>
      )}
    </div>
  );
};

export default Table;
