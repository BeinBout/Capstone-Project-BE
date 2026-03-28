import axios from 'axios';
import 'dotenv/config';

const api = axios.create({
  baseURL: process.env.AI_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-AI-API-CALL': process.env.AI_SERVICE_CREDS
  },
});

export default api;