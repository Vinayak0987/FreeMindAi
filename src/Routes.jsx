import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ModelTraining from './pages/model-training';
import ModelDeployment from './pages/model-deployment';
import Dashboard from './pages/dashboard';
import DatasetManagement from './pages/dataset-management';
import ProjectWorkspace from './pages/project-workspace';
import AIAssistantChat from './pages/ai-assistant-chat';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/model-training" element={<ModelTraining />} />
        <Route path="/model-deployment" element={<ModelDeployment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dataset-management" element={<DatasetManagement />} />
        <Route path="/project-workspace" element={<ProjectWorkspace />} />
        <Route path="/ai-assistant-chat" element={<AIAssistantChat />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
