import { axiosintance } from "./Api";
export  const createBrand =async(data)=>{
    const response =await axiosintance.post(`/setting/brand/add`,data)   
    return response.data
    }
    export  const getBrand =async(data)=>{
        const response =await axiosintance.get(`/brands`,data)   
        return response.data
        }
        export  const createSnackBrand =async(data)=>{
            const response =await axiosintance.post(`/setting/snack/add`,data)   
            return response.data
            }
            export  const getSnackBrand =async(data)=>{
                const response =await axiosintance.get(`/snacks`,data)   
                return response.data
                }
        export  const createProduct =async(data)=>{
            const response =await axiosintance.post(`/setting/product/add`,data)   
            return response.data
            }