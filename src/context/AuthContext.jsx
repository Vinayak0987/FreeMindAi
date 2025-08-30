import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const actionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    
    case actionTypes.AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    
    case actionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests if available
axios.interceptors.request.use(
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

// Handle response errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
        return;
      }

      try {
        const response = await axios.get('/auth/me');
        
        if (response.data.success) {
          dispatch({
            type: actionTypes.AUTH_SUCCESS,
            payload: {
              user: response.data.data.user,
              token: token
            }
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        dispatch({
          type: actionTypes.AUTH_FAILURE,
          payload: 'Session expired. Please login again.'
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: actionTypes.AUTH_START });

    try {
      const response = await axios.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        dispatch({
          type: actionTypes.AUTH_SUCCESS,
          payload: { user, token }
        });
        
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      dispatch({
        type: actionTypes.AUTH_FAILURE,
        payload: errorMessage
      });
      
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: actionTypes.AUTH_START });

    try {
      const response = await axios.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        dispatch({
          type: actionTypes.AUTH_SUCCESS,
          payload: { user, token }
        });
        
        return { success: true, user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (error.response?.data?.errors ? error.response.data.errors[0].msg : 'Registration failed');
      
      dispatch({
        type: actionTypes.AUTH_FAILURE,
        payload: errorMessage
      });
      
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout endpoint
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('token');
      dispatch({ type: actionTypes.LOGOUT });
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/auth/profile', userData);
      
      if (response.data.success) {
        dispatch({
          type: actionTypes.AUTH_SUCCESS,
          payload: {
            user: response.data.data.user,
            token: state.token
          }
        });
        
        return { success: true, user: response.data.data.user };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      throw new Error(errorMessage);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Context value
  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
