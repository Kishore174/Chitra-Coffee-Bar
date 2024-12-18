import { axiosintance } from "./Api";
export const createCoffee = async (id, data,setUploadProgress) => {
  const formData = new FormData();

  // Append other fields in data to formData
  for (const key in data) {
    if (key === 'captureImages' && Array.isArray(data.captureImages)) {
      // Append each image in captureImages array
      data.captureImages.forEach((image, ) => {
        formData.append(`captureImages`, image);
      });
    } else {
      formData.append(key, data[key]);
    }
  }

  const response = await axiosintance.post(`/audit/${id}/coffeeAudit`, formData, {
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


export  const getCoffee =async(id)=>{
  const response =await axiosintance.get(`/audit/${id}/coffeeAudit`, )   
  return response.data
  }