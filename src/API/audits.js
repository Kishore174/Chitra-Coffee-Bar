import { axiosintance } from "./Api";
export const getAllAudits = async () => {
    const response = await axiosintance.get(`/audits`);
    return response.data;
  };
  export const getAudit = async (id) => {
    const response = await axiosintance.get(`/audit/${id}`);
    return response.data;
  };
  export const getAuditByAuditor = async (id) => {
    const response = await axiosintance.get(`/audit/auditor/${id}`);
    return response.data;
  };
  export const getInsideShop = async (id) => {
    const response = await axiosintance.get(`/audit/${id}/insideShopAudit`);
    return response.data;
  };
export const createInsideshop = async (id,data) => {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item); // Append file directly
        } else if (typeof item === 'object') {
          // Instead of stringifying, you can append each property of the object
          for (const subKey in item) {
            formData.append(`${key}[${subKey}]`, item[subKey]);
          }
        } else {
          formData.append(key, item); // Append regular data
        }
      });
    } else if (data[key] instanceof File) {
      formData.append(key, data[key]); // Append file directly
    } else if (typeof data[key] === 'object') {
      // Append each property of the object
      for (const subKey in data[key]) {
        formData.append(`${key}[${subKey}]`, data[key][subKey]);
      }
    } else {
      formData.append(key, data[key]); // Append regular data
    }
  }

    const response = await axiosintance.post(`/audit/${id}/insideShopAudit`,formData);
    return response.data;
};
export const getInsideKitchen = async (id) => {
  const response = await axiosintance.get(`/audit/${id}/insideKitchenAudit`);
  return response.data;
};
export const createInsideKitchen = async (id,data) => {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item); // Append file directly
        } else if (typeof item === 'object') {
          // Instead of stringifying, you can append each property of the object
          for (const subKey in item) {
            formData.append(`${key}[${subKey}]`, item[subKey]);
          }
        } else {
          formData.append(key, item); // Append regular data
        }
      });
    } else if (data[key] instanceof File) {
      formData.append(key, data[key]); // Append file directly
    } else if (typeof data[key] === 'object') {
      // Append each property of the object
      for (const subKey in data[key]) {
        formData.append(`${key}[${subKey}]`, data[key][subKey]);
      }
    } else {
      formData.append(key, data[key]); // Append regular data
    }
  }

    const response = await axiosintance.post(`/audit/${id}/insideKitchenAudit`,formData);
    return response.data;
};
export const getOutsideKitchen = async (id) => {
  const response = await axiosintance.get(`/audit/${id}/outsideKitchenAudit`);
  return response.data;
};
export const createOutsideKitchen = async (id,data) => {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item); // Append file directly
        } else if (typeof item === 'object') {
          // Instead of stringifying, you can append each property of the object
          for (const subKey in item) {
            formData.append(`${key}[${subKey}]`, item[subKey]);
          }
        } else {
          formData.append(key, item); // Append regular data
        }
      });
    } else if (data[key] instanceof File) {
      formData.append(key, data[key]); // Append file directly
    } else if (typeof data[key] === 'object') {
      // Append each property of the object
      for (const subKey in data[key]) {
        formData.append(`${key}[${subKey}]`, data[key][subKey]);
      }
    } else {
      formData.append(key, data[key]); // Append regular data
    }
  }

    const response = await axiosintance.post(`/audit/${id}/outsideKitchenAudit`,formData);
    return response.data;
};
export const getWallBranding = async (id) => {
  const response = await axiosintance.get(`/audit/${id}/wallBrandingAudit`);
  return response.data;
};
export const createWallBranding = async (id,data) => {
  const formData = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      data[key].forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item); // Append file directly
        } else if (typeof item === 'object') {
          // Instead of stringifying, you can append each property of the object
          for (const subKey in item) {
            formData.append(`${key}[${subKey}]`, item[subKey]);
          }
        } else {
          formData.append(key, item); // Append regular data
        }
      });
    } else if (data[key] instanceof File) {
      formData.append(key, data[key]); // Append file directly
    } else if (typeof data[key] === 'object') {
      // Append each property of the object
      for (const subKey in data[key]) {
        formData.append(`${key}[${subKey}]`, data[key][subKey]);
      }
    } else {
      formData.append(key, data[key]); // Append regular data
    }
  }

    const response = await axiosintance.post(`/audit/${id}/wallBrandingAudit`,formData);
    return response.data;
};
export const createStock = async (id, data) => {
  const formData = new FormData();

  // Append other fields in data to formData
  for (const key in data) {
    if (key === 'captureImages' && Array.isArray(data.captureImages)) {
      // Append each image in captureImages array
      data.captureImages.forEach((image, index) => {
        formData.append(`captureImages`, image);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  const response = await axiosintance.post(`/audit/${id}/stockAudit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
export const getStock = async (id) => {
  const response = await axiosintance.get(`/audit/${id}/stockAudit`);
  return response.data;
};
export  const createEmployees =async(id ,data)=>{
  const response =await axiosintance.post(`/audit/${id}/employeeAudit`,data)   
  return response.data
  }
  export  const createDress =async(id ,data)=>{
    const response =await axiosintance.post(`/audit/${id}/uniformAudit`,data)   
    return response.data
    }
    export  const getDress =async(id ,data)=>{
      const response =await axiosintance.get(`/audit/${id}/uniformAudit`,data)   
      return response.data
      }
  export  const getEmployees =async(id)=>{
    const response =await axiosintance.get(`/audit/${id}/employeeAudit`)   
    return response.data
    }
    export  const getPainting =async(id)=>{
      const response =await axiosintance.get(`/audit/${id}/paintingAudit`)   
      return response.data
      }
      export  const getPrevious =async(id)=>{
        const response =await axiosintance.post(`/audit/${id}/lastAudits`)   
        return response.data
        }
    export const createPainting = async (id, data) => {
      const formData = new FormData();
    
      // Append other fields in data to formData
      for (const key in data) {
        if (key === 'captureImages' && Array.isArray(data.captureImages)) {
          // Append each image in captureImages array
          data.captureImages.forEach((image, index) => {
            formData.append(`captureImages`, image);
          });
        } else {
          formData.append(key, data[key]);
        }
      }
    
      const response = await axiosintance.post(`/audit/${id}/paintingAudit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    };