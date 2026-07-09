import axios from "axios"

const axiosClient =  axios.create({
    baseURL: 'https://algotrack-dsa-solving-platform-1.onrender.com',
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

