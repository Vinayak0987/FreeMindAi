import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeploymentCard = ({ deployment, onScale, onUpdate, onStop, onViewLogs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-success bg-success/10 border-success/20';
      case 'deploying':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'stopped':
        return 'text-error bg-error/10 border-error/20';
      case 'scaling':
        return 'text-accent bg-accent/10 border-accent/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'CheckCircle';
      case 'deploying':
        return 'Loader';
      case 'stopped':
        return 'StopCircle';
      case 'scaling':
        return 'TrendingUp';
      default:
        return 'Circle';
    }
  };

  const formatUptime = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 elevation-1 hover:elevation-2 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{deployment?.name}</h3>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deployment?.status)}`}>
              <Icon name={getStatusIcon(deployment?.status)} size={12} />
              <span className="capitalize">{deployment?.status}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{deployment?.description}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Model: {deployment?.modelName}</span>
            <span>•</span>
            <span>Version: {deployment?.version}</span>
            <span>•</span>
            <span>Uptime: {formatUptime(deployment?.startTime)}</span>
          </div>
        </div>
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            onClick={() => setShowActions(!showActions)}
          />
          {showActions && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-md elevation-2 z-10 animate-fade-in">
              <div className="py-1">
                <button
                  onClick={() => {
                    onViewLogs(deployment?.id);
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="FileText" size={16} />
                  <span>View Logs</span>
                </button>
                <button
                  onClick={() => {
                    onUpdate(deployment?.id);
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="RefreshCw" size={16} />
                  <span>Update Model</span>
                </button>
                <button
                  onClick={() => {
                    onStop(deployment?.id);
                    setShowActions(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-error hover:bg-muted transition-colors duration-150"
                >
                  <Icon name="StopCircle" size={16} />
                  <span>Stop Deployment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{deployment?.metrics?.requests}</p>
          <p className="text-xs text-muted-foreground">Requests/min</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{deployment?.metrics?.responseTime}ms</p>
          <p className="text-xs text-muted-foreground">Avg Response</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{deployment?.metrics?.errorRate}%</p>
          <p className="text-xs text-muted-foreground">Error Rate</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{deployment?.instances}</p>
          <p className="text-xs text-muted-foreground">Instances</p>
        </div>
      </div>
      {/* API Endpoint */}
      <div className="bg-muted rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">API Endpoint</p>
            <p className="text-sm font-mono text-foreground break-all">{deployment?.endpoint}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="Copy"
            onClick={() => copyToClipboard(deployment?.endpoint)}
          />
        </div>
      </div>
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="TrendingUp"
            onClick={() => onScale(deployment?.id)}
            disabled={deployment?.status !== 'running'}
          >
            Scale
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="BarChart3"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less' : 'More'} Details
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            deployment?.status === 'running' ? 'bg-success animate-pulse' : 'bg-muted-foreground'
          }`} />
          <span className="text-xs text-muted-foreground">
            Last updated: {new Date(deployment.lastUpdated)?.toLocaleTimeString()}
          </span>
        </div>
      </div>
      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cloud Provider:</span>
                  <span className="text-foreground">{deployment?.cloudProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Region:</span>
                  <span className="text-foreground">{deployment?.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instance Type:</span>
                  <span className="text-foreground">{deployment?.instanceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Auto Scaling:</span>
                  <span className="text-foreground">{deployment?.autoScaling ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {deployment?.recentActivity?.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Icon name={activity?.icon} size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">{activity?.message}</span>
                    <span className="text-xs text-muted-foreground ml-auto">{activity?.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Click outside handler for actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default DeploymentCard;