import React, { useState, useRef } from "react";
import { CiEdit } from "react-icons/ci";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState();

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    contactNumber: "",
    city: "City",
    state: "State",
    password: "",
  };

  const [values, setValues] = useState(initialValues);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (isEditing) {
      console.log("Saved values:", values);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setValues(initialValues);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleEditImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex justify-center items-center mx-auto p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">Edit Profile</h2>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <div className="relative">
              <img
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
                src={file || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                onClick={handleEditImageClick}
              >
                <CiEdit size={26} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600"
              type="text"
              placeholder="Enter First Name"
              name="firstName"
              value={values.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
      
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600"
              type="email"
              placeholder="Enter Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
     
         
         
       
          <div className="">
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600"
              placeholder="Enter Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contact Number</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-red-600"
              type="number"
              placeholder="Enter Contact Number"
              name="contactNumber"
              value={values.contactNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="rounded-md border text-black py-2 px-6 "
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-red-600 text-white py-2 px-6 hover:bg-red-700"
            onClick={handleSave}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
