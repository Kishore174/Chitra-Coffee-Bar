import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Select from 'react-select'; // Import react-select

const BakerProducts = () => {
  const [brandName, setBrandName] = useState('');
  const [productNames, setProductNames] = useState(['']);
  const [submittedData, setSubmittedData] = useState(null);

  // Sample data for select options
  const brandOptions = [
    { value: 'brand1', label: 'Brand 1' },
    { value: 'brand2', label: 'Brand 2' },
    { value: 'brand3', label: 'Brand 3' },
    { value: 'brand4', label: 'Brand 4' },
    // Add more brands as needed
  ];

  const handleBrandNameChange = (selectedOption) => {
    setBrandName(selectedOption); // Update brandName with the selected value
  };

  const handleProductNameChange = (index, e) => {
    const newProductNames = [...productNames];
    newProductNames[index] = e.target.value;
    setProductNames(newProductNames);
  };

  const addProductField = () => {
    setProductNames([...productNames, '']); // Add a new empty product input field
  };

  const removeProductField = (index) => {
    const newProductNames = productNames.filter((_, i) => i !== index);
    setProductNames(newProductNames);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData({ brandName: brandName.label, productNames });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 flex space-x-8">
      {/* Form Section */}
      <div className="w-2/3 bg-gray-100 rounded-lg shadow-lg p-6">
        <div className="flex-1 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl poppins-semibold text-center text-gray-800 mb-6">Enter Bakery Products</h2>

       
          <div className="mb-6">
            <label htmlFor="brand-name" className="block text-sm poppins-semibold text-gray-700">Brand Name</label>
            <Select
              id="brand-name"
              value={brandName}
              onChange={handleBrandNameChange}
              options={brandOptions}
              isSearchable
              placeholder="Search and select a brand"
              className="mt-2"
            />
          </div>

          {/* Product Names */}
          <div className="mb-6">
            <label className="block text-sm poppins-semibold text-gray-700">Product Names</label>
            {productNames.map((productName, index) => (
              <div key={index} className="flex items-center space-x-4 mb-4">
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => handleProductNameChange(index, e)}
                  placeholder={`Enter Product Name ${index + 1}`}
                  className="w-full p-3 border poppins-light border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => removeProductField(index)}
                  className="text-red-600 hover:text-red-800 transition duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            {/* Add Product Button */}
            <button
              type="button"
              onClick={addProductField}
              className="py-2 px-6 bg-red-600 poppins-regular text-white rounded-md hover:bg-red-700 transition duration-200 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Another Product
            </button>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full py-3 bg-red-600 poppins-regular text-white font-semibold rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Display Submitted Data */}
      {submittedData && (
        <div className="w-1/3 bg-gray-100 rounded-lg shadow-lg p-6">
          <h3 className="text-xl poppins-semibold text-gray-800 mb-4">Submitted Data</h3>
          <div className="mb-4">
            <strong className="text-sm text-gray-700">Brand Name:</strong>
            <p className="text-gray-800">{submittedData.brandName}</p>
          </div>
          <div>
            <strong className="text-sm text-gray-700">Product Names:</strong>
            <ul className="list-disc pl-6 text-gray-800">
              {submittedData.productNames.map((productName, index) => (
                <li key={index}>{productName}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BakerProducts;
