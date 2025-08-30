import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DeploymentStatusDashboard = ({ deployments }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedMetric, setSelectedMetric] = useState('requests');
  const [realTimeData, setRealTimeData] = useState([]);

  const timeRanges = [
    { value: '1h', label: 'Last Hour' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const metrics = [
    { value: 'requests', label: 'Request Volume', icon: 'Activity' },
    { value: 'response_time', label: 'Response Time', icon: 'Clock' },
    { value: 'error_rate', label: 'Error Rate', icon: 'AlertTriangle' },
    { value: 'cpu_usage', label: 'CPU Usage', icon: 'Cpu' }
  ];

  // Mock real-time data generation
  useEffect(() => {
    const generateRealTimeData = () => {
      const now = new Date();
      const data = [];
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data?.push({
          time: time?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          requests: Math.floor(Math.random() * 1000) + 500,
          response_time: Math.floor(Math.random() * 200) + 50,
          error_rate: Math.random() * 5,
          cpu_usage: Math.random() * 80 + 20,
          memory_usage: Math.random() * 70 + 30
        });
      }
      return data;
    };

    setRealTimeData(generateRealTimeData());
    
    const interval = setInterval(() => {
      setRealTimeData(generateRealTimeData());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const statusDistribution = [
    { name: 'Healthy', value: 85, color: '#10B981' },
    { name: 'Warning', value: 12, color: '#F59E0B' },
    { name: 'Critical', value: 3, color: '#EF4444' }
  ];

  const getMetricValue = (data, metric) => {
    if (!data || data?.length === 0) return 0;
    const latest = data?.[data?.length - 1];
    return latest?.[metric] || 0;
  };

  const getMetricTrend = (data, metric) => {
    if (!data || data?.length < 2) return 0;
    const current = data?.[data?.length - 1]?.[metric] || 0;
    const previous = data?.[data?.length - 2]?.[metric] || 0;
    return ((current - previous) / previous * 100)?.toFixed(1);
  };

  const formatMetricValue = (value, metric) => {
    switch (metric) {
      case 'requests':
        return Math.round(value)?.toLocaleString();
      case 'response_time':
        return `${Math.round(value)}ms`;
      case 'error_rate':
        return `${value?.toFixed(2)}%`;
      case 'cpu_usage':
        return `${Math.round(value)}%`;
      default:
        return Math.round(value);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Deployment Monitoring</h2>
        <div className="flex items-center space-x-4">
          <Select
            options={timeRanges}
            value={selectedTimeRange}
            onChange={setSelectedTimeRange}
            className="w-40"
          />
          <Button variant="outline" iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>
      </div>
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.map((metric) => {
          const value = getMetricValue(realTimeData, metric?.value);
          const trend = getMetricTrend(realTimeData, metric?.value);
          const isPositive = trend > 0;
          
          return (
            <div key={metric?.value} className="bg-card border border-border rounded-lg p-6 elevation-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={metric?.icon} size={16} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{metric?.label}</span>
                </div>
                <div className={`flex items-center space-x-1 text-xs ${
                  metric?.value === 'error_rate' ? (isPositive ?'text-error' : 'text-success')
                    : (isPositive ? 'text-success' : 'text-error')
                }`}>
                  <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  <span>{Math.abs(trend)}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">
                  {formatMetricValue(value, metric?.value)}
                </p>
                <p className="text-xs text-muted-foreground">
                  vs previous period
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* Main Chart */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
          <Select
            options={metrics}
            value={selectedMetric}
            onChange={setSelectedMetric}
            className="w-48"
          />
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6">Deployment Health</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {statusDistribution?.map((item) => (
              <div key={item?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">{item?.name}</span>
                <span className="text-sm font-medium text-foreground">{item?.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Usage */}
        <div className="bg-card border border-border rounded-lg p-6 elevation-1">
          <h3 className="text-lg font-semibold text-foreground mb-6">Resource Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={realTimeData?.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="cpu_usage" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="memory_usage" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">CPU Usage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Memory Usage</span>
            </div>
          </div>
        </div>
      </div>
      {/* Real-time Alerts */}
      <div className="bg-card border border-border rounded-lg p-6 elevation-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
          <Button variant="ghost" size="sm" iconName="Settings">
            Configure
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">High Response Time</p>
              <p className="text-xs text-muted-foreground">Customer Churn Model - Average response time exceeded 500ms</p>
            </div>
            <span className="text-xs text-muted-foreground">2 min ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Auto-scaling Triggered</p>
              <p className="text-xs text-muted-foreground">Sales Forecasting Model - Scaled up to 3 instances</p>
            </div>
            <span className="text-xs text-muted-foreground">5 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStatusDashboard;