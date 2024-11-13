import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEmployees, getEmployees } from '../../../../API/audits';
import toast from 'react-hot-toast';

const Employee = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('kitchen');
  const { auditId } = useParams();

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
            area: activeTab, // Ensure area is set to the active tab
        }));
    };

    const handleSubmit = () => {
        // Handle form submission here (e.g., save data)
        createEmployees(auditId,employeeData).then(res=>{toast.success(res.message)
          navigate(-1); // Navigate back to the previous page
      
         })
         
        console.log('Submitted Employee Data for area:', employeeData);
        // You can add your submission logic here, e.g., API call
        // navigate(-1); // Navigate back after submission
    };

    const tabs = ['kitchen', 'tea counter', 'sales', 'cash counter', 'cleaning', 'security'];
    useEffect(()=>{
      getEmployees(auditId).then(res=>{
        console.log(res.data)
      })
      }, [])
    return (
        <div className="p-6 flex justify-center">
            <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md w-4/6 space-y-4">
                
                {/* Tab Buttons */}
                <div className="flex space-x-2 mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`flex-1 py-2 whitespace-nowrap poppins-semibold px-2 text-center text-sm sm:text-base ${
                                activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                            } rounded`}
                            onClick={() => {
                                setActiveTab(tab);
                                setEmployeeData({ count: 0, names: '', area: tab }); // Reset data when changing tabs
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
