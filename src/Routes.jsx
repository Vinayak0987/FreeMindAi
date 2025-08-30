import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LandingPage from './pages/landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ModelTraining from './pages/model-training';
import ModelDeployment from './pages/model-deployment';
import Dashboard from './pages/dashboard';
import DatasetManagement from './pages/dataset-management';
import ProjectWorkspace from './pages/project-workspace';
import AIAssistantChat from './pages/ai-assistant-chat';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Routes = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <ScrollToTop />
            <RouterRoutes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/model-training" element={<ProtectedRoute><ModelTraining /></ProtectedRoute>} />
            <Route path="/model-deployment" element={<ProtectedRoute><ModelDeployment /></ProtectedRoute>} />
            <Route path="/dataset-management" element={<ProtectedRoute><DatasetManagement /></ProtectedRoute>} />
            <Route path="/project-workspace" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
            <Route path="/ai-assistant-chat" element={<ProtectedRoute><AIAssistantChat /></ProtectedRoute>} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default Routes;
