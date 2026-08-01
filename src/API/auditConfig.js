import { axiosintance } from "./Api";

// create a new audit config / template
export const createAuditConfig = async (data) => {
  const response = await axiosintance.post(`/audit-config`, data);
  return response.data;
};

// list all configs (newest first)
export const getAuditConfigs = async () => {
  const response = await axiosintance.get(`/audit-config`);
  return response.data;
};

// fetch the active config — used while performing an audit
export const getActiveAuditConfig = async () => {
  const response = await axiosintance.get(`/audit-config/active`);
  return response.data;
};

// fetch a single config by id
export const getAuditConfig = async (id) => {
  const response = await axiosintance.get(`/audit-config/${id}`);
  return response.data;
};

// update a config (totalWeightage is recomputed on the backend)
export const updateAuditConfig = async (id, data) => {
  const response = await axiosintance.put(`/audit-config/${id}`, data);
  return response.data;
};

// make a config the active one (deactivates the others)
export const setActiveAuditConfig = async (id) => {
  const response = await axiosintance.patch(`/audit-config/${id}/active`);
  return response.data;
};

// delete a config (moved to Bin on the backend)
export const deleteAuditConfig = async (id) => {
  const response = await axiosintance.delete(`/audit-config/${id}`);
  return response.data;
};
