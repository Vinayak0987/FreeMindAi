import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

// Import dashboard components
import MetricsCard from './components/MetricsCard';
import ProjectCard from './components/ProjectCard';
import ActivityFeed from './components/ActivityFeed';
import TrainingProgress from './components/TrainingProgress';
import QuickStartTemplates from './components/QuickStartTemplates';
import NewProjectModal from './components/NewProjectModal';
import AIAssistantFAB from '../../components/AIAssistantFAB';

const Dashboard = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: 'FolderOpen',
      color: 'primary'
    },
    {
      title: 'Models Deployed',
      value: '8',
      change: '+2',
      changeType: 'positive',
      icon: 'Rocket',
      color: 'success'
    },
    {
      title: 'Training Jobs',
      value: '4',
      change: '0',
      changeType: 'neutral',
      icon: 'Brain',
      color: 'warning'
    },
    {
      title: 'Datasets',
      value: '24',
      change: '+5',
      changeType: 'positive',
      icon: 'Database',
      color: 'accent'
    }
  ];

  // Mock data for projects
  const projectsData = [
    {
      id: 1,
      name: 'Customer Churn Prediction',
      description: 'Predict customer churn using machine learning algorithms to identify at-risk customers and improve retention strategies.',
      status: 'training',
      progress: 75,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      lastModified: '2 hours ago',
      tags: ['Classification', 'Customer Analytics', 'Business Intelligence']
    },
    {
      id: 2,
      name: 'Sales Forecasting Model',
      description: 'Time series forecasting model to predict future sales trends and optimize inventory management.',
      status: 'deployed',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?w=400&h=300&fit=crop',
      lastModified: '1 day ago',
      tags: ['Regression', 'Time Series', 'Sales']
    },
    {
      id: 3,
      name: 'Image Classification System',
      description: 'Deep learning model for automated image classification and object detection in manufacturing quality control.',
      status: 'preparing',
      thumbnail: 'https://images.pixabay.com/photo/2017/05/10/19/29/robot-2301646_1280.jpg?w=400&h=300&fit=crop',
      lastModified: '3 days ago',
      tags: ['Computer Vision', 'CNN', 'Manufacturing']
    },
    {
      id: 4,
      name: 'Sentiment Analysis Tool',
      description: 'Natural language processing model to analyze customer feedback and social media sentiment.',
      status: 'completed',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      lastModified: '5 days ago',
      tags: ['NLP', 'Sentiment Analysis', 'Text Processing']
    },
    {
      id: 5,
      name: 'Fraud Detection System',
      description: 'Real-time fraud detection using anomaly detection algorithms for financial transactions.',
      status: 'training',
      progress: 45,
      thumbnail: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg?w=400&h=300&fit=crop',
      lastModified: '1 week ago',
      tags: ['Anomaly Detection', 'Finance', 'Security']
    },
    {
      id: 6,
      name: 'Recommendation Engine',
      description: 'Collaborative filtering system for personalized product recommendations in e-commerce.',
      status: 'deployed',
      thumbnail: 'https://images.pixabay.com/photo/2017/08/10/08/47/laptop-2619337_1280.jpg?w=400&h=300&fit=crop',
      lastModified: '2 weeks ago',
      tags: ['Recommendation', 'E-commerce', 'Collaborative Filtering']
    }
  ];

  // Mock data for recent activities
  const activitiesData = [
    {
      id: 1,
      type: 'model_trained',
      description: 'Customer Churn Prediction model training completed',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      project: 'Customer Analytics'
    },
    {
      id: 2,
      type: 'model_deployed',
      description: 'Sales Forecasting model deployed to production',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      project: 'Sales Intelligence'
    },
    {
      id: 3,
      type: 'dataset_uploaded',
      description: 'New customer data uploaded for analysis',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      project: 'Customer Analytics'
    },
    {
      id: 4,
      type: 'project_created',
      description: 'Image Classification System project created',
      timestamp: new Date(Date.now() - 14400000), // 4 hours ago
      project: 'Quality Control'
    },
    {
      id: 5,
      type: 'collaboration',
      description: 'John Doe joined Fraud Detection project',
      timestamp: new Date(Date.now() - 21600000), // 6 hours ago
      project: 'Security Analytics'
    }
  ];

  // Mock data for training jobs
  const trainingJobsData = [
    {
      id: 1,
      modelName: 'Customer Churn v2.1',
      status: 'running',
      progress: 75,
      currentEpoch: 15,
      totalEpochs: 20,
      elapsedTime: 1800, // 30 minutes in seconds
      eta: 600 // 10 minutes in seconds
    },
    {
      id: 2,
      modelName: 'Fraud Detection v1.3',
      status: 'running',
      progress: 45,
      currentEpoch: 9,
      totalEpochs: 20,
      elapsedTime: 2700, // 45 minutes in seconds
      eta: 1800 // 30 minutes in seconds
    },
    {
      id: 3,
      modelName: 'Image Classifier v1.0',
      status: 'queued',
      progress: 0,
      currentEpoch: 0,
      totalEpochs: 50,
      elapsedTime: 0
    }
  ];

  // Mock data for quick start templates
  const templatesData = [
    {
      id: 1,
      name: 'Customer Segmentation',
      description: 'Cluster customers based on behavior patterns',
      type: 'clustering',
      difficulty: 'Beginner',
      estimatedTime: '30 min'
    },
    {
      id: 2,
      name: 'Price Prediction',
      description: 'Predict product prices using regression',
      type: 'regression',
      difficulty: 'Intermediate',
      estimatedTime: '45 min'
    },
    {
      id: 3,
      name: 'Text Classification',
      description: 'Classify documents into categories',
      type: 'nlp',
      difficulty: 'Intermediate',
      estimatedTime: '1 hour'
    },
    {
      id: 4,
      name: 'Object Detection',
      description: 'Detect objects in images using CNN',
      type: 'computer_vision',
      difficulty: 'Advanced',
      estimatedTime: '2 hours'
    }
  ];

  // Filter and sort projects
  const filteredProjects = projectsData?.filter(project => {
    const matchesSearch = project?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         project?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesFilter = filterBy === 'all' || project?.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const sortedProjects = [...filteredProjects]?.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a?.name?.localeCompare(b?.name);
      case 'status':
        return a?.status?.localeCompare(b?.status);
      case 'recent':
      default:
        return new Date(b.lastModified) - new Date(a.lastModified);
    }
  });

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'status', label: 'Status' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'training', label: 'Training' },
    { value: 'deployed', label: 'Deployed' },
    { value: 'completed', label: 'Completed' },
    { value: 'preparing', label: 'Preparing' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="pt-16">
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome back, John! 👋
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Here's what's happening with your ML projects today.
                </p>
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={() => setIsNewProjectModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
                className="self-start lg:self-center px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                New Project
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {metricsData?.map((metric, index) => (
              <MetricsCard key={index} {...metric} />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Projects Section */}
            <div className="xl:col-span-3">
              {/* Projects Header */}
              <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Your Projects</h2>
                    <p className="text-muted-foreground">Manage and monitor your machine learning projects</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="search"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                      className="sm:w-72 h-12 text-base rounded-xl"
                    />
                    <div className="flex gap-3">
                      <Select
                        options={sortOptions}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Sort by"
                        className="w-36 h-12 rounded-xl"
                      />
                      <Select
                        options={filterOptions}
                        value={filterBy}
                        onChange={setFilterBy}
                        placeholder="Filter"
                        className="w-36 h-12 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {sortedProjects?.map((project) => (
                  <ProjectCard key={project?.id} project={project} />
                ))}
              </div>

              {/* Empty State */}
              {sortedProjects?.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Icon name="FolderOpen" size={40} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No projects found</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    {searchQuery || filterBy !== 'all' 
                      ? 'Try adjusting your search or filter criteria to find what you\'re looking for.' 
                      : 'Get started by creating your first machine learning project and unlock the power of AI.'
                    }
                  </p>
                  <Button
                    variant="default"
                    onClick={() => setIsNewProjectModalOpen(true)}
                    iconName="Plus"
                    iconPosition="left"
                    className="px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Create Project
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-8">
              {/* Training Progress */}
              <div className="bg-card border border-border rounded-2xl shadow-sm">
                <TrainingProgress trainingJobs={trainingJobsData} />
              </div>
              
              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-2xl shadow-sm">
                <ActivityFeed activities={activitiesData} />
              </div>
              
              {/* Quick Start Templates */}
              <div className="bg-card border border-border rounded-2xl shadow-sm">
                <QuickStartTemplates templates={templatesData} />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
      {/* AI Assistant FAB */}
      <AIAssistantFAB />
    </div>
  );
};

export default Dashboard;