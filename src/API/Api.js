import axios from "axios";
 export const axiosintance =axios.create({
    baseURL:"http://localhost:8080/api/v1" ,
    // headers: {
    //   Authorization: `Bearer ${Cookie.get('token')}`
    // },
    withCredentials : true
})
export const signup = async (signupData) => {
    const response = await axiosintance.post('/register', signupData);
    return response.data;
};

export const login = async (signupData) => {
    const response = await axiosintance.post('/login', signupData);
    return response.data;
};