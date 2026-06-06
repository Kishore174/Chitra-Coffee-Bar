import { axiosintance } from "./Api";

export const checkIn = async (formData) => {
  const response = await axiosintance.post("/attendance/check-in", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const checkOut = async (formData) => {
  const response = await axiosintance.post("/attendance/check-out", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getTodayStatus = async () => {
  const response = await axiosintance.get("/attendance/today");
  return response.data;
};

export const getMyAttendance = async (month, year) => {
  const response = await axiosintance.get(`/attendance/my?month=${month}&year=${year}`);
  return response.data;
};

export const getAllAttendance = async (date, startDate, endDate) => {
  let url = `/attendance/all`;
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

export const getMonthlyAttendance = async (month, year) => {
  const response = await axiosintance.get(`/attendance/monthly?month=${month}&year=${year}`);
  return response.data;
};
