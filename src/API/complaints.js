import { axiosintance } from "./Api";

export const getComplaints = async () => {
  const response = await axiosintance.get("/complaints");
  return response.data;
};

export const getMyComplaints = async () => {
  const response = await axiosintance.get("/complaints/my");
  return response.data;
};

export const createComplaint = async (data) => {
  const response = await axiosintance.post("/complaints", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateComplaint = async (id, data) => {
  const response = await axiosintance.put(`/complaints/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteComplaint = async (id) => {
  const response = await axiosintance.delete(`/complaints/${id}`);
  return response.data;
};
