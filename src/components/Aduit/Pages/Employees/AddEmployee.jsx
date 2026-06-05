import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaUserPlus, FaUserEdit, FaUserCircle, FaIdCard, FaLock, FaRoute } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { createEmployee, updateEmployee } from "../../../../API/employee";
import toast from "react-hot-toast";
import { dropDownRoutes, getRoute } from "../../../../API/createRoute";
import { MdArrowBack } from "react-icons/md";
import { getUnassignedRoutes } from "../../../../API/settings";

const AddEmployee = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { employee, isEdit, isView } = location.state || {};

  const [formData, setFormData] = useState(
    employee || {
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
      role: "auditor",
      permissions: [],
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

  const AVAILABLE_PERMISSIONS = [
    { label: "Dashboard", value: "/dashboard" },
    { label: "My Shops", value: "/myshop" },
    { label: "Audits", value: "/audit" },
    { label: "Attendance", value: "/attendance-management" },
    { label: "Leave Request", value: "/leave-management" },
    { label: "Reports", value: "/reports" },
    { label: "Routes", value: "/routes" },
    { label: "Employees", value: "/employees" },
    { label: "Devices", value: "/devices" },
    { label: "Settings", value: "/setting" },
    { label: "Audit Config", value: "/audit-config" },
  ];

  const handlePermissionToggle = (permValue) => {
    if (isView) return;
    const perms = formData.permissions || [];
    if (perms.includes(permValue)) {
      setFormData({ ...formData, permissions: perms.filter(p => p !== permValue) });
    } else {
      setFormData({ ...formData, permissions: [...perms, permValue] });
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
    
    // Auto-assign permissions to super-admin
    if (formData.role === "super-admin") {
      formData.permissions = AVAILABLE_PERMISSIONS.map(p => p.value);
    }
    
    try {
      let res;

      if (isEdit) {
        res = await updateEmployee(employee._id, formData);
      } else {
        res = await createEmployee(formData);
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
        role: "auditor",
        permissions: [],
      });

      toast.success(res.message);
      navigate("/employees");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (employee) {
      dropDownRoutes().then((data) => {
        setSelectRoute(data.data);
        setSelectedOptions(data.data.filter((route) => employee.routes.includes(route._id)));
      });
    } else {
      getUnassignedRoutes().then((data) => {
        setSelectRoute(data.data);
      });
    }
  }, [employee]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".custom-dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm poppins-regular focus:outline-none focus:bg-white focus:border-[#da251d] focus:ring-2 focus:ring-red-100 transition-all disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-gray-700 poppins-medium mb-1.5";

  return (
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
              {isEdit ? <FaUserEdit size={20} /> : (!employee ? <FaUserPlus size={20} /> : <FaUserCircle size={20} />)}
            </div>
            <div>
              <h2 className="text-2xl poppins-semibold text-gray-900 tracking-tight">
                {!employee ? "Add New Employee" : isEdit ? "Edit Employee" : "Employee Details"}
              </h2>
              <p className="text-sm text-gray-500 poppins-regular mt-0.5">
                {!employee ? "Enter the details below to create a new profile." : "View and manage employee information."}
              </p>
            </div>
          </div>
        </div>

        {/* Unified Grid Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div>
            <label className={labelClass}>Full Name <span className="text-[#da251d]">*</span></label>
            <input type="text" name="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} disabled={isView} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>System Role</label>
            <select name="role" value={formData.role || "auditor"} onChange={handleChange} disabled={isView} className={inputClass}>
              <option value="auditor">Auditor</option>
              <option value="super-admin">Super Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Email Address <span className="text-[#da251d]">*</span></label>
            <input type="email" name="email" placeholder="e.g. john@example.com" value={formData.email} onChange={handleChange} disabled={isView} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Mobile Number <span className="text-[#da251d]">*</span></label>
            <input type="tel" name="phone" placeholder="e.g. 9876543210" value={formData.phone} onChange={handleChange} disabled={isView} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Residential Address <span className="text-[#da251d]">*</span></label>
            <textarea name="address" placeholder="Enter full address" value={formData.address} onChange={handleChange} disabled={isView} required rows="1" className={`${inputClass} resize-none`}></textarea>
          </div>

          <div className="custom-dropdown relative">
            <label className={labelClass}>Assigned Routes</label>
            <div
              className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm poppins-regular flex items-center justify-between transition-all ${!isView ? 'cursor-pointer hover:border-[#da251d]' : 'opacity-60 cursor-not-allowed'}`}
              onClick={() => !isView && setDropdownOpen(!dropdownOpen)}
            >
              <div className="flex flex-wrap gap-1">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <span key={option._id} className="bg-white border border-gray-200 text-gray-700 text-xs poppins-medium rounded-lg px-2 py-1 flex items-center shadow-sm">
                      {option.name}
                      {!isView && (
                        <button type="button" className="ml-1.5 text-gray-400 hover:text-red-500 transition-colors" onClick={(e) => { e.stopPropagation(); handleSelect(option); }}>&times;</button>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Select assigned routes</span>
                )}
              </div>
              <span className="text-gray-400 ml-2">&#9662;</span>
            </div>

            {dropdownOpen && !isView && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-56 overflow-y-auto z-20 py-1">
                {selectRoute.map((option) => (
                  <div
                    key={option._id}
                    className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors flex items-center ${selectedOptions.includes(option) ? "bg-red-50/50 text-[#da251d]" : "text-gray-700"}`}
                    onClick={() => handleSelect(option)}
                  >
                    <div className={`w-4 h-4 mr-3 rounded border flex items-center justify-center ${selectedOptions.includes(option) ? 'border-[#da251d] bg-[#da251d]' : 'border-gray-300'}`}>
                      {selectedOptions.includes(option) && <FaCheckCircle size={10} className="text-white" />}
                    </div>
                    {option.name}
                  </div>
                ))}
                {selectRoute.length === 0 && <div className="px-4 py-3 text-sm text-gray-500 text-center">No unassigned routes available</div>}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>ID Document Type</label>
            <select name="documentType" value={formData.documentType} onChange={handleChange} disabled={isView} className={inputClass}>
              <option value="aadhar">Aadhar Card</option>
              <option value="pan">PAN Card</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Upload ID Document</label>
            <div className="relative">
              <input type="file" name="documentFile" onChange={handleFileChange} disabled={isView} className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors bg-gray-50 border border-gray-200 rounded-xl" />
            </div>
            {employee?.documentUrl && (
              <a href={employee.documentUrl} target="_blank" rel="noopener noreferrer" className="text-[#da251d] hover:underline text-xs poppins-medium mt-2 inline-block">Preview current document &rarr;</a>
            )}
          </div>

          <div>
            <label className={labelClass}>Driving License Number <span className="text-[#da251d]">*</span></label>
            <input type="text" name="drivingLicenseNo" placeholder="e.g. TN0120230000000" value={formData.drivingLicenseNo} onChange={handleChange} disabled={isView} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>License Expiry Date <span className="text-[#da251d]">*</span></label>
            <input type="date" name="drivingLicenseExpiryDate" value={formData.drivingLicenseExpiryDate} onChange={handleChange} disabled={isView} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Upload License</label>
            <input type="file" name="drivingLicenseFile" onChange={handleFileChange} disabled={isView} className="w-full text-sm text-gray-500 file:mr-2 file:py-2.5 file:px-3 file:rounded-lg file:border-0 file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 transition-colors bg-gray-50 border border-gray-200 rounded-xl" />
          </div>

          {/* Module Permissions */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-4 border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <FaLock className="text-gray-400" size={16} />
              <h3 className="text-md poppins-semibold text-gray-800">Module Permissions</h3>
            </div>
            
            {formData.role === "super-admin" ? (
              <div className="bg-blue-50 border border-blue-100 text-blue-800 px-4 py-3 rounded-xl text-sm poppins-medium flex items-start">
                <FaCheckCircle className="mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
                Super Admins automatically have full unrestricted access to all modules and features.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm.value} className={`flex items-center space-x-3 p-3 rounded-xl border transition-colors ${(formData.permissions || []).includes(perm.value) ? 'bg-red-50 border-red-200 text-[#da251d]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-red-200'} ${isView ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <div className={`w-5 h-5 rounded border flex flex-shrink-0 items-center justify-center transition-colors ${(formData.permissions || []).includes(perm.value) ? 'border-[#da251d] bg-[#da251d]' : 'border-gray-300 bg-white'}`}>
                      {(formData.permissions || []).includes(perm.value) && <FaCheckCircle size={12} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={(formData.permissions || []).includes(perm.value)} onChange={() => handlePermissionToggle(perm.value)} disabled={isView} />
                    <span className="text-sm poppins-medium">{perm.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          {!isView && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-4 pb-12">
              <button type="submit" className="bg-[#da251d] hover:bg-red-700 text-white py-2.5 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all poppins-semibold text-sm hover:-translate-y-0.5">
                {isEdit ? "Save Changes" : "Create Employee Profile"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;