import { axiosintance } from "./Api";
export const createAuditor = async (shopdata) => {
  const formData = new FormData();

  // Append all fields to the formData object
  for (const key in shopdata) {
    if (key !== 'routes') {
      formData.append(key, shopdata[key]);
    }
  }

  // Ensure shopdata.routes is an array and append it separately
  if (Array.isArray(shopdata.routes)) {
    shopdata.routes.forEach((route) => {
      formData.append('routes', route); // Append each route as a separate entry
    });
  }
  const response = await axiosintance.post(`/auditor-create`, formData);
  return response.data;
};
export const getAllAuditors = async () => {
  const response = await axiosintance.get(`/auditors`);
  return response.data;
};
export const deleteAuditor = async (id) => {
  const response = await axiosintance.delete(`/auditor/${id}`);
  return response.data;
};

export const upDateAuditor = async (id, data) => {
  const formData = new FormData();

  // Append all fields to the formData object
  for (const key in data) {
    if (key !== 'routes') {
      formData.append(key, data[key]);
    }
  }

  // Ensure shopdata.routes is an array and append it separately
  if (Array.isArray(data.routes)) {
    data.routes.forEach((route) => {
      formData.append('routes', route); // Append each route as a separate entry
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
export const updateProfile = async(id)=>{
  const response = await axiosintance.patch(`/auditor/${id}/profile`);
  return response.data;
}