import axios from "axios";
//  export const axiosintance =axios.create({
//     baseURL:"http://192.168.1.9:5454/api/v1" ,
//     // headers: {
//     //   Authorization: `Bearer ${Cookie.get('token')}`
//     // },
//     // withCredentials : true
// })
export const axiosintance = axios.create({
    baseURL: "https://ccb-backend.vercel.app/api/v1",
    // headers: {
    //   Authorization: `Bearer ${Cookie.get('token')}`
    // },
    withCredentials : true
  });
export const signup = async (signupData) => {
    const response = await axiosintance.post('/register', signupData);
    return response.data;
};

export const login = async (signupData) => {
    const response = await axiosintance.post('/login', signupData);
    return response.data;
};