import axios from 'axios'


const eatoolApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

// TODO interceptores
eatoolApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const company = localStorage.getItem('company');

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    if (config.method === 'get' && company && company !== 'ALL') {
        config.params = { ...config.params, company };
    }

    return config;
});

export { eatoolApi };