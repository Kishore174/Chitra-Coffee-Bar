import { axiosintance } from "./Api";
export const getAllAudits = async () => {
    const response = await axiosintance.get(`/audits`);
    return response.data;
  };