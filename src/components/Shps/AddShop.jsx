import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
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
      commercialAgree: null,
      gstCertificate: null,
    }
  );
  const [showPdfViewer, setShowPdfViewer] = useState("");
  const [franchiseType, setFranchiseType] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

 const handleFileChange = (e) => {
  const { id, files } = e.target;
  const file = files[0];

  // Validate file type (only PDFs allowed)
  if (file && file.type !== "application/pdf") {
    alert("Please upload a valid PDF file.");
    return;
  }

  // Update form data
  setFormData((prevFormData) => ({
    ...prevFormData,
    [id]: file,
  }));
};


  console.log(shop);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    console.log(formData);
    try {
      let res;

      if (isEdit) {
        res = await upDateShop(shop._id, formData);
      } else {
        res = await createShop(formData);
      }

      console.log(res);
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
        fssiCertificateNo: "",
        commercialAgree: null,
        gstCertificate: null,
      });
      toast.success(res.message);
      navigate("/myshop");
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
   <>
   {
    loading?<Loader/>:(
      <div className="p-8 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200"
      >
        <MdArrowBack className="w-6 h-6 mt-1" />

        <h2 className="text-2xl font-semibold mb-4">
          {!shop ? "Add Shop" : isEdit ? "Edit Shop" : "View Shop"}
        </h2>
      </button>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Property Type */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="propertyType"
          >
            Property Type
          </label>
          <select
            id="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="" disabled>
              Select property type
            </option>
            <option value="rent">Rent</option>
            <option value="own">Own</option>
          </select>
        </div>

        {formData.propertyType === "rent" ? (
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="rentalAgreement"
            >
              Rental Agreement
            </label>
            <input
              id="rentalAgreement"
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />

            {shop?.rentalAgree && (
              <a
                href={shop?.rentalAgree}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 cursor-pointer"
              >
                View Document
              </a>
            )}
          </div>
        ) : formData.propertyType === "own" ? (
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="ecard"
            >
              Eb Card
            </label>
            <input
              id="ebCard"
              type="file"
              onChange={handleFileChange}
              disabled={isView}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
            {shop?.ebCard && (
              <a
                href={shop?.ebCard}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 cursor-pointer"
              >
                View Document
              </a>
            )}
          </div>
        ) : null}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="shopName"
          >
            Shop Name
          </label>
          <input
            id="shopName"
            type="text"
            value={formData.shopName}
            onChange={handleChange}
            disabled={isView}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter shop name"
          />
        </div>

        {/* Shop Photo */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="shopPhoto"
          >
            Shop Photo
          </label>
          <input
            id="shopPhoto"
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={handleFileChange}
            disabled={isView}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          {shop?.shopPhoto && (
            <div className="mt-2">
              <img
                src={shop?.shopPhoto}
                alt="Rental Agreement"
                className="h-24 w-24 border border-gray-300 bg-gray-300 rounded-md shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Owner Name */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="ownerName"
          >
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="franchiseType"
          >
            Franchise Type
          </label>
          <select
            id="franchiseType"
            value={formData.franchiseType}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="" disabled>
              Select Franchise type
            </option>
            <option value="partnership">Partner Ship</option>
            <option value="own">Own</option>
          </select>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="phone"
          >
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="address"
          >
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
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="district"
          >
            PinCode
          </label>
          <input
            id="pincode"
            type="number"
            value={formData.pincode}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter location"
          />
        </div>
        {/* District */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="district"
          >
            District
          </label>
          <input
            id="district"
            type="text"
            value={formData.district}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter location"
          />
        </div>
        {/* State */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="state"
          >
            State
          </label>
          <input
            id="state"
            type="text"
            value={formData.state}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter location"
          />
        </div>
        {/* Country */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="country"
          >
            Country
          </label>
          <input
            id="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            placeholder="Enter location"
          />
        </div>
        {/* Location */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="location"
          >
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="onboardingDate"
          >
            Onboarding Date
          </label>
          <input
            id="onBoardingDate"
            type="date"
            value={formData.onBoardingDate.slice(0, 10)}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Renewal Date */}
        <div className="mb-6">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="renewalDate"
          >
            Commercial Renewal Date
          </label>
          <input
            id="renewalDate"
            type="date"
            value={formData.renewalDate.slice(0, 10)}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
        </div>

        {/* FSSI Certificate Number */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="fssiCertificateNumber"
          >
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
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="commercialAgree"
          >
            Commercial Agreement
          </label>
          <input
            id="commercialAgree"
            type="file"
            onChange={handleFileChange}
            disabled={isView}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          {shop?.commercialAgree && (
            <a
              href={shop?.commercialAgree}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 cursor-pointer"
            >
              View Document
            </a>
          )}
        </div>

        {/* GST Certificate Upload */}
        <div className="mb-4">
  <label
    className="block text-sm font-medium text-gray-700"
    htmlFor="gstCertificate"
  >
    GST Certificate
  </label>
  <input
    id="gstCertificate"
    type="file"
    onChange={handleFileChange}
    disabled={isView}
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
  />
{shop?.gstCertificate && shop?.gstCertificate.endsWith('.pdf') ? (
  <a
    href={shop?.gstCertificate}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-500 hover:underline mt-2 cursor-pointer"
  >
    View PDF
  </a>
) : shop?.gstCertificate && (
  <span className="text-red-500">Invalid file type. Please upload a PDF.</span>
)}

</div>


        
        {!isView && (
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              {isEdit ? "Update Shop" : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
    )
   }
   </>
  );
};

export default AddShop;
