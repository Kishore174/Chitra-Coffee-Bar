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
  export  const getAllShops =async(allshops)=>{
    
    const response =await axiosintance.get(`/shops`,allshops)   
    return response.data
    }
    export  const upDateShop =async(id,updateData)=>{
    
      const response =await axiosintance.put(`/shop/${id}`,updateData)   
      return response.data
      }
      export  const deleteShop =async(id, deleteShop)=>{
    
        const response =await axiosintance.delete(`/shop/${id}`, deleteShop)   
        return response.data
        }