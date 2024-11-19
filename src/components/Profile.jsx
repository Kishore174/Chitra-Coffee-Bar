import React, { useState, useRef, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import{getProfile} from '../API/auditor'
import { useAuth } from "../context/AuthProvider";
import Loader from "./Loader";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState();
  const {user} = useAuth()
  const [loading, setLoading] = useState(true); 

  const initialValues = {
    name: "", 
    email: "",
    address: "",
    contact: "",
    profile:""
    
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
useEffect(()=>{
  getProfile(user?._id).then((res)=>{setValues(res?.data)
    setLoading(false) 
  })
   
},[])
  return (
  <>
  {
    loading?<Loader/>:
    (
      
      <>
        <div className="flex justify-center poppins-medium items-center mx-auto p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
       
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700">{isEditing?"Edit Profile":" Profile"}</h2>
          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: "none" }}
              readOnly={!isEditing}

            />
            <div className="relative">
              <img
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover"
                src={values.profile || "https://via.placeholder.com/150"}
                alt="Profile"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer"
                onClick={handleEditImageClick}
              readOnly={!isEditing}

              >
                <CiEdit size={26} className="text-white" 
              readOnly={!isEditing}
              />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              className="w-full border border-gray-300 outline-none p-3 rounded-md  "
              type="text"
              placeholder="Enter First Name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
              readOnly={!isEditing}
              disabled={!isEditing}
            />
          </div>
      
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md outline-none"
              type="email"
              placeholder="Enter Email"
              name="email"
              value={values.email}
              onChange={handleInputChange}
              readOnly={!isEditing}
              disabled={!isEditing}

            />
          </div>
     
         
         
       
          <div className="">
            <label className="block text-sm font-medium text-gray-600">Address</label>
            <textarea
              className="w-full border border-gray-300 p-3 rounded-md outline-none"
              placeholder="Enter Address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
              readOnly={!isEditing}
              disabled={!isEditing}

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contact Number</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-md "
              type="number"
              placeholder="Enter Contact Number"
              name="phone"
              value={values.phone}
              onChange={handleInputChange}
              readOnly={!isEditing}
              disabled={!isEditing}

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
      </>
    )
  }
  </>

  );
};

export default Profile;
