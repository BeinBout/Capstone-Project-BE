import axios from 'axios';
import 'dotenv/config';

const api = axios.create({
  baseURL: process.env.AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-AI-API-CALL': process.env.AI_SERVICE_CREDS
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default api;