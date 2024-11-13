import { axiosintance } from "./Api";
export const createLiveSnacks = async (id, data) => {
  const formData = new FormData();

  // Append other fields in data to formData
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // Append each image in captureImages array
      data[key].forEach((item, index) => {
        if (item instanceof File) {
          formData.append(key, item); // Append if it's a file (image)
        }else if (typeof item === 'object') {
          // Instead of stringifying, you can append each property of the object
          for (const subKey in item) {
            formData.append(`${key}[${subKey}]`,JSON.stringify( item[subKey]));
          }
        } else {
          formData.append(key, item); // Append regular data
        }
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  const response = await axiosintance.post(`/audit/${id}/liveSnacksAudit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


export  const getLiveSnack =async(id)=>{
  const response =await axiosintance.get(`/audit/${id}/liveSnacksAudit`, )   
  return response.data
  }