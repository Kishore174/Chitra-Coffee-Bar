import { axiosintance } from "./Api"
export  const createRoute =async(Id)=>{
  const response =await axiosintance.get(`/route-add`)   
  return response.data
  }