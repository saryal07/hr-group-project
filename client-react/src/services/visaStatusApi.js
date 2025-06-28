import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const visaStatusApi = {
  // Get workflow status for all OPT documents
  getWorkflowStatus: async () => {
    const response = await apiClient.get('/documents/status');
    return response.data;
  },

  // Get all documents for the employee
  getAllDocuments: async () => {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  // Upload a document
  uploadDocument: async (file, documentType, description = '') => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    if (description) {
      formData.append('description', description);
    }

    const response = await apiClient.post('/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download I-983 templates
  downloadTemplate: async (templateType) => {
    const response = await apiClient.get(`/documents/templates/i983-${templateType}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Delete a document
  deleteDocument: async (documentId) => {
    const response = await apiClient.delete(`/documents/${documentId}`);
    return response.data;
  },
};

export default visaStatusApi; 