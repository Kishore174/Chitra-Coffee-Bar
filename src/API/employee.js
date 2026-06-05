import { axiosintance } from "./Api";
export const createEmployee = async (shopdata) => {
  const formData = new FormData();

  // Append all fields to the formData object
  for (const key in shopdata) {
    if (key !== 'routes' && key !== 'permissions') {
      formData.append(key, shopdata[key]);
    }
  }

  // Ensure shopdata.routes is an array and append it separately
  if (Array.isArray(shopdata.routes)) {
    shopdata.routes.forEach((route) => {
      formData.append('routes', route); // Append each route as a separate entry
    });
  }
  
  if (Array.isArray(shopdata.permissions)) {
    shopdata.permissions.forEach((permission) => {
      formData.append('permissions', permission);
    });
  }
  const response = await axiosintance.post(`/auditor-create`, formData);
  return response.data;
};
export const getAllEmployees = async () => {
  const response = await axiosintance.get(`/auditors`);
  return response.data;
};
export const deleteEmployee = async (id) => {
  const response = await axiosintance.delete(`/auditor/${id}`);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const formData = new FormData();
  const {old_set,...rest} = data
  // Append all fields to the formData object
  for (const key in rest) {
    if (key !== 'routes' && key !== 'permissions') {
      formData.append(key, rest[key]);
    }
  }

  // Ensure shopdata.routes is an array and append it separately
  if (Array.isArray(rest.routes)) {
    rest.routes.forEach((route) => {
      formData.append('routes', route); // Append each route as a separate entry
    });
  }
  
  if (Array.isArray(rest.permissions)) {
    rest.permissions.forEach((permission) => {
      formData.append('permissions', permission);
    });
  }
  const response = await axiosintance.put(`/auditor/${id}`, formData);
  return response.data;
};

export const auditAssign = async()=>{
  const response = await axiosintance.post(`/assign-audits`);
  return response.data;
}
export const getProfile = async(id)=>{
  const response = await axiosintance.get(`/auditor/${id}`);
  return response.data;
}
export const updateProfile = async(id, formData)=>{
  const response = await axiosintance.patch(`/auditor/${id}/profile`, formData);
  return response.data;
}

export const deleteAudit = async(auditId)=>{
  const response = await axiosintance.delete(`/audit/${auditId}`);
  return response.data;
}