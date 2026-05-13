import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add response interceptor to handle errors
axiosClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Return response with error data
      return Promise.reject({
        message: error.response.data?.message || error.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      });
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

