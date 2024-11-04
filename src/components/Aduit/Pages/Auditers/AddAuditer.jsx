import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddAuditer = () => {
  const navigate = useNavigate();
  const [dialogVisible, setDialogVisible] = useState(false);

  // State to store form values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    documentType: 'aadhar', // default document type
    documentFile: null, // file upload
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, documentFile: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setDialogVisible(true); // Show success dialog

    setTimeout(() => {
      setDialogVisible(false);
      navigate("/Auditers"); // Navigate after delay
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter auditor's name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter auditor's email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            placeholder="Enter address"
            value={formData.address}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Select Document Type</label>
          <select
            name="documentType"
            value={formData.documentType}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="aadhar">Aadhar</option>
            <option value="pan">PAN Card</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Document</label>
          <input
            type="file"
            name="documentFile"
            onChange={handleFileChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
          />
        </div>

        <div className="col-span-full">
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Success Dialog */}
      {dialogVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Auditor added successfully!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAuditer;
