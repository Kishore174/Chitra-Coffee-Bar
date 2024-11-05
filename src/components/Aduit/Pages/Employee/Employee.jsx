import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Employee = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Kitchen');
  const [employeeData, setEmployeeData] = useState({
    Kitchen: { count: '', names: '' },
    TeaCounter: { count: '', names: '' },
    Sales: { count: '', names: '' },
    CashCounter: { count: '', names: '' },
    Cleaning: { count: '', names: '' },
    Security: { count: '', names: '' },
  });

  // Get the data for the active tab or use default values
  const currentData = employeeData[activeTab] || { count: '', names: '' };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], [name]: value },
    }));
  };

  const handleSubmit = () => {
    // Handle form submission here (e.g., save data)
    navigate(-1); // Navigate back
  };

  const tabs = ['Kitchen', 'Tea Counter', 'Sales', 'Cash Counter', 'Cleaning', 'Security'];

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-md w-4/6 space-y-4">
        
        {/* Tab Buttons */}
        <div className="flex space-x-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-2 text-center text-sm sm:text-base ${
                activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
              } rounded`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Card Content */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-center">{activeTab} Details</h3>
          <label className="block mb-3">
            <span className="text-gray-700">Number of Employees</span>
            <input
              type="number"
              name="count"
              value={currentData.count}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter number"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">Employee Names</span>
            <textarea
              name="names"
              value={currentData.names}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              placeholder="Enter names, separated by commas"
            />
          </label>
        </div>

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
