import { axiosintance } from "./Api";
export const createLiveSnacks = async (id, data) => {
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