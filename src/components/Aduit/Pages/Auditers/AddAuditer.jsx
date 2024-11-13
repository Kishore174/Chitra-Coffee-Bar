import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { createAuditor, upDateAuditor } from '../../../../API/auditor';
import toast from 'react-hot-toast';
import { dropDownRoutes, getRoute } from '../../../../API/createRoute';
import { MdArrowBack } from 'react-icons/md';

const AddAuditer = () => {
  const navigate = useNavigate();
  const location = useLocation ();
  
  const { auditor, isEdit,isView } = location.state || {};

  // State to store form values
  const [formData, setFormData] = useState(auditor||{
    name: '',
    email: '',
     phone: '',
    address: '',
    documentType: 'aadhar', //  
    documentFile: null,  
  });
 
  const [selectRoute, setSelectRoute] = useState([]);
 
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
  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    try {
      let res;

      if (isEdit) {
        res = await upDateAuditor(auditor._id,formData);
      } else {
       res = await createAuditor(formData );

      }
      setFormData({
        name: '',
        email: '',
         phone: '',
        address: '',
        documentType: 'aadhar', //  
        route:"",
        documentFile: null,  
      }
    );
    toast.success(res.message);
    navigate('/Auditers')
  } catch (error) {
    console.log(error)
  }
  };
  useEffect(() => {
    dropDownRoutes().then((data) => {
      setSelectRoute(data.data);
    });
  }, []);
  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
        <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
         <MdArrowBack className="w-6 h-6 mt-1" />
           <h2 className="text-2xl font-semibold mb-4">{!auditor? "Add Auditor" : isEdit ? "Edit Auditor" : "View Auditor"}</h2>
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
            name="phone"
            placeholder="Enter mobile number"
            value={formData. phone}
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
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Route<span className="text-red-500">*</span>
          </label>
          <select
            name="route"
            value={formData.route}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
            required
          >
            <option value="select Route" >
              Select Route
            </option>
            {selectRoute.map((e) => (
              <option key={e._id} value={e._id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div className="col-span-full">
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            {isEdit ? 'Update Auditor' : 'Submit'}
          </button>
        </div>
      </form>

    
    </div>
  );
};

export default AddAuditer;
