import axios from 'axios';

// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
});