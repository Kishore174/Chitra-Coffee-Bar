import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createRoute } from '../../API/createRoute';
import toast from 'react-hot-toast';
import { createShop } from '../../API/shop';

const AddShop = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    shopPhoto: '',
    ownerName: '',
    propertyType:'',
    franchiseType: '',
    phone: '',
    email: '',
    address: '',
    location: '',
    onBoardingDate: '',
    renewalDate: '',
    fssiCertificateNo: '',
    commercialAgree: null,
    gstCertificate: null,
  });
  const [propertyType, setPropertyType] = useState('');
  const [franchiseType, setFranchiseType] = useState('');


 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData({ ...formData, [id]: files[0] });
  };
  

  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const res = await createShop(formData );
      console.log(res);
      setFormData({
        shopName: '',
        shopPhoto: '',
        ownerName: '',
        franchiseType: '',
        propertyType:'',
        phone: '',
        email: '',
        address: '',
        location: '',
        onBoardingDate: '',
        renewalDate: '',
        fssiCertificateNo: '',
        commercialAgree: null,
        gstCertificate: null,
      });
      toast.success(res.message);
  
     
    } catch (error) {
      console.log(error)
    }
   
  };
  const handlePropertyTypeChange = (e) => {
    setPropertyType(e.target.value);
  };
  const handleFranchiseType = (e) => {
    setFranchiseType(e.target.value);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Add Shop</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {/* Property Type */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700" htmlFor="propertyType">
    Property Type
  </label>
  <select
    id="propertyType"
  
    value={formData.propertyType}
    onChange={handleChange}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
  >
    <option value="" disabled>Select property type</option>
    <option value="rent">Rent</option>
    <option value="own">Own</option>
  </select>
</div>
  
 {formData.propertyType === 'rent' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="rentalAgreement">
              Rental Agreement
            </label>
            <input
              id="rentalAgreement"
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        ) : formData.propertyType === 'own' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="ecard">
              Eb Card
            </label>
            <input
              id="ebCard"
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        ) : null}
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
  <select   
    id="franchiseType"
  
  
    value={formData.franchiseType}
    onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm">  

   
    <option value="" disabled>Select  Franchise type</option>
    <option value="partnership">Partner Ship</option>
    <option value="own">Own</option>
  </select>
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
            id="onBoardingDate"
            type="date"
            value={formData.onBoardingDate}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Renewal Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700" htmlFor="renewalDate">
          Commercial Renewal Date
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
            id="fssiCertificateNo"
            type="text"
            value={formData.fssiCertificateNo}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter FSSI certificate number"
          />
        </div>

        {/* Commercial Agreement Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="commercialAgree">
            Commercial Agreement
          </label>
          <input
            id="commercialAgree"
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
 
      
    </div>
  );
};

export default AddShop;
