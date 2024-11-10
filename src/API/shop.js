import { axiosintance } from "./Api"
export  const createShop =async(Id)=>{
  const response =await axiosintance.post(`/shop-create`)   
  return response.data
  }