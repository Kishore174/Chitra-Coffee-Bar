import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAuditor, upDateAuditor } from '../../../../API/auditor';
import toast from 'react-hot-toast';
import { dropDownRoutes, getRoute } from '../../../../API/createRoute';
import { MdArrowBack } from 'react-icons/md';
import { getUnassignedRoutes } from '../../../../API/settings';

const AddAuditer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { auditor, isEdit, isView } = location.state || {};

  // State to store form values
  const [formData, setFormData] = useState(auditor || {
    name: '',
    email: '',
    phone: '',
    address: '',
    documentType: 'aadhar', // Default document type
    documentFile: null,
    route: '',
    drivingLicenseNo: '',
    drivingLicenseExpiryDate: '',
    drivingLicenseFile: null,
  });
  
  const [selectRoute, setSelectRoute] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      let res;

      if (isEdit) {
        res = await upDateAuditor(auditor._id, formData);
      } else {
        res = await createAuditor(formData);
      }
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        documentType: 'aadhar',
        documentFile: null,
        route: '',
        drivingLicenseNo: '',
        drivingLicenseExpiryDate: '',
        drivingLicenseFile: null,
      });
      
      toast.success(res.message);
      navigate('/Auditers');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auditor) {
      dropDownRoutes().then((data) => {
        setSelectRoute(data.data);
      });
    } else {
      getUnassignedRoutes().then((data) => {
        setSelectRoute(data.data);
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200"
      >
        <MdArrowBack className="w-6 h-6 mt-1" />
        <h2 className="text-2xl font-semibold mb-4">
          {!auditor ? 'Add Auditor' : isEdit ? 'Edit Auditor' : 'View Auditor'}
        </h2>
      </button>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter auditor's name"
            value={formData.name}
            onChange={handleChange}
            disabled={isView}

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
            disabled={isView}

            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter mobile number"
            value={formData.phone}
            onChange={handleChange}
            disabled={isView}

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
            disabled={isView}

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
            disabled={isView}

            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="aadhar">Aadhar</option>
            <option value="pan">Pan card</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Document</label>
          <input
            type="file"
            name="documentFile"
            onChange={handleFileChange}
            
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            disabled={isView}
          />
          {auditor?.documentUrl && (
            <a
              href={auditor.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 cursor-pointer"
            >
              View Document
            </a>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Driving License Number</label>
          <input
            type="text"
            name="drivingLicenseNo"
            placeholder="Enter Driving License Number"
            value={formData.drivingLicenseNo}
            disabled={isView}

            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Driving License Expiry Date</label>
          <input
            type="date"
            name="drivingLicenseExpiryDate"
            value={formData.drivingLicenseExpiryDate}
            disabled={isView}

            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Driving License</label>
          <input
            type="file"
            name="drivingLicenseFile"
            onChange={handleFileChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            disabled={isView}
          />
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Route</label>
          <select
            name="route"
            disabled={isView}

            value={formData.route}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Route</option>
            {selectRoute.map((route) => (
              <option key={route._id} value={route._id}>
                {route.name}
              </option>
            ))}
          </select>
        </div>

        {!isView && (
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition poppins-semibold duration-200"
            >
              {isEdit ? 'Update Auditor' : 'Submit'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddAuditer;
