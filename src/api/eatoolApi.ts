import axios from 'axios'


const eatoolApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

// TODO interceptores
eatoolApi.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_TOKEN;

    if (token) {
        config.headers.Authorization = `Token ${token}` ;
    }

    return config;
});

export { eatoolApi };