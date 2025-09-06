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
import AIAssistantFAB from '../../components/AIAssistantFAB';

// Import API hooks
import { useProjects, useActivities, useTrainingJobs, useTemplates, useProjectMetrics } from '../../hooks/useApi';
import apiService from '../../utils/api';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();

  // API data hooks
  const { data: projectsData, loading: projectsLoading, error: projectsError, refetch: refetchProjects } = useProjects({
    search: searchQuery,
    sort: sortBy,
    filter: filterBy,
    limit: 20
  });
  
  const { data: metricsData, loading: metricsLoading } = useProjectMetrics();
  const { data: activitiesData, loading: activitiesLoading } = useActivities();
  const { data: trainingJobsData, loading: trainingLoading } = useTrainingJobs();
  const { data: templatesData, loading: templatesLoading } = useTemplates();

  // Transform metrics data for display
  const displayMetrics = metricsData?.metrics ? [
    {
      title: 'Active Projects',
      value: metricsData.metrics.totalProjects?.toString() || '0',
      change: '+' + (metricsData.metrics.totalProjects - (metricsData.metrics.totalProjects - metricsData.metrics.trainingProjects))?.toString() || '0',
      changeType: 'positive',
      icon: 'FolderOpen',
      color: 'primary'
    },
    {
      title: 'Models Deployed',
      value: metricsData.metrics.deployedProjects?.toString() || '0',
      change: '+' + metricsData.metrics.deployedProjects?.toString() || '0',
      changeType: 'positive',
      icon: 'Rocket',
      color: 'success'
    },
    {
      title: 'Training Jobs',
      value: metricsData.metrics.trainingProjects?.toString() || '0',
      change: '0',
      changeType: 'neutral',
      icon: 'Brain',
      color: 'warning'
    },
    {
      title: 'Completed',
      value: metricsData.metrics.completedProjects?.toString() || '0',
      change: '+' + metricsData.metrics.completedProjects?.toString() || '0',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'accent'
    }
  ] : [];


  // Refetch data when filters change
  useEffect(() => {
    if (searchQuery || sortBy !== 'recent' || filterBy !== 'all') {
      refetchProjects();
    }
  }, [searchQuery, sortBy, filterBy]); // Removed refetchProjects from deps to prevent loop


  // Get projects from API data
  const projects = projectsData?.data?.projects || [];
  const activities = activitiesData?.data?.activities || [];
  const trainingJobs = trainingJobsData?.data?.trainingJobs || [];
  const templates = templatesData?.data?.templates || [];

  // Projects are already filtered and sorted by the API based on our parameters
  const sortedProjects = projects;

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
                <h1 className="text-4xl font-bold text-foreground mb-3">
                  Welcome back, Alok! 🙏✨
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Here's what's happening with your ML projects today. Let's build the future of AI! 🚀
                </p>
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate('/projects/new')}
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
            {metricsLoading ? (
              // Loading skeleton for metrics
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              displayMetrics?.map((metric, index) => (
                <MetricsCard key={index} {...metric} />
              ))
            )}
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
                {projectsLoading ? (
                  // Loading skeleton for projects
                  Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                      <div className="h-40 bg-gray-300 rounded-xl mb-4"></div>
                      <div className="h-6 bg-gray-300 rounded mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                      </div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  ))
                ) : projectsError ? (
                  <div className="col-span-full text-center py-8">
                    <Icon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Projects</h3>
                    <p className="text-muted-foreground mb-4">{projectsError}</p>
                    <Button onClick={() => refetchProjects()} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  sortedProjects?.map((project) => (
                    <ProjectCard key={project?._id || project?.id} project={project} onUpdate={refetchProjects} />
                  ))
                )}
              </div>

              {/* Empty State */}
              {!projectsLoading && sortedProjects?.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Icon name="FolderOpen" size={40} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {!localStorage.getItem('token') ? 'Welcome to FreeMind AI!' : 'No projects found'}
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
                    {!localStorage.getItem('token') 
                      ? 'Please log in to view and manage your AI/ML projects. Experience the power of dynamic project management with real-time data.'
                      : searchQuery || filterBy !== 'all' 
                        ? 'Try adjusting your search or filter criteria to find what you\'re looking for.' 
                        : 'Get started by creating your first machine learning project and unlock the power of AI.'
                    }
                  </p>
                  {!localStorage.getItem('token') ? (
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="default"
                        onClick={() => navigate('/login')}
                        iconName="LogIn"
                        iconPosition="left"
                        className="px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Login
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/signup')}
                        iconName="UserPlus"
                        iconPosition="left"
                        className="px-8 py-4 text-base font-semibold rounded-xl"
                      >
                        Sign Up
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => navigate('/projects/new')}
                      iconName="Plus"
                      iconPosition="left"
                      className="px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Create Project
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-8">
              {/* Training Progress */}
              <div className="bg-card border border-border rounded-2xl shadow-sm">
                <TrainingProgress 
                  trainingJobs={trainingJobs} 
                  loading={trainingLoading} 
                />
              </div>
              
              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-2xl shadow-sm">
                <ActivityFeed 
                  activities={activities} 
                  loading={activitiesLoading} 
                />
              </div>
              
              {/* Quick Start Templates */}
              <div className="bg-card border border-border rounded-2xl shadow-sm">
                <QuickStartTemplates 
                  templates={templates} 
                  loading={templatesLoading} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* AI Assistant FAB */}
      <AIAssistantFAB />
    </div>
  );
};

export default Dashboard;