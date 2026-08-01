import React, { useState, useRef, useEffect } from "react";
import { getProfile, updateProfile } from '../API/employee';
import { useAuth } from "../context/AuthProvider";
import Loader from "./Loader";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaCamera, FaUpload } from "react-icons/fa";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    address: "",
    phone: "",
    profile: "",
    role: ""
  };

  const [values, setValues] = useState(initialValues);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await getProfile(user._id);
      setValues({
        name: res?.data?.name || "",
        email: res?.data?.email || "",
        address: res?.data?.address || "",
        phone: res?.data?.phone || "",
        profile: res?.data?.profile || "",
        role: res?.data?.role || ""
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEditImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("phone", values.phone);
      if (file) {
        formData.append("profileFile", file);
      }
      
      const res = await updateProfile(user._id, formData);
      toast.success(res.message || "Profile updated successfully!");
      setIsEditing(false);
      setFile(null);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setIsEditing(false);
    fetchProfile();
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-full bg-white py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 poppins-semibold">My Profile</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center transition-all hover:shadow-md">
              <div className="relative group mb-6">
                <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm">
                  <img
                    src={file ? URL.createObjectURL(file) : (values.profile || `https://ui-avatars.com/api/?name=${values.name}&background=fca5a5&color=fff&size=150`)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button 
                    onClick={handleEditImageClick}
                    className="absolute bottom-1 right-1 bg-red-600 p-2.5 rounded-full text-white shadow-lg hover:bg-red-700 transition border-2 border-white transform hover:scale-105"
                  >
                    <FaCamera size={16} />
                  </button>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2 poppins-semibold">{values.name || "User Name"}</h2>
              
              <span className="px-5 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-semibold flex items-center gap-2 mb-6 capitalize tracking-wide">
                <FaShieldAlt size={13} /> {values.role || "Role"}
              </span>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              
              {isEditing && (
                <button 
                  onClick={handleEditImageClick}
                  className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200 font-medium transition flex items-center justify-center gap-2 mt-2"
                >
                  <FaUpload size={14} /> Upload New Photo
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Details Form */}
          <div className="w-full lg:w-2/3">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 transition-all hover:shadow-md">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
                  <h2 className="text-xl font-bold text-gray-800 poppins-semibold">Personal Details</h2>
                  {!isEditing && (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm px-5 py-2.5 bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center gap-2"
                    >
                      <FaUser size={12} /> Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-8">
                  
                  {/* Name */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FaUser className={isEditing ? "text-red-400" : "text-gray-400"} />
                      </div>
                      <input
                        className={`w-full pl-11 p-3.5 rounded-xl border transition-all outline-none text-sm font-medium ${
                          isEditing ? "border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-50 bg-white text-gray-900" : "border-transparent bg-gray-50 text-gray-600 cursor-default"
                        }`}
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FaEnvelope className={isEditing ? "text-red-400" : "text-gray-400"} />
                      </div>
                      <input
                        className={`w-full pl-11 p-3.5 rounded-xl border transition-all outline-none text-sm font-medium ${
                          isEditing ? "border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-50 bg-white text-gray-900" : "border-transparent bg-gray-50 text-gray-600 cursor-default"
                        }`}
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FaPhone className={isEditing ? "text-red-400" : "text-gray-400"} />
                      </div>
                      <input
                        className={`w-full pl-11 p-3.5 rounded-xl border transition-all outline-none text-sm font-medium ${
                          isEditing ? "border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-50 bg-white text-gray-900" : "border-transparent bg-gray-50 text-gray-600 cursor-default"
                        }`}
                        type="text"
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2.5 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Residential Address</label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-3.5 flex items-start pointer-events-none">
                        <FaMapMarkerAlt className={isEditing ? "text-red-400" : "text-gray-400"} />
                      </div>
                      <textarea
                        rows="3"
                        className={`w-full pl-11 p-3.5 rounded-xl border transition-all outline-none resize-none text-sm font-medium leading-relaxed ${
                          isEditing ? "border-gray-300 focus:border-red-500 focus:ring-4 focus:ring-red-50 bg-white text-gray-900" : "border-transparent bg-gray-50 text-gray-600 cursor-default"
                        }`}
                        name="address"
                        value={values.address}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Save & Cancel Actions */}
                {isEditing && (
                  <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100">
                    <button
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:text-gray-900 transition"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-8 py-3 rounded-xl text-white font-semibold shadow-md bg-red-600 hover:bg-red-700 transition flex items-center justify-center min-w-[150px] hover:shadow-lg"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
