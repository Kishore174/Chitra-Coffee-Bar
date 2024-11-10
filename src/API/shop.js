import { axiosintance } from "./Api"
export  const createShop =async(shopdata)=>{
  const formData = new FormData();
        
  // Append all fields to the formData object
  for (const key in shopdata) {
      formData.append(key, shopdata[key]);
  }
  const response =await axiosintance.post(`/shop-create`,formData)   
  return response.data
  }