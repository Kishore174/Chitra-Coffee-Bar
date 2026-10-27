import { axiosintance } from './Api';

export const getDashboardAdmin = async (params = {}) => {
  const response = await axiosintance.get('/dashboard/admin', { params });
  return response.data;
};

export const getDashboardAuditor = async (id, params = {}) => {
  const response = await axiosintance.get(`/dashboard/auditor/${id}`, { params });
  return response.data;
};

export const getExpiryAlerts = async () => {
  const response = await axiosintance.get('/dashboard/expiry-alerts');
  return response.data;
};