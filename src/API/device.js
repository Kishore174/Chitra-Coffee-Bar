import { axiosintance } from "./Api";

export const getAllDevices = async () => {
    try {
        const response = await axiosintance.get(`/devices`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};

export const deleteDevice = async (deviceId) => {
    try {
        const response = await axiosintance.delete(`/devices/${deviceId}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};

export const toggleDevicePin = async (deviceId, isPinned) => {
    try {
        const response = await axiosintance.patch(`/device/${deviceId}/toggle-pin`, { isPinned });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};

export const assignDeviceAuditor = async (deviceId, auditorId) => {
    try {
        const response = await axiosintance.patch(`/device/${deviceId}/assign-auditor`, { auditorId });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};

export const updateDeviceWhitelist = async (deviceId, whitelist) => {
    try {
        const response = await axiosintance.patch(`/device/${deviceId}/whitelist`, { whitelist });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};

export const toggleDeviceWhitelist = async (deviceId, isActive) => {
    try {
        const response = await axiosintance.patch(`/device/${deviceId}/toggle-whitelist`, { isActive });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Network error");
    }
};
