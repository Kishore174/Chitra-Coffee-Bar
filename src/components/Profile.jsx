import React, { useState, useRef } from 'react';
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
    password: ""
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
    <div className='flex w-4/6 justify-center items-center mx-auto '>
      <div className=" w-full h-screen  mx-auto flex flex-col justify-center  ">
        <div className='flex justify-between w-full'>
          <div className="text-xl text-black font-bold ">
            <span>Edit Profile</span>
          </div>
          <div className='flex justify-end'>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <div className="flex items-center w-full relative">
              <img className="h-24 w-24 rounded-full" src={file} alt="Profile" />
              <div
                className="absolute top-0 left-0 right-0 mt-12 bg-black bg-opacity-50 rounded-b-full h-12 flex items-center justify-center"
              >
                <CiEdit
                  size={26}
                  className="text-white"
                  onClick={handleEditImageClick}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap w-full gap-5 mb-5">
          <div>
            <label className="font-bold text-sm w-full">First Name</label><br />
            <input
              className="w-full border border-gray-400 p-2 rounded-md "
              type="text"
              placeholder="Enter First Name"
              name="firstName"
              value={values.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div>
            <label className="font-bold text-sm">Last Name</label><br />
            <input
              className="w-full border border-gray-400 p-2 rounded-md "
              type="text"
              placeholder="Enter Last Name"
              name="lastName"
              value={values.lastName}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

          <div className=' flex'>
          <div className="flex flex-wrap w-full gap-5 mb-5">
            <div>
              <label className="font-bold text-sm">Email</label><br />
              <input
                className=" w-full border border-gray-400 p-2 rounded-md "
                type="email"
                placeholder="Enter Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="font-bold text-sm">Password</label><br />
              <input
                className=" border border-gray-400 p-2 rounded-md w-full"
                type="password"
                placeholder="Enter Password"
                name="password"
                value={values.password}
                onChange={handleInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap w-full gap-5 mb-5 ">
            <div className="mb-5">
              <label className="font-bold text-sm w-full">City</label><br />
              <select
                className="border border-gray-400 p-2 rounded-md w-[100%]"
                name="city"
                value={values.city}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="City">City</option>
                <option value="Vellore">Vellore</option>
                <option value="Chittoor">Chittoor</option>
                <option value="Ranipet">Ranipet</option>
                <option value="Arakkonam">Arakkonam</option>
              </select>
            </div>
          
          
          <div>
            <label className="font-bold text-sm w-full">State</label><br />
            <select
              className="border border-gray-400 p-2 rounded-md w-[100%]"
              name="state"
              value={values.state}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <option value="State">State</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
            </select>
          </div>
          </div>
          </div>
       
        <div className="flex flex-wrap w-full mb-5 justify-between ">
          <div className="mb-5 w-1/2 gap-5">
            <label className="font-bold text-sm">Address</label><br />
            <textarea
              className="w-[90%] border border-gray-400 p-2 rounded-md "
              placeholder="Enter Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="mb-5 w-1/2 ">
            <label className="font-bold text-sm">Contact Number</label><br />
            <input
              className="w-[80%] border border-gray-400 p-2 rounded-md "
              type="number"
              placeholder="Enter Contact Number"
              name="contactNumber"
              value={values.contactNumber}
              onChange={handleInputChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        <div className="flex gap-5">
          <button
            className="rounded-md border border-gray-500 w-[20%] p-3 mt-5 "
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="rounded-md hover:cursor-pointer text-white bg-orange-500 w-[20%] p-3 mt-5 "
            onClick={handleSave}
          >
            {isEditing ? "Edit" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
