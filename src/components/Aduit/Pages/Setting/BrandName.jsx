import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi';  // For plus icon
import { HiTrash } from 'react-icons/hi'; // For delete icon

const BrandName = () => {
  const [inputFields, setInputFields] = useState([{ id: Date.now(), value: '' }]);

  const handleAddField = () => {
    setInputFields([...inputFields, { id: Date.now(), value: '' }]);
  };

  const handleRemoveField = (id) => {
    setInputFields(inputFields.filter(field => field.id !== id));
  };

  const handleChange = (id, event) => {
    const updatedFields = inputFields.map(field => 
      field.id === id ? { ...field, value: event.target.value } : field
    );
    setInputFields(updatedFields);
  };

  return (
    <div className="relative max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {inputFields.map((field) => (
          <div key={field.id} className="flex items-center space-x-3">
            <input
              type="text"
              value={field.value}
              onChange={(event) => handleChange(field.id, event)}
              className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Brand Name"
            />
            <button
              onClick={() => handleRemoveField(field.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <HiTrash size={24} />
            </button>
          </div>
        ))}
      </div>
      
      {/* Fixed Plus Button */}
      <button
        onClick={handleAddField}
        className="fixed top-20 right-6 flex items-center justify-center w-12 h-12 rounded-full bg-red-500 text-white text-xl shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <HiPlus />
      </button>
    </div>
  );
};

export default BrandName;
