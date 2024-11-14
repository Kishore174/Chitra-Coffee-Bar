import {axiosintance} from './Api'

export const getDashboardAdmin = async () => {
    const response = await axiosintance.get('/dashboard/admin',);
    return response.data;
};
export const getDashboardAuditor = async (id) => {
    const response = await axiosintance.get(`/dashboard/auditor/${id}`);
    return response.data;
};