import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ProjectOverview = ({ project }) => {
  const navigate = useNavigate();

  const performanceData = [
    { name: 'Week 1', accuracy: 0.65, loss: 0.45 },
    { name: 'Week 2', accuracy: 0.72, loss: 0.38 },
    { name: 'Week 3', accuracy: 0.78, loss: 0.32 },
    { name: 'Week 4', accuracy: 0.85, loss: 0.25 },
    { name: 'Week 5', accuracy: 0.89, loss: 0.18 }
  ];

  const dataDistribution = [
    { name: 'Training', value: 70, color: '#2563EB' },
    { name: 'Validation', value: 20, color: '#06B6D4' },
    { name: 'Testing', value: 10, color: '#10B981' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'dataset',
      action: 'uploaded',
      item: 'customer_data_v2.csv',
      timestamp: '2 hours ago',
      icon: 'Upload',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'model',
      action: 'training completed',
      item: 'Random Forest Classifier',
      timestamp: '4 hours ago',
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 3,
      type: 'experiment',
      action: 'created',
      item: 'Hyperparameter Tuning #3',
      timestamp: '6 hours ago',
      icon: 'FlaskConical',
      color: 'text-accent'
    },
    {
      id: 4,
      type: 'deployment',
      action: 'deployed',
      item: 'Model v1.2.0',
      timestamp: '1 day ago',
      icon: 'Rocket',
      color: 'text-primary'
    }
  ];

  const quickStats = [
    {
      label: 'Model Accuracy',
      value: '89.2%',
      change: '+2.1%',
      trend: 'up',
      icon: 'Target',
      color: 'text-success'
    },
    {
      label: 'Training Time',
      value: '2.4h',
      change: '-15min',
      trend: 'down',
      icon: 'Clock',
      color: 'text-accent'
    },
    {
      label: 'Data Points',
      value: '125K',
      change: '+5K',
      trend: 'up',
      icon: 'Database',
      color: 'text-primary'
    },
    {
      label: 'API Calls',
      value: '1,247',
      change: '+89',
      trend: 'up',
      icon: 'Activity',
      color: 'text-warning'
    }
  ];

  return (
    <div className="p-4 space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats?.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-5 elevation-1">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center ${stat?.color}`}>
                <Icon name={stat?.icon} size={18} />
              </div>
              <div className={`flex items-center space-x-1 text-sm ${
                stat?.trend === 'up' ? 'text-success' : 'text-error'
              }`}>
                <Icon name={stat?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
                <span className="text-xs">{stat?.change}</span>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Performance Chart */}
        <div className="bg-card border border-border rounded-lg p-5 elevation-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Model Performance</h3>
            <Button variant="ghost" iconName="MoreHorizontal" size="sm" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2}
                  name="Accuracy"
                />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="var(--color-error)" 
                  strokeWidth={2}
                  name="Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Distribution */}
        <div className="bg-card border border-border rounded-lg p-5 elevation-1">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-foreground">Data Distribution</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {dataDistribution?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name} ({item?.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5 elevation-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
            <Button variant="ghost" iconName="ExternalLink" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivities?.map((activity) => (
              <div key={activity?.id} className="flex items-center space-x-4 p-3 hover:bg-muted rounded-lg transition-colors duration-150">
                <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center ${activity?.color}`}>
                  <Icon name={activity?.icon} size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    <span className="font-medium capitalize">{activity?.type}</span> {activity?.action}
                  </p>
                  <p className="text-sm text-muted-foreground">{activity?.item}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity?.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-5 elevation-1">
          <h3 className="text-base font-semibold text-foreground mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              iconName="Upload"
              iconPosition="left"
              onClick={() => navigate('/dataset-management')}
            >
              Upload Dataset
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Play"
              iconPosition="left"
              onClick={() => navigate('/model-training')}
            >
              Start Training
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="Rocket"
              iconPosition="left"
              onClick={() => navigate('/model-deployment')}
            >
              Deploy Model
            </Button>
            <Button
              variant="outline"
              fullWidth
              iconName="MessageSquare"
              iconPosition="left"
              onClick={() => navigate('/ai-assistant-chat')}
            >
              Ask AI Assistant
            </Button>
          </div>

          {/* AI Suggestions */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Sparkles" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">AI Suggestion</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Your model accuracy has plateaued. Consider feature engineering or trying ensemble methods.
            </p>
            <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;