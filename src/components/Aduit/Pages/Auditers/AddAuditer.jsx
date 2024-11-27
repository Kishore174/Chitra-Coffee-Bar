import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { createAuditor, upDateAuditor } from "../../../../API/auditor";
import toast from "react-hot-toast";
import { dropDownRoutes, getRoute } from "../../../../API/createRoute";
import { MdArrowBack } from "react-icons/md";
import { getUnassignedRoutes } from "../../../../API/settings";

const AddAuditer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { auditor, isEdit, isView } = location.state || {};

  const [formData, setFormData] = useState(
    auditor || {
      name: "",
      email: "",
      phone: "",
      address: "",
      documentType: "aadhar",
      documentFile: null,
      routes: [],
      drivingLicenseNo: "",
      drivingLicenseExpiryDate: "",
      drivingLicenseFile: null,
    }
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectRoute, setSelectRoute] = useState([]);
  const handleSelect = (routeId) => {
    if (selectedOptions.includes(routeId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== routeId));
    } else {
      setSelectedOptions([...selectedOptions, routeId]);
    }
  };

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
    formData.routes = selectedOptions.map(o=>o._id)
    console.log("Form Data:", formData);
    try {
      let res;

      if (isEdit) {
        res = await upDateAuditor(auditor._id, formData);
      } else {
        res = await createAuditor(formData);
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        documentType: "aadhar",
        documentFile: null,
        route: "",
        routes:[],
        drivingLicenseNo: "",
        drivingLicenseExpiryDate: "",
        drivingLicenseFile: null,
      });

      toast.success(res.message);
      navigate("/auditors");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auditor) {
      dropDownRoutes().then((data) => {
        setSelectRoute(data.data);
        setSelectedOptions(data.data.filter((route) => auditor.routes.includes(route._id)));
      });
    } else {
      getUnassignedRoutes().then((data) => {
        setSelectRoute(data.data);
      });
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200"
      >
        <MdArrowBack className="w-6 h-6 mt-1" />
        <h2 className="text-2xl font-semibold mb-4">
          {!auditor ? "Add Auditor" : isEdit ? "Edit Auditor" : "View Auditor"}
        </h2>
      </button>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Select Document Type
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Upload Document
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Driving License Number
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Driving License Expiry Date
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Upload Driving License
          </label>
          <input
            type="file"
            name="drivingLicenseFile"
            onChange={handleFileChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            disabled={isView}
          />
        </div>
        {/* 
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
        </div>*/}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Route
          </label>
          <div className="relative">
           
            <div
              className="border border-gray-300 rounded-md p-2 cursor-pointer flex items-center justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex flex-wrap gap-2">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <span
                      key={option._id}
                      name="routes"
                      disabled={isView}
 
                      className="bg-gray-200 text-gray-700 text-sm rounded-md px-2 py-1 flex items-center"
                    >
                      {option.name}
                      <button
                        type="button"
                        className="ml-1 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(option);
                        }}
                      >
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Select Routes</span>
                )}
              </div>
              <span className="text-gray-500">&#9662;</span>
            </div>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-10">
                {selectRoute.map((option) => (
                  <div
                    key={option._id}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      selectedOptions.includes(option) ? "bg-gray-100" : ""
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      className="mr-2"
                      readOnly
                    />
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isView && (
          <div className="col-span-full">
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition poppins-semibold duration-200"
            >
              {isEdit ? "Update Auditor" : "Submit"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddAuditer;
