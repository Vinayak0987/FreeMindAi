import { useState, useEffect, useCallback } from 'react';
import apiService from '../utils/api';

export const useApi = (endpoint, params = {}, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (customParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalParams = { ...params, ...customParams };
      const response = await endpoint(finalParams);
      
      setData(response.data);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [endpoint, params]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [fetchData, immediate]);

  const refetch = useCallback((customParams = {}) => {
    fetchData(customParams);
  }, [fetchData]);

  return { data, loading, error, refetch };
};

// Specialized hooks for common API calls
// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Mock data for unauthenticated users
const getMockData = (type) => {
  const mockData = {
    projects: {
      data: {
        projects: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    },
    activities: {
      data: {
        activities: [
          {
            _id: 'act1',
            id: 'act1',
            type: 'project_created',
            description: 'Welcome to FreeMind AI! Start by creating your first ML project.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
            project: {
              _id: 'proj1',
              name: 'Getting Started'
            }
          },
          {
            _id: 'act2',
            id: 'act2',
            type: 'dataset_uploaded',
            description: 'Explore our pre-built templates for quick ML model development.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            project: 'Sample Project'
          }
        ]
      }
    },
    trainingJobs: {
      data: {
        trainingJobs: []
      }
    },
    templates: {
      data: {
        templates: [
          {
            _id: 'mock1',
            name: 'Cricket Analytics 🏏',
            description: 'Analyze player performance and match predictions using machine learning algorithms',
            type: 'sports_analytics',
            difficulty: 'Beginner',
            estimatedTime: '30 min',
            usageCount: 150,
            rating: { average: 4.5, count: 23 }
          },
          {
            _id: 'mock2',
            name: 'Bollywood Sentiment 🎬',
            description: 'Analyze movie reviews in Hindi and English using natural language processing',
            type: 'nlp',
            difficulty: 'Intermediate',
            estimatedTime: '1 hour',
            usageCount: 125,
            rating: { average: 4.7, count: 31 }
          },
          {
            _id: 'mock3',
            name: 'Street Food Classification 🍛',
            description: 'Identify Indian street food items using computer vision and deep learning',
            type: 'computer_vision',
            difficulty: 'Advanced',
            estimatedTime: '2 hours',
            usageCount: 45,
            rating: { average: 4.8, count: 8 }
          }
        ]
      }
    },
    metrics: {
      data: {
        metrics: {
          totalProjects: 0,
          preparingProjects: 0,
          trainingProjects: 0,
          deployedProjects: 0,
          completedProjects: 0
        }
      }
    }
  };
  
  return Promise.resolve(mockData[type]);
};

export const useProjects = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated()) {
        // Use mock data for unauthenticated users
        const mockResponse = await getMockData('projects');
        setData(mockResponse);
      } else {
        const response = await apiService.projects.getAll(params);
        setData(response);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Fallback to mock data on any error
      const mockResponse = await getMockData('projects');
      setData(mockResponse);
      setError(null); // Clear error since we're using fallback data
    } finally {
      setLoading(false);
    }
  }, [params.search, params.sort, params.filter, params.limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useActivities = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated()) {
        const mockResponse = await getMockData('activities');
        setData(mockResponse);
      } else {
        const response = await apiService.activities.getRecent(params);
        setData(response.data);
      }
    } catch (err) {
      console.error('Error fetching activities:', err);
      const mockResponse = await getMockData('activities');
      setData(mockResponse);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useTrainingJobs = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated()) {
        const mockResponse = await getMockData('trainingJobs');
        setData(mockResponse);
      } else {
        const response = await apiService.training.getActive(params);
        setData(response.data);
      }
    } catch (err) {
      console.error('Error fetching training jobs:', err);
      const mockResponse = await getMockData('trainingJobs');
      setData(mockResponse);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useTemplates = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Always try to get templates from API first (they're public)
      const response = await apiService.templates.getPopular(params);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching templates:', err);
      // Fallback to mock data if API fails
      const mockResponse = await getMockData('templates');
      setData(mockResponse);
      setError(null); // Don't show error for templates since they're optional
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};

export const useProjectMetrics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isAuthenticated()) {
        const mockResponse = await getMockData('metrics');
        setData(mockResponse);
      } else {
        const response = await apiService.projects.getMetrics();
        setData(response.data);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
      const mockResponse = await getMockData('metrics');
      setData(mockResponse);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
