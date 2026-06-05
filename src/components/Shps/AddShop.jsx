import React, { useState } from "react";
import { FaCheckCircle, FaStore, FaEdit, FaEye } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { createRoute } from "../../API/createRoute";
import toast from "react-hot-toast";
import { createShop, upDateShop } from "../../API/shop";
import { MdArrowBack } from "react-icons/md";
import Loader from "../Loader";

const AddShop = () => {
  const location = useLocation();

  const { shop, isEdit, isView } = location.state || {};
  const [formData, setFormData] = useState(
    shop || {
      shopName: "",
      shopPhoto: "",
      ownerName: "",
      propertyType: "",
      franchiseType: "",
      phone: "",
      email: "",
      address: "",
      district: "",
      state: "",
      pincode:'',
      country: "",
      location: "",
      onBoardingDate: "",
      renewalDate: "",
      fssiCertificateNo: "",
      fssiRenewalDate:"",
      commercialAgree: null,
      gstCertificate: null,
    }
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    const file = files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      let res;
      if (isEdit) {
        res = await upDateShop(shop._id, formData);
      } else {
        res = await createShop(formData);
      }

      setFormData({
        shopName: "",
        shopPhoto: "",
        ownerName: "",
        franchiseType: "",
        propertyType: "",
        phone: "",
        email: "",
        address: "",
        pincode:'',
        location: "",
        onBoardingDate: "",
        renewalDate: "",
        fssiRenewalDate:"",
        fssiCertificateNo: "",
        commercialAgree: null,
        gstCertificate: null,
      });
      toast.success(res.message);
      navigate("/myshop");
    } catch (error) {
      console.log(error);
      toast.error("Failed to save shop details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm poppins-regular focus:outline-none focus:bg-white focus:border-[#da251d] focus:ring-2 focus:ring-red-100 transition-all disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-gray-700 poppins-medium mb-1.5";
  const fileInputClass = "w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors bg-gray-50 border border-gray-200 rounded-xl";

  return (
   <>
   {loading ? <Loader/> : (
      <div className="p-4 md:p-8 min-h-screen bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="flex items-center space-x-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-[#da251d] hover:border-[#da251d] transition-colors shadow-sm"
            >
              <MdArrowBack size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-[#da251d] text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-md">
                {isEdit ? <FaEdit size={20} /> : (isView ? <FaEye size={20} /> : <FaStore size={20} />)}
              </div>
              <div>
                <h2 className="text-2xl poppins-semibold text-gray-900 tracking-tight">
                  {!shop ? "Add New Shop" : isEdit ? "Edit Shop Details" : "View Shop Details"}
                </h2>
                <p className="text-sm text-gray-500 poppins-regular mt-0.5">
                  {!shop ? "Enter the details below to onboard a new shop." : "Manage the shop's information and documents."}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Shop Name */}
            <div>
              <label className={labelClass} htmlFor="shopName">Shop Name <span className="text-[#da251d]">*</span></label>
              <input id="shopName" type="text" value={formData.shopName} onChange={handleChange} disabled={isView} required className={inputClass} placeholder="e.g. Chitra Coffee Bar - Main Branch" />
            </div>

            {/* Owner Name */}
            <div>
              <label className={labelClass} htmlFor="ownerName">Owner Name <span className="text-[#da251d]">*</span></label>
              <input id="ownerName" type="text" value={formData.ownerName} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. Jane Doe" />
            </div>

            {/* Franchise Type */}
            <div>
              <label className={labelClass} htmlFor="franchiseType">Franchise Type</label>
              <select id="franchiseType" value={formData.franchiseType} disabled={isView} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Select Franchise type</option>
                <option value="partnership">Partnership</option>
                <option value="own">Properties</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className={labelClass} htmlFor="propertyType">Property Type <span className="text-[#da251d]">*</span></label>
              <select id="propertyType" value={formData.propertyType} onChange={handleChange} disabled={isView} required className={inputClass}>
                <option value="" disabled>Select property type</option>
                <option value="rent">Rent</option>
                <option value="own">Own</option>
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className={labelClass} htmlFor="phone">Phone <span className="text-[#da251d]">*</span></label>
              <input id="phone" type="tel" value={formData.phone} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. 9876543210" />
            </div>

            {/* Email */}
            <div>
              <label className={labelClass} htmlFor="email">Email ID <span className="text-[#da251d]">*</span></label>
              <input id="email" type="email" value={formData.email} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. shop@example.com" />
            </div>

            {/* Address */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className={labelClass} htmlFor="address">Address <span className="text-[#da251d]">*</span></label>
              <textarea id="address" value={formData.address} disabled={isView} required onChange={handleChange} rows="1" className={`${inputClass} resize-none`} placeholder="Enter full shop address" />
            </div>

            {/* PinCode */}
            <div>
              <label className={labelClass} htmlFor="pincode">PinCode <span className="text-[#da251d]">*</span></label>
              <input id="pincode" type="number" value={formData.pincode} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. 600001" />
            </div>

            {/* District */}
            <div>
              <label className={labelClass} htmlFor="district">District <span className="text-[#da251d]">*</span></label>
              <input id="district" type="text" value={formData.district} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. Chennai" />
            </div>

            {/* State */}
            <div>
              <label className={labelClass} htmlFor="state">State <span className="text-[#da251d]">*</span></label>
              <input id="state" type="text" value={formData.state} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. Tamil Nadu" />
            </div>

            {/* Country */}
            <div>
              <label className={labelClass} htmlFor="country">Country <span className="text-[#da251d]">*</span></label>
              <input id="country" type="text" value={formData.country} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. India" />
            </div>

            {/* Location Link */}
            <div>
              <label className={labelClass} htmlFor="location">Google Maps Link <span className="text-[#da251d]">*</span></label>
              <input id="location" type="text" value={formData.location} disabled={isView} required onChange={handleChange} className={inputClass} placeholder="e.g. https://maps.google.com/..." />
            </div>

            {/* Onboarding Date */}
            <div>
              <label className={labelClass} htmlFor="onBoardingDate">Onboarding Date</label>
              <input id="onBoardingDate" type="date" value={(formData.onBoardingDate || "").slice(0, 10)} disabled={isView} onChange={handleChange} className={inputClass} />
            </div>

            {/* Document Uploads Section Heading */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 border-t border-gray-100 pt-6">
              <h3 className="text-md poppins-semibold text-gray-800 mb-4">Documents & Certifications</h3>
            </div>

            {/* Shop Photo */}
            <div>
              <label className={labelClass} htmlFor="shopPhoto">Shop Photo</label>
              <input id="shopPhoto" type="file" onChange={handleFileChange} disabled={isView} className={fileInputClass} />
              {shop?.shopPhoto && (
                <div className="mt-3">
                  <img src={shop?.shopPhoto} alt="Shop" className="h-20 w-20 object-cover border border-gray-200 rounded-lg shadow-sm" />
                </div>
              )}
            </div>

            {/* Property Specific Document */}
            {formData.propertyType === "rent" ? (
              <div>
                <label className={labelClass} htmlFor="rentalAgree">Rental Agreement</label>
                <input id="rentalAgree" type="file" onChange={handleFileChange} disabled={isView} className={fileInputClass} />
                {shop?.rentalAgree && (
                  <a href={shop?.rentalAgree} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:underline text-xs poppins-medium mt-2 inline-block">View Document &rarr;</a>
                )}
              </div>
            ) : formData.propertyType === "own" ? (
              <div>
                <label className={labelClass} htmlFor="ebCard">EB Card</label>
                <input id="ebCard" type="file" onChange={handleFileChange} disabled={isView} className={fileInputClass} />
                {shop?.ebCard && (
                  <a href={shop?.ebCard} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:underline text-xs poppins-medium mt-2 inline-block">View Document &rarr;</a>
                )}
              </div>
            ) : null}

            {/* FSSI Certificate Number */}
            <div>
              <label className={labelClass} htmlFor="fssiCertificateNo">FSSI Certificate Number</label>
              <input id="fssiCertificateNo" type="text" value={formData.fssiCertificateNo} onChange={handleChange} disabled={isView} className={inputClass} placeholder="Enter FSSI certificate number" />
            </div>

            {/* FSSI Renewal Date */}
            <div>
              <label className={labelClass} htmlFor="fssiRenewalDate">FSSI Renewal Date</label>
              <input id="fssiRenewalDate" type="date" disabled={isView} value={(formData.fssiRenewalDate || "").slice(0, 10)} onChange={handleChange} className={inputClass} />
            </div>

            {/* Commercial Agreement Upload */}
            <div>
              <label className={labelClass} htmlFor="commercialAgree">Commercial Agreement</label>
              <input id="commercialAgree" type="file" onChange={handleFileChange} disabled={isView} className={fileInputClass} />
              {shop?.commercialAgree && (
                <a href={shop?.commercialAgree} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:underline text-xs poppins-medium mt-2 inline-block">View Document &rarr;</a>
              )}
            </div>

            {/* Commercial Renewal Date */}
            <div>
              <label className={labelClass} htmlFor="renewalDate">Commercial Renewal Date <span className="text-[#da251d]">*</span></label>
              <input id="renewalDate" type="date" disabled={isView} required value={(formData.renewalDate || "").slice(0, 10)} onChange={handleChange} className={inputClass} />
            </div>

            {/* GST Certificate Upload */}
            <div>
              <label className={labelClass} htmlFor="gstCertificate">GST Certificate</label>
              <input id="gstCertificate" type="file" onChange={handleFileChange} disabled={isView} className={fileInputClass} />
              {shop?.gstCertificate && shop?.gstCertificate.endsWith('.pdf') ? (
                <a href={shop?.gstCertificate} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:underline text-xs poppins-medium mt-2 inline-block">View PDF &rarr;</a>
              ) : shop?.gstCertificate && (
                <span className="text-red-500 text-xs poppins-medium mt-2 inline-block">Invalid file type. Please upload a PDF.</span>
              )}
            </div>

            {/* Submit Button */}
            {!isView && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-4 pb-12">
                <button
                  type="submit"
                  className="bg-[#da251d] hover:bg-red-700 text-white py-2.5 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all poppins-semibold text-sm hover:-translate-y-0.5"
                >
                  {isEdit ? "Update Shop Details" : "Submit Shop Profile"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    )}
   </>
  );
};

export default AddShop;
