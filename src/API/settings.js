import { axiosintance } from "./Api";
export const createBrand = async (data) => {
  const response = await axiosintance.post(`/setting/brand/add`, data);
  return response.data;
};
export const getBrand = async (data) => {
  const response = await axiosintance.get(`/brands`, data);
  return response.data;
};
export const createSnackBrand = async (data) => {
  const response = await axiosintance.post(`/setting/snack/add`, data);
  return response.data;
};
export const getSnackBrand = async (data) => {
  const response = await axiosintance.get(`/snacks`, data);
  return response.data;
};
export const createProduct = async (data) => {
  const response = await axiosintance.post(`/setting/product/add`, data);
  return response.data;
};
export const getProducts = async (data) => {
    const response = await axiosintance.get(`/products`, data);
    return response.data;
};
export const deleteLiveSnacks = async (id, data) => {
  const response = await axiosintance.delete(`/setting/snack/${id}`, data);
  return response.data;
};
export const updateLiveSnack = async (id, data) => {
  const response = await axiosintance.put(`/setting/snack/${id}`, data);
  return response.data;
};
export const deleteBrand = async (id, data) => {
  const response = await axiosintance.delete(`/setting/brand/${id}`, data);
  return response.data;
};
export const updateBrand = async (id, data) => {
  const response = await axiosintance.put(`/setting/brand/${id}`, data);
  return response.data;
};
