import { axiosintance } from "./Api"
export  const createRoute =async(route)=>{
  const response =await axiosintance.post(`/route-add`,route)   
  return response.data
  }
  export  const addRoute =async(addroute,id)=>{
    const response =await axiosintance.post(`/route${id}/add-shop`,addroute)   
    return response.data
    }