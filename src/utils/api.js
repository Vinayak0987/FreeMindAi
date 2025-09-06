import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-app.vercel.app/api' 
    : 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
  },

  // Projects endpoints
  projects: {
    getAll: (params = {}) => api.get('/projects', { params }),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'thumbnail' && data[key]) {
          formData.append(key, data[key]);
        } else if (key === 'tags' && Array.isArray(data[key])) {
          data[key].forEach(tag => formData.append('tags[]', tag));
        } else {
          formData.append(key, data[key]);
        }
      });
      return api.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    update: (id, data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'thumbnail' && data[key]) {
          formData.append(key, data[key]);
        } else if (key === 'tags' && Array.isArray(data[key])) {
          data[key].forEach(tag => formData.append('tags[]', tag));
        } else {
          formData.append(key, data[key]);
        }
      });
      return api.put(`/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    delete: (id) => api.delete(`/projects/${id}`),
    getMetrics: () => api.get('/projects/metrics/overview'),
  },

  // Activities endpoints
  activities: {
    getAll: (params = {}) => api.get('/activities', { params }),
    getRecent: () => api.get('/activities/recent'),
    getStats: () => api.get('/activities/stats'),
  },

  // Training endpoints
  training: {
    getAll: (params = {}) => api.get('/training', { params }),
    getActive: () => api.get('/training/active'),
    getById: (id) => api.get(`/training/${id}`),
    create: (data) => api.post('/training', data),
    updateProgress: (id, data) => api.put(`/training/${id}/progress`, data),
    cancel: (id) => api.post(`/training/${id}/cancel`),
    getLogs: (id, params = {}) => api.get(`/training/${id}/logs`, { params }),
  },

  // Templates endpoints
  templates: {
    getPublic: (params = {}) => api.get('/templates/public', { params }),
    getById: (id) => api.get(`/templates/public/${id}`),
    getMy: (params = {}) => api.get('/templates/my', { params }),
    create: (data) => api.post('/templates', data),
    getMeta: () => api.get('/templates/meta'),
    getPopular: () => api.get('/templates/popular'),
  },

  // File upload endpoints
  files: {
    uploadImage: (file, folder = 'images') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return api.post('/files/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    uploadDataset: (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return api.post('/files/upload/dataset', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
  },

  // Nebula Backend Integration
  nebula: {
    // Data Processing - Use Python backend
    processDataset: (config) => {
      const formData = new FormData();
      formData.append('task_type', config.taskType || 'text_classification');
      formData.append('text_prompt', config.textPrompt || 'Movie recommendation system');
      
      // Add file if provided
      if (config.file) {
        formData.append('file', config.file);
      }
      
      // Add folder zip if provided
      if (config.folderZip) {
        formData.append('folder_zip', config.folderZip);
      }
      
      return fetch('http://localhost:5001/process', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      }).catch(error => {
        console.error('Fetch error:', error);
        throw error;
      });
    },
    
    // Model Training
    trainModel: (config) => api.post('/train', config),
    getTrainingStatus: (jobId) => api.get(`/train/status/${jobId}`),
    
    // Model Analysis
    analyzeModel: (modelId) => api.get(`/analyze/${modelId}`),
    
    // Visualization
    generateVisualization: (config) => api.post('/visualize', config),
    getCNNVisualization: (modelId) => api.get(`/visualize/cnn/${modelId}`),
    getObjectDetectionVisualization: (modelId) => api.get(`/visualize/object/${modelId}`),
    
    // Deployment
    deployModel: (config) => api.post('/deploy', config),
    getDeploymentStatus: (deploymentId) => api.get(`/deploy/status/${deploymentId}`),
    
    // Reports and Downloads
    getReport: (filename) => api.get(`/report/${filename}`, { responseType: 'blob' }),
    downloadFile: (filename) => api.get(`/download/${filename}`, { responseType: 'blob' }),
    
    // Chatbot
    chatWithBot: (message) => api.post('/chatbot', { message }),
    
    // Dataset Operations
    expandDataset: (config) => api.post('/dataset/expand', config),
    preprocessData: (config) => api.post('/preprocess', config),
  },
};

// Export both api instance and service
export { api };
export default apiService;
