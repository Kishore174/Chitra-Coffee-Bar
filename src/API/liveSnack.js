import { axiosintance } from "./Api";

export const createLiveSnacks = async (id, data) => {
  const formData = new FormData();

  // Append other fields in data to formData
  for (const key in data) {
    if (Array.isArray(data[key])) {
      // Append each item in the array
      data[key].forEach((item, index) => {
        if (Array.isArray(item)) {
          // If item is an array, handle it accordingly
          item.forEach((subItem, subIndex) => {
            for (const subKey in subItem) {
              formData.append(`${key}[${index}][${subIndex}][${subKey}]`, subItem[subKey]);
            }
          });
        } else if (item instanceof File) {
          formData.append(key, item); // Append if it's a file (image)
        } else if (typeof item === 'object') {
          // Append each property of the object
          for (const subKey in item) {
            formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
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