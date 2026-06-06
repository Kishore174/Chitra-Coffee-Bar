import { axiosintance } from "./Api";

// fetch the V2 audit performed against a source (V1) audit — null if not started
export const getAuditV2 = async (auditId) => {
  const response = await axiosintance.get(`/audit-v2/${auditId}`);
  return response.data;
};

// list all config-driven audits
export const getAllAuditsV2 = async () => {
  const response = await axiosintance.get(`/audit-v2`);
  return response.data;
};

// get config-driven audits by date
export const getAuditDataV2 = async (data) => {
  const response = await axiosintance.post(`/audit-v2`, data);
  return response.data;
};

// get config-driven audits by auditor and date
export const getAuditByAuditorV2 = async (id, data) => {
  const response = await axiosintance.post(`/audit-v2/auditor/${id}`, data);
  return response.data;
};

/**
 * Create / update the V2 audit for a source audit.
 * @param {string} auditId  source (V1) audit id
 * @param {object} data     { sections, configName, ...meta } — sent as JSON
 * @param {Array<{key:string,file:File}>} files image files, keyed by field.key
 * @param {(n:number)=>void} setUploadProgress optional progress callback
 */
export const submitAuditV2 = async (
  auditId,
  data,
  files = [],
  setUploadProgress
) => {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(data));
  files.forEach(({ key, file }) => formData.append(key, file));

  const response = await axiosintance.post(`/audit-v2/${auditId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (setUploadProgress && e.total) {
        setUploadProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return response.data;
};
export const sendSignatureToBackendV2 = async (auditId, fd) => {
  const response = await axiosintance.post(`/audit-v2/${auditId}/signature`, fd);
  return response.data;
};

export const uploadAudioToBackendV2 = async (auditId, blob) => {
  const formData = new FormData();
  formData.append('audioFile', blob, `audio-${auditId}.wav`);
  const response = await axiosintance.post(`/audit-v2/${auditId}/audio`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const filterAuditsV2 = async (data) => {
  const response = await axiosintance.post(`/audit-v2/filter`, data);
  return response.data;
};

export const assignManualAuditsV2 = async (data) => {
  const response = await axiosintance.post(`/audit-v2/assign`, data);
  return response.data;
};
