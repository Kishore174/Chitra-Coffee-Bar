import {axiosintance} from './Api'
export const login = async(data)=>{
    const response = await axiosintance.post('/login',data)
    return response.data
}
export const resetPassword = async(data)=>{
    const response = await axiosintance.post('/reset-password',data)
    return response.data
}
export const getAuditorBytoken = async(data)=>{
    const response = await axiosintance.get('/auditor-token',data)
    return response.data
}
export const logout = async(data)=>{
    const response = await axiosintance.post('/logout')
    return response.data
}

