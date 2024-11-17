import { axiosintance } from "./Api";
export const createRoute = async (route) => {
  const response = await axiosintance.post(`/route-add`, route);
  return response.data;
};
export const addRoute = async (addroute, id) => {
  const response = await axiosintance.post(`/route/${id}/add-shop`, {
    shops: addroute,
  });
  return response.data;
};
export const addset = async (data, id) => {
  const response = await axiosintance.post(`/route/${id}/add-set`, data);
  return response.data;
};
export const getRoute = async () => {
  const response = await axiosintance.get(`/routes`);
  return response.data;
};
export const deleteRoute = async (id) => {
  const response = await axiosintance.delete(`/route/${id}`);
  return response.data;
};
export const dropDownRoutes = async () => {
  const response = await axiosintance.get(`/routes-dropdown`);
  return response.data;
};
export const getRouteById = async (id) => {
  const response = await axiosintance.get(`/route/${id}`);
  return response.data;
};
