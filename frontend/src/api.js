import axios from 'axios'
let accesstoken=JSON.parse(localStorage.getItem('token'))
const apiUrl=axios.create({
    baseURL:'http://192.168.0.186:5000/',
   
})

apiUrl.interceptors.request.use(function (config) {
    const accessToken = JSON.parse(localStorage.getItem('token'));
    config.headers.Authorization =  `Bearer ${accessToken}` 
    return config;
});
export default apiUrl;