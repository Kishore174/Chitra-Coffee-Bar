import { axiosintance } from "./Api";
export const createAuditor = async (shopdata) => {
  const formData = new FormData();

  // Append all fields to the formData object
  for (const key in shopdata) {
    formData.append(key, shopdata[key]);
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

export const upDateAuditor = async (id, updateData) => {
  const response = await axiosintance.put(`/auditor/${id}`, updateData);
  return response.data;
};
