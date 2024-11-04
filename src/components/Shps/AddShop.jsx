import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AddShop = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    shopPhoto: '',
    ownerName: '',
    franchiseType: '',
    phone: '',
    email: '',
    address: '',
    location: '',
    onboardingDate: '',
    renewalDate: '',
    fssiCertificateNumber: '',
    commercialAgreement: null,
    gstCertificate: null,
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDialogVisible(true);
    setFormData({
      shopName: '',
      shopPhoto: '',
      ownerName: '',
      franchiseType: '',
      phone: '',
      email: '',
      address: '',
      location: '',
      onboardingDate: '',
      renewalDate: '',
      fssiCertificateNumber: '',
      commercialAgreement: null,
      gstCertificate: null,
    });

    setTimeout(() => {
      setDialogVisible(false);
      navigate("/myshop");
    }, 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Add Shop</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Shop Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="shopName">
            Shop Name
          </label>
          <input
            id="shopName"
            type="text"
            value={formData.shopName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter shop name"
          />
        </div>

        {/* Shop Photo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="shopPhoto">
            Shop Photo
          </label>
          <input
            id="shopPhoto"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Owner Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="ownerName">
            Owner Name
          </label>
          <input
            id="ownerName"
            type="text"
            value={formData.ownerName}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter owner name"
          />
        </div>

        {/* Franchise Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="franchiseType">
            Franchise Type
          </label>
          <input
            id="franchiseType"
            type="text"
            value={formData.franchiseType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter franchise type"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter phone number"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email ID
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter email address"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter shop address"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter location"
          />
        </div>

        {/* Onboarding Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="onboardingDate">
            Onboarding Date
          </label>
          <input
            id="onboardingDate"
            type="date"
            value={formData.onboardingDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Renewal Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700" htmlFor="renewalDate">
            Renewal Date
          </label>
          <input
            id="renewalDate"
            type="date"
            value={formData.renewalDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* FSSI Certificate Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="fssiCertificateNumber">
            FSSI Certificate Number
          </label>
          <input
            id="fssiCertificateNumber"
            type="text"
            value={formData.fssiCertificateNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter FSSI certificate number"
          />
        </div>

        {/* Commercial Agreement Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="commercialAgreement">
            Commercial Agreement
          </label>
          <input
            id="commercialAgreement"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* GST Certificate Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="gstCertificate">
            GST Certificate
          </label>
          <input
            id="gstCertificate"
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Submit Button */}
        <div className="col-span-full">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
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
            <h3 className="text-xl font-semibold text-gray-800">Shop added successfully!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddShop;
