import axios from 'axios'
const apiUrl=axios.create({
    baseURL:'http://192.168.0.186:5000/',
   
})

apiUrl.interceptors.request.use(function (config) {
    const accessToken = JSON.parse(localStorage.getItem('token'));
     const accessToken1 = JSON.parse(localStorage.getItem('token1'));

    // config.headers.Authorization = `Bearer ${accessToken}`
   config.headers.Authorization = accessToken?`Bearer ${accessToken}`:`Bearer ${accessToken1}` 

    return config;
});
export default apiUrl;