import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProjectHeader from './components/ProjectHeader';
import ProjectSidebar from './components/ProjectSidebar';
import ProjectOverview from './components/ProjectOverview';
  import DatasetPreview from './components/DatasetPreview';
  import ModelTrainingPanel from './components/ModelTrainingPanel';
  import Icon from '../../components/AppIcon';
  import AIAssistantFAB from '../../components/AIAssistantFAB';
import Button from '../../components/ui/Button';



const ProjectWorkspace = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  // Mock project data
  const [currentProject, setCurrentProject] = useState({
    id: 1,
    name: "Customer Churn Prediction",
    status: "training",
    progress: 75,
    createdAt: "Aug 15, 2024",
    lastUpdated: "2 hours ago",
    owner: "John Doe",
    datasetCount: 3,
    modelCount: 5,
    experimentCount: 12,
    deploymentStatus: "active",
    storageUsed: "2.4GB",
    trainingTime: "4.2h",
    apiCalls: "1,247"
  });

  // Mock datasets
  const datasets = [
    {
      id: 1,
      name: "customer_data_v2.csv",
      type: "csv",
      status: "processed",
      size: "1.2GB",
      rows: 125847,
      columns: 23,
      uploadedAt: "2024-08-25"
    },
    {
      id: 2,
      name: "transaction_history.csv",
      type: "csv",
      status: "processing",
      size: "850MB",
      rows: 89432,
      columns: 15,
      uploadedAt: "2024-08-28"
    },
    {
      id: 3,
      name: "customer_images",
      type: "image",
      status: "processed",
      size: "3.1GB",
      rows: 15000,
      columns: null,
      uploadedAt: "2024-08-20"
    }
  ];

  // Mock models
  const models = [
    {
      id: 1,
      name: "Random Forest Classifier",
      type: "classification",
      status: "completed",
      accuracy: 0.892,
      trainingTime: "2.4h",
      createdAt: "2024-08-28"
    },
    {
      id: 2,
      name: "Neural Network",
      type: "classification",
      status: "training",
      accuracy: 0.856,
      trainingTime: "1.2h",
      createdAt: "2024-08-29"
    }
  ];

  const handleProjectUpdate = (updatedProject) => {
    setCurrentProject(updatedProject);
  };

  const handleExport = () => {
    // Mock export functionality
    console.log('Exporting project...');
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e?.ctrlKey || e?.metaKey) {
        switch (e?.key) {
          case 's':
            e?.preventDefault();
            handleExport();
            break;
          case 'k':
            e?.preventDefault();
            navigate('/ai-assistant-chat');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const renderMainContent = () => {
    switch (activeView) {
      case 'datasets':
        return <DatasetPreview datasets={datasets} />;
      case 'models':
        return <ModelTrainingPanel models={models} />;
      default:
        return <ProjectOverview project={currentProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 flex min-h-screen">
        <ProjectSidebar 
          project={currentProject}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        
        <main className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-72'
        }`}>
          <ProjectHeader
            project={currentProject}
            onProjectUpdate={handleProjectUpdate}
            onExport={handleExport}
            onShare={handleShare}
          />
          
          <div className="flex-1 bg-background">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-popover border border-border rounded-lg w-96 elevation-3">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-popover-foreground">Share Project</h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1 hover:bg-muted rounded transition-colors duration-150"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-2 block">
                  Share with team members
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-popover-foreground mb-2 block">
                  Permission level
                </label>
                <select className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>View only</option>
                  <option>Can edit</option>
                  <option>Admin</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-4">
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Send Invitation
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setIsShareModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant FAB */}
      <AIAssistantFAB />
    </div>
  );
};

export default ProjectWorkspace;
