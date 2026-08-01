import { axiosintance } from "./Api";
export const createShop = async (shopdata) => {
  const formData = new FormData();

  // Append all fields to the formData object
  for (const key in shopdata) {
    if (shopdata[key] !== null && shopdata[key] !== undefined && shopdata[key] !== "") {
      formData.append(key, shopdata[key]);
    }
  }
  const response = await axiosintance.post(`/shop-create`, formData);
  return response.data;
};
export const getAllShops = async (params) => {
  const response = await axiosintance.get(`/shops`, { params });
  return response.data;
};
export const getShopByAuditor = async (params) => {
  const response = await axiosintance.get(`/routes/shops`, { params });
  return response.data;
};
export const upDateShop = async (id, updateData) => {
  const formData = new FormData();

  for (const key in updateData) {
    if (updateData[key] !== null && updateData[key] !== undefined && updateData[key] !== "") {
      formData.append(key, updateData[key]);
    }
  }
  const response = await axiosintance.put(`/shop/${id}`, formData);
  return response.data;
};
export const deleteShop = async (id) => {
  const response = await axiosintance.delete(`/shop/${id}`);
  return response.data;
};
