import React, { useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { createProduct } from '../../../../API/settings';
import toast from 'react-hot-toast';

const BakerProducts = () => {
  const [brandName, setBrandName] = useState('');
  const [productNames, setProductNames] = useState(['']);
  const [submissions, setSubmissions] = useState([]);

  const brandOptions = [
    { value: 'brand1', label: 'Brand 1' },
    { value: 'brand2', label: 'Brand 2' },
    { value: 'brand3', label: 'Brand 3' },
    { value: 'brand4', label: 'Brand 4' },
  ];

  const handleBrandNameChange = (selectedOption) => {
    setBrandName(selectedOption);
  };

  const handleProductNameChange = (index, e) => {
    const newProductNames = [...productNames];
    newProductNames[index] = e.target.value;
    setProductNames(newProductNames);
  };

  const addProductField = () => {
    setProductNames([...productNames, '']);
  };

  const removeProductField = (index) => {
    const newProductNames = productNames.filter((_, i) => i !== index);
    setProductNames(newProductNames);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (brandName && productNames.some(name => name)) {
      const newSubmission = {
        brandName: brandName.name,
        productNames,
      };
      setSubmissions([...submissions, newSubmission]);
      setBrandName('');
      setProductNames(['']);
     const res = await createProduct({name:brandName.name})
    toast.success(res.message)
    }
  };

  return (
    <><div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Bakery Product Entry</h2>

      {/* Brand Selection */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Brand Name</label>
        <Select
          value={brandName}
          onChange={handleBrandNameChange}
          options={brandOptions}
          isSearchable
          placeholder="Select a brand"
          className="border border-gray-300 rounded-lg" />
      </div>

      {/* Product Names */}
      <div className="mb-6">
  <label className="block text-lg font-medium text-gray-700 mb-4">Product Names</label>
  {productNames.map((productName, index) => (
    <div key={index} className="flex items-center space-x-3 mb-3">
      <input
        type="text"
        value={productName}
        onChange={(e) => handleProductNameChange(index, e)}
        placeholder={`Product Name ${index + 1}`}
        className="flex-grow py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
      />
      <button
        type="button"
        onClick={() => removeProductField(index)}
        className="text-red-600 hover:text-red-800 transition duration-150 ease-in-out"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  ))}

  {/* Add Product Button (Visible after the last product input) */}
  <div className="flex justify-end mt-4">
    <button
      type="button"
      onClick={addProductField}
      className="bg-red-500 py-2 px-4 rounded-full text-white font-semibold hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 ease-in-out flex items-center justify-center shadow-md"
    >
      <PlusIcon className="h-5 w-5 text-white" />
      <span className="ml-2">Add Product</span>
    </button>
  </div>
</div>


      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center"
      >
        <CheckCircleIcon className="h-5 w-5 mr-2" />
        Submit
      </button>

      {/* Display Submitted Data */}

    </div><div className='max-w-4xl mx-auto'>
        {submissions.length > 0 && (
          <div className="mt-8  ">
           
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="py-3 px-4 font-medium">Brand Name</th>
                  <th className="py-3 px-4 font-medium">Product Names</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                    <td className="py-4 px-4 text-gray-800">{submission.brandName}</td>
                    <td className="py-4 px-4 text-gray-800">
                      <ul className="list-disc pl-5 space-y-1">
                        {submission.productNames.map((name, idx) => (
                          <li key={idx}>{name}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div></>
  );
};

export default BakerProducts;
