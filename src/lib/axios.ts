import Axios, { InternalAxiosRequestConfig } from 'axios';

function authRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }
  return config;
}

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor
axios.interceptors.request.use(authRequestInterceptor);

// Response interceptor
axios.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    let message: unknown;
    const respData = error?.response?.data;
    console.log('---------------------------------------------------------');
    console.log('Error Tracker:', error);
    console.log('---------------------------------------------------------');
    console.log('Error w/ Data:', respData);

    return Promise.reject(message);
  }
);
