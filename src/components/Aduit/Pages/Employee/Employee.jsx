import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployees, getEmployees, getPrevious } from '../../../../API/audits';
import { motion, AnimatePresence } from 'framer-motion';
import {  XMarkIcon } from '@heroicons/react/24/solid';

import toast from 'react-hot-toast';
import { MdArrowBack } from 'react-icons/md';
import Loader from '../../../Loader';
import DateFormat from '../../../DateFormat';

const Employee = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('kitchen');
    const { auditId } = useParams();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [lastAudit, setLastAudit] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [lastAudits, setLastAudits] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const [employeeData, setEmployeeData] = useState({
        count: 0,
        names: '',
        area: activeTab,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prev) => ({
            ...prev,
            [name]: name === 'count' ? parseInt(value) : value,
            area: activeTab,
        }));
    };

    const handleSubmit = () => {
    setLoading(true); // Set loading to true when submission starts

        createEmployees(auditId, employeeData).then(res => {
            toast.success(res.message);
            navigate(-1);
    setLoading(false); // Set loading to true when submission starts

        });
    };

    const tabs = ['kitchen', 'tea counter', 'sales', 'cash counter', 'cleaning', 'security'];

    useEffect(() => {
      setLoading(true)

        getEmployees(auditId).then(res => {
            if(res.data && res.data.length>0){
                res.data.map((data)=>{
                    if(data.area === activeTab){
                    setEmployeeData(data)
                    }
                })
            } 
      setLoading(false)


        });

    }, [auditId,activeTab]);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
        getPrevious(auditId).then(res => {
          setLastAudits(res.data);
        });
      };
    
      const handleOpenDialog = (data) => {
        setSelectedDate(data .auditDate);
        setDialogOpen(true);
        getEmployees(data._id).then(res => {
          setLastAudit(res.data);
        });
      };
    
      const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedDate(null);
      };
    

    return (
     <>
     {
        loading?<Loader/>:(
            <>
            <div className="flex items-center justify-between mx-auto p-4 max-w-6xl">
                <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
                    <MdArrowBack className="w-6 h-6 mt-1" />
                    <h1 className="text-xl md:text-xl font-semibold">Back</h1>
                </button>
                <div className="relative">
                    <button
                        onClick={togglePopup}
                        className="px-3 py-1 rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Previous Audit
                    </button>
                    <AnimatePresence>
            {isDialogOpen && (
              <motion.div
                className="fixed inset-0 flex z-20 mr-2 justify-end h-screen bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDialog}
              >
                <motion.div
                  className="relative bg-white rounded-lg p-8 w-2/5 overflow-auto  first-letter: shadow-2xl transition-all duration-300 transform hover:scale-105"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-200 p-3 rounded-full bg-gray-100 hover:bg-red-100"
                    onClick={handleCloseDialog}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <h2 className="text-2xl font-semibold mb-6 text-red-600 border-b-2 border-red-600 pb-2">Audit Date</h2>
                  <p className="text-gray-700 text-sm mb-6"><DateFormat date={selectedDate}/></p>
                  <div className="grid gap-6">
                    {lastAudit?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col  p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                      >
                        <span className="text-sm font-medium   text-red-700 bg-red-100 px-3 py-1 rounded-full capitalize">
                          {item.area}
                        </span>
                        <div key={index} className=' flex flex-wrap gap-1 mt-2'>
                            <div className=' flex justify-between  w-full'>
                              <span className="text-sm font-medium px-3 py-1 rounded-full capitalize">Count</span>
                              <span className=" text-red-700 p-1 poppins-regular px-3 bg-red-100 rounded-full capitalize text-sm">{item.count || 'N/A'}</span>
                            </div>
                            <div className=' flex justify-between  w-full'>
                              <span className="text-sm font-medium px-3 py-1 rounded-full capitalize">Names</span>
                              <span className=" text-red-700 p-1 poppins-regular px-3 bg-red-100 rounded-full capitalize text-sm">{item.names || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                  {lastAudit?.captureImages && lastAudit?.captureImages.length > 0 && (
                    <div className="">
                      <h3 className="text-lg font-medium text-red-600 mb-1">Captured Images</h3>
                      <div className="flex flex-wrap gap-4">
                        {lastAudit?.captureImages.map((image, index) => (
                          <div key={index} className="group relative w-24 h-24 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                            <img
                              src={image.imageUrl}
                              alt={`Captured Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {isPopupVisible && (
            <div className="absolute -left-5 mt-2 w-44 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
              <ul>
                {lastAudits.map((date) => (
                  <li key={date._id} className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150"
                    onClick={() => handleOpenDialog(date)}
                  >
                    <DateFormat date={date.auditDate}/>
                  </li>
                ))}
              </ul>
            </div>
          )}
                </div>
            </div>

            <div className="p-6 flex justify-center">
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md w-full sm:w-5/6 md:w-4/6 space-y-4">
                    {/* Tab Buttons */}
                    <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 py-2 whitespace-nowrap px-2 text-center text-sm sm:text-base ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'} rounded`}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setEmployeeData({ count: 0, names: '', area: tab });
                                }}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Card Content */}
                    <EmployeeTab
                        tabName={activeTab}
                        data={employeeData}
                        onInputChange={handleInputChange}
                    />

                    {/* Submit Button */} 
                    <button
                        className="w-full py-2 mt-4 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
        )
     }
     </>
    );
};

export default Employee;

const EmployeeTab = ({ tabName, data, onInputChange }) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2 text-center">{tabName.charAt(0).toUpperCase() + tabName.slice(1)} Details</h3>
            <label className="block mb-3">
                <span className="text-gray-700">Number of Employees</span>
                <input
                    type="number"
                    name="count"
                    value={data.count}
                    onChange={onInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter number"
                />
            </label>
            <label className="block">
                <span className="text-gray-700">Employee Names</span>
                <textarea
                    name="names"
                    value={data.names}
                    onChange={onInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                    placeholder="Enter names, separated by commas"
                />
            </label>
        </div>
    );
};
