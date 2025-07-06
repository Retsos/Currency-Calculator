import axios from 'axios';
import { useAuthStore } from './ZustandStore';

const baseUrl = 'http://127.0.0.1:3000/'



const api = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
})


//only users with token can see the data
api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("Token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`; //ξεκιναει με bearer keno 'token' 
        }
        else{
            config.headers.Authorization = ``;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

//clean the token
api.interceptors.response.use(

    (response)=>{
        return response;
    },
    (error)=>{
        if (error.response && error.response.status === 401) { //καλω το logout απο store για να καθαρισει το τοκεν 
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);

    }

)

export default api; 