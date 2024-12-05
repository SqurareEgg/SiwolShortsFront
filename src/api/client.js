import axios from 'axios';

// src/api/client.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "https://short-community-backend-latest-966651362826.asia-northeast3.run.app/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  }
});