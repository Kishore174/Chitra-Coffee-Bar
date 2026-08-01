import { axiosintance } from "./Api";

export const createLeaveRequest = async (data) => {
  const response = await axiosintance.post("/leave-request", data);
  return response.data;
};

export const getMyLeaveRequests = async () => {
  const response = await axiosintance.get("/leave-requests/my");
  return response.data;
};

export const getAllLeaveRequests = async (status, startDate, endDate) => {
  let url = `/leave-requests/all?`;
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  }
  const response = await axiosintance.get(url + params.toString());
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

export const getLeavesByDate = async (date, startDate, endDate) => {
  let url = `/leave-requests/by-date`;
  const params = new URLSearchParams();
  if (startDate && endDate) {
    params.append('startDate', startDate);
    params.append('endDate', endDate);
  } else if (date) {
    params.append('date', date);
  }
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  const response = await axiosintance.get(url);
  return response.data;
};
