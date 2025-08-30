import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Icon from './AppIcon';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-green-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="Brain" size={32} color="white" />
          </div>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Icon name="Loader" size={16} className="animate-spin" />
            <span>Loading Alok's AI Studio...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended route
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoute;
