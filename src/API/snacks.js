import { axiosintance } from "./Api";
export const createSnackAudit = async (id, data,setUploadProgress) => {
  const formData = new FormData();

  // Append other fields in data to formData
  for (const key in data) {
    if (key === 'captureImages' && Array.isArray(data.captureImages)) {
      // Append each image in captureImages array
      data.captureImages.forEach((image) => {
        formData.append(`captureImages`, image);
      });
    } else {
      formData.append(key, data[key]);
    }
  }
  const response = await axiosintance.post(`/audit/${id}/snacksAudit`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(progress); // Update the upload progress
    }
  });
  return response.data;
};

export  const getSnackAudit =async(id)=>{
    const response =await axiosintance.get(`/audit/${id}/snacksAudit`, )   
    return response.data
    }