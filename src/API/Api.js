import axios from "axios";
//  export const axiosintance =axios.create({
//     baseURL:"http://192.168.1.9:5454/api/v1" ,
//     // headers: {
//     //   Authorization: `Bearer ${Cookie.get('token')}`
//     // },
//     // withCredentials : true
// })
export const axiosintance = axios.create({
    // baseURL: process.env.REACT_APP_API_URL,
    baseURL:"https://apiccb-fkhfhgbrbjhjcrf3.canadacentral-01.azurewebsites.net/api/v1" ,
   
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

export const uploadAudioToBackend = async (id,data) => {
    const formData = new FormData();
    
    const audioFile = new File([data], 'recording.wav', { type: 'audio/wav' });
    
    formData.append('audioFile', audioFile);  // Append the audio file to form data
    formData.append('date', Date.now()); 
    try {
      const response = await axiosintance.post(`/audit/${id}/audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Audio uploaded successfully:', response.data);
      return response.data
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

 export const sendSignatureToBackend = async (id,formData) => {
      const response = await axiosintance.post(`/audit/${id}/signature`, formData)

      return response.data; 
  }