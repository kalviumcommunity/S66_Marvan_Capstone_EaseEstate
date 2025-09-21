import axios from 'axios';
import { mockAuthAPI, mockPropertyAPI } from './mockApi';

const API_BASE_URL = 'http://localhost:8000';

// Check if backend is available
const isBackendAvailable = async () => {
  try {
    await axios.get(API_BASE_URL, { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
};

// Auth API calls - fallback to mock if backend unavailable
export const authAPI = {
  register: async (userData) => {
    if (await isBackendAvailable()) {
      return axios.post(`${API_BASE_URL}/users/signup`, userData);
    }
    return mockAuthAPI.register(userData);
  },

  login: async (credentials) => {
    if (await isBackendAvailable()) {
      return axios.post(`${API_BASE_URL}/users/login`, credentials);
    }
    return mockAuthAPI.login(credentials);
  },

  getAllUsers: async () => {
    if (await isBackendAvailable()) {
      return axios.get(`${API_BASE_URL}/users`);
    }
    return mockAuthAPI.getAllUsers();
  }
};

// Property API calls - fallback to mock if backend unavailable
export const propertyAPI = {
  getAllProperties: async () => {
    if (await isBackendAvailable()) {
      return axios.get(`${API_BASE_URL}/property`);
    }
    return mockPropertyAPI.getAllProperties();
  },

  getPropertyById: async (id) => {
    if (await isBackendAvailable()) {
      return axios.get(`${API_BASE_URL}/property/${id}`);
    }
    return mockPropertyAPI.getPropertyById(id);
  },

  addProperty: async (propertyData, userId) => {
    if (await isBackendAvailable()) {
      return axios.post(`${API_BASE_URL}/property/add-property/${userId}`, propertyData);
    }
    return mockPropertyAPI.addProperty(propertyData, userId);
  },

  updateProperty: async (id, propertyData) => {
    if (await isBackendAvailable()) {
      return axios.put(`${API_BASE_URL}/property/${id}`, propertyData);
    }
    return mockPropertyAPI.updateProperty(id, propertyData);
  },

  deleteProperty: async (id) => {
    if (await isBackendAvailable()) {
      return axios.delete(`${API_BASE_URL}/property/${id}`);
    }
    return mockPropertyAPI.deleteProperty(id);
  }
};

export default axios;