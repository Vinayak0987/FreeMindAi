import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const DatasetVisualization = ({ dataset }) => {
  const [selectedChart, setSelectedChart] = useState('distribution');
  const [selectedColumn, setSelectedColumn] = useState('category');

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Icon name="BarChart3" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a dataset to view visualizations</p>
        </div>
      </div>
    );
  }

  // Mock visualization data
  const distributionData = [
    { name: 'Electronics', value: 45, count: 4500 },
    { name: 'Clothing', value: 30, count: 3000 },
    { name: 'Home', value: 15, count: 1500 },
    { name: 'Sports', value: 10, count: 1000 }
  ];

  const ageDistributionData = [
    { age: '18-25', count: 1200, percentage: 24 },
    { age: '26-35', count: 1800, percentage: 36 },
    { age: '36-45', count: 1300, percentage: 26 },
    { age: '46-55', count: 500, percentage: 10 },
    { age: '55+', count: 200, percentage: 4 }
  ];

  const timeSeriesData = [
    { month: 'Jan', sales: 4000, customers: 240 },
    { month: 'Feb', sales: 3000, customers: 198 },
    { month: 'Mar', sales: 5000, customers: 300 },
    { month: 'Apr', sales: 4500, customers: 278 },
    { month: 'May', sales: 6000, customers: 389 },
    { month: 'Jun', sales: 5500, customers: 349 }
  ];

  const correlationData = [
    { income: 30000, purchase: 150 },
    { income: 45000, purchase: 280 },
    { income: 60000, purchase: 420 },
    { income: 75000, purchase: 580 },
    { income: 90000, purchase: 750 },
    { income: 105000, purchase: 920 }
  ];

  const chartOptions = [
    { value: 'distribution', label: 'Category Distribution' },
    { value: 'age', label: 'Age Distribution' },
    { value: 'timeseries', label: 'Time Series' },
    { value: 'correlation', label: 'Correlation Plot' }
  ];

  const columnOptions = [
    { value: 'category', label: 'Category' },
    { value: 'age', label: 'Age' },
    { value: 'income', label: 'Income' },
    { value: 'satisfaction', label: 'Satisfaction' }
  ];

  const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  const renderChart = () => {
    switch (selectedChart) {
      case 'distribution':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
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
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pie Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Category Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {distributionData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'age':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Age Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={ageDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="age" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case 'timeseries':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Sales Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
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
                  dataKey="sales" 
                  stroke="var(--color-primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  stroke="var(--color-success)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'correlation':
        return (
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Income vs Purchase Amount</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart data={correlationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="income" 
                  stroke="var(--color-muted-foreground)"
                  tickFormatter={(value) => `${value?.toLocaleString()}`}
                />
                <YAxis 
                  dataKey="purchase" 
                  stroke="var(--color-muted-foreground)"
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)', 
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'income' ? `${value?.toLocaleString()}` : `${value}`,
                    name === 'income' ? 'Income' : 'Purchase Amount'
                  ]}
                />
                <Scatter dataKey="purchase" fill="var(--color-warning)" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  const insights = [
    {
      icon: 'TrendingUp',
      title: 'Strong Correlation',
      description: 'Income and purchase amount show 0.87 correlation coefficient',
      color: 'text-success'
    },
    {
      icon: 'Users',
      title: 'Target Demographic',
      description: '62% of customers are in the 26-45 age range',
      color: 'text-primary'
    },
    {
      icon: 'ShoppingCart',
      title: 'Category Leader',
      description: 'Electronics category dominates with 45% market share',
      color: 'text-accent'
    },
    {
      icon: 'Calendar',
      title: 'Seasonal Pattern',
      description: 'Peak sales observed in May with 6K transactions',
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Select
            options={chartOptions}
            value={selectedChart}
            onChange={setSelectedChart}
            placeholder="Select chart type"
            className="w-48"
          />
          <Select
            options={columnOptions}
            value={selectedColumn}
            onChange={setSelectedColumn}
            placeholder="Select column"
            className="w-48"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" iconName="Download">
            Export Chart
          </Button>
          <Button variant="outline" iconName="Settings">
            Customize
          </Button>
        </div>
      </div>
      {/* Chart Area */}
      <div className="min-h-[400px]">
        {renderChart()}
      </div>
      {/* Insights */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights?.map((insight, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Icon name={insight?.icon} size={20} className={insight?.color} />
                <h4 className="font-medium text-foreground">{insight?.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{insight?.description}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Statistical Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Mean Value</p>
              <p className="text-2xl font-bold text-foreground">$487.50</p>
            </div>
            <Icon name="BarChart3" size={24} className="text-primary" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Standard Deviation</p>
              <p className="text-2xl font-bold text-foreground">$156.23</p>
            </div>
            <Icon name="Activity" size={24} className="text-accent" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Median Value</p>
              <p className="text-2xl font-bold text-foreground">$425.00</p>
            </div>
            <Icon name="Target" size={24} className="text-success" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetVisualization;