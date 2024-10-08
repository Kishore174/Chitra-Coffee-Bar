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
    
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
    });

     
    setTimeout(() => {
      setDialogVisible(false);
      navigate("/myshop");

    }, 3000);
  };

  return (
    <div className="p-6 max-w-full mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Add Shop</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopName">
            Shop Name
          </label>
          <input
            id="shopName"
            type="text"
            value={formData.shopName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter shop name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shopPhoto">
            Shop Photo
          </label>
          <input
            id="shopPhoto"
            type="file"
            onChange={(e) => setFormData({ ...formData, shopPhoto: e.target.files[0] })}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ownerName">
            Owner Name
          </label>
          <input
            id="ownerName"
            type="text"
            value={formData.ownerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter owner name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="franchiseType">
            Franchise Type
          </label>
          <input
            id="franchiseType"
            type="text"
            value={formData.franchiseType}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter franchise type"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email ID
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter email address"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter shop address"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder="Enter location"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="onboardingDate">
            Onboarding Date
          </label>
          <input
            id="onboardingDate"
            type="date"
            value={formData.onboardingDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="renewalDate">
            Renewal Date
          </label>
          <input
            id="renewalDate"
            type="date"
            value={formData.renewalDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          />
        </div>

        <div className="col-span-full flex justify-end">
          <button type="submit" className="bg-red-600 text-white rounded-lg px-8 py-2">
            Submit
          </button>
        </div>
      </form>

      {dialogVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4 rounded-lg p-6 shadow-lg">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-center">Shop added successfully!</h3>
        </div>
      </div>
    )}
   </div>
  );
};

export default AddShop;
 