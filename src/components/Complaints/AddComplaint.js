import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosintance } from "../../API/Api";
import { toast } from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";
import { FaCommentMedical, FaInfoCircle, FaEdit } from "react-icons/fa";
import { getAllAuditors } from "../../API/auditor";
import { getAllShops } from "../../API/shop";
import { useAuth } from "../../context/AuthProvider";

const AddComplaint = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    outlet: "",
    complaint: "",
    complaintDate: new Date().toISOString().split('T')[0],
    registeredBy: user?._id || "",
    responsibility: "",
    targetDate: new Date().toISOString().split('T')[0],
    caPa: "",
    actualDate: "",
    remarks: "",
    status: "Pending",
  });
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auditors, setAuditors] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    // Fetch auditors and shops
    Promise.all([getAllAuditors(), getAllShops()]).then(([auditorsRes, shopsRes]) => {
      if (auditorsRes.success || auditorsRes.data) {
        setAuditors(auditorsRes.data || []);
      }
      if (shopsRes.success || shopsRes.data) {
        setShops(shopsRes.data || []);
      }
    }).catch(err => {
      console.error("Failed to load select options", err);
    });

    if (isEdit) {
      axiosintance.get(`/complaints/${id}`).then(res => {
        const complaintData = res.data?.data;
        if (complaintData) {
          setFormData({
            outlet: complaintData.outlet?._id || complaintData.outlet || "",
            complaint: complaintData.complaint || "",
            complaintDate: complaintData.complaintDate ? complaintData.complaintDate.split('T')[0] : "",
            registeredBy: complaintData.registeredBy?._id || complaintData.registeredBy || "",
            responsibility: complaintData.responsibility?._id || complaintData.responsibility || "",
            targetDate: complaintData.targetDate ? complaintData.targetDate.split('T')[0] : "",
            caPa: complaintData.caPa || "",
            actualDate: complaintData.actualDate ? complaintData.actualDate.split('T')[0] : "",
            remarks: complaintData.remarks || "",
            status: complaintData.status || "Pending",
          });
        }
      }).catch(err => {
        toast.error("Failed to fetch complaint data");
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setAttachments(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });
      attachments.forEach(file => {
        submitData.append("attachments", file);
      });

      let response;
      if (isEdit) {
        response = await axiosintance.put(`/complaints/${id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        response = await axiosintance.post(`/complaints`, submitData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }
      
      if (response.data.success) {
        toast.success(isEdit ? "Complaint updated successfully" : "Complaint added successfully");
        navigate(-1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} complaint`);
    } finally {
      setLoading(false);
    }
  };

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
              {isEdit ? <FaEdit size={20} /> : <FaCommentMedical size={20} />}
            </div>
            <div>
              <h2 className="text-2xl poppins-semibold text-gray-900 tracking-tight">
                {isEdit ? "Edit Complaint" : "Add New Complaint"}
              </h2>
              <p className="text-sm text-gray-500 poppins-regular mt-0.5">
                {isEdit ? "Update the details of the complaint." : "Enter the details below to log a new complaint."}
              </p>
            </div>
          </div>
        </div>

        {/* Unified Grid Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* General Information Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2 border-b border-gray-100 pb-2">
            <h3 className="text-md poppins-semibold text-gray-800 flex items-center gap-2"><FaInfoCircle className="text-gray-400" /> Complaint Details</h3>
          </div>

          <div>
            <label className={labelClass}>Outlet (Shop) <span className="text-[#da251d]">*</span></label>
            <select name="outlet" value={formData.outlet} onChange={handleChange} required className={inputClass}>
              <option value="">Select a shop...</option>
              {shops.map(shop => (
                <option key={shop._id} value={shop._id}>{shop.shopName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Complaint Date <span className="text-[#da251d]">*</span></label>
            <input type="date" name="complaintDate" value={formData.complaintDate} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Complaint Details <span className="text-[#da251d]">*</span></label>
            <textarea name="complaint" placeholder="Describe the complaint" value={formData.complaint} onChange={handleChange} required rows="3" className={`${inputClass} resize-none`}></textarea>
          </div>

          <div>
            <label className={labelClass}>Registered By <span className="text-[#da251d]">*</span></label>
            <select name="registeredBy" value={formData.registeredBy} onChange={handleChange} required disabled className={inputClass}>
              <option value="">Select auditor...</option>
              {auditors.map(aud => (
                <option key={aud._id} value={aud._id}>{aud.name} ({aud.role})</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Auto-assigned to current user</p>
          </div>

          <div>
            <label className={labelClass}>Responsibility <span className="text-[#da251d]">*</span></label>
            <select name="responsibility" value={formData.responsibility} onChange={handleChange} required className={inputClass}>
              <option value="">Select auditor...</option>
              {auditors.map(aud => (
                <option key={aud._id} value={aud._id}>{aud.name} ({aud.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Target Date <span className="text-[#da251d]">*</span></label>
            <input type="date" name="targetDate" value={formData.targetDate} onChange={handleChange} required className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Actual Date</label>
            <input type="date" name="actualDate" value={formData.actualDate} onChange={handleChange} className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Status <span className="text-[#da251d]">*</span></label>
            <select name="status" value={formData.status} onChange={handleChange} required className={inputClass}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className={labelClass}>CA/PA Action</label>
            <textarea name="caPa" placeholder="Corrective/Preventive Action" value={formData.caPa} onChange={handleChange} rows="2" className={`${inputClass} resize-none`}></textarea>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Remarks</label>
            <textarea name="remarks" placeholder="Additional remarks" value={formData.remarks} onChange={handleChange} rows="2" className={`${inputClass} resize-none`}></textarea>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className={labelClass}>Attachments ({isEdit ? "Optional - New files will be appended/replace existing" : "Optional"})</label>
            <input type="file" multiple onChange={handleFileChange} className={inputClass} />
            {attachments.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">{attachments.length} file(s) selected.</p>
            )}
          </div>

          {/* Submit */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-4 pb-12">
            <button type="submit" disabled={loading} className="bg-[#da251d] hover:bg-red-700 text-white py-2.5 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all poppins-semibold text-sm hover:-translate-y-0.5 disabled:opacity-50">
              {loading ? (isEdit ? "Updating..." : "Submitting...") : (isEdit ? "Update Complaint" : "Submit Complaint")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddComplaint;
