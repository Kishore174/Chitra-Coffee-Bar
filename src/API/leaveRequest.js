import { axiosintance } from "./Api";

export const createLeaveRequest = async (data) => {
  const response = await axiosintance.post("/leave-request", data);
  return response.data;
};

export const getMyLeaveRequests = async () => {
  const response = await axiosintance.get("/leave-requests/my");
  return response.data;
};

export const getAllLeaveRequests = async (status) => {
  const response = await axiosintance.get(`/leave-requests/all${status ? `?status=${status}` : ""}`);
  return response.data;
};

export const updateLeaveStatus = async (leaveId, data) => {
  const response = await axiosintance.patch(`/leave-request/${leaveId}/status`, data);
  return response.data;
};

export const deleteLeaveRequest = async (leaveId) => {
  const response = await axiosintance.delete(`/leave-request/${leaveId}`);
  return response.data;
};

export const getLeavesByDate = async (date) => {
  const response = await axiosintance.get(`/leave-requests/by-date?date=${date}`);
  return response.data;
};
