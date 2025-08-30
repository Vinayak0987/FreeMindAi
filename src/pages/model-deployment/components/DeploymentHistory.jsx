import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DeploymentHistory = ({ onRollback, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVersion, setSelectedVersion] = useState(null);

  const deploymentHistory = [
    {
      id: 'dep-001',
      version: 'v2.1.3',
      modelName: 'Customer Churn Prediction',
      deployedAt: '2025-08-30T08:30:00Z',
      deployedBy: 'John Doe',
      status: 'active',
      performance: {
        accuracy: 94.2,
        latency: 145,
        throughput: 1250
      },
      changes: ['Improved feature engineering', 'Updated hyperparameters', 'Added new training data'],
      rollbackAvailable: false
    },
    {
      id: 'dep-002',
      version: 'v2.1.2',
      modelName: 'Customer Churn Prediction',
      deployedAt: '2025-08-29T14:20:00Z',
      deployedBy: 'Sarah Wilson',
      status: 'rolled_back',
      performance: {
        accuracy: 93.8,
        latency: 152,
        throughput: 1180
      },
      changes: ['Bug fixes in preprocessing', 'Model optimization'],
      rollbackAvailable: true
    },
    {
      id: 'dep-003',
      version: 'v2.1.1',
      modelName: 'Customer Churn Prediction',
      deployedAt: '2025-08-28T10:15:00Z',
      deployedBy: 'Mike Johnson',
      status: 'archived',
      performance: {
        accuracy: 93.1,
        latency: 168,
        throughput: 1050
      },
      changes: ['Initial production deployment', 'Base model configuration'],
      rollbackAvailable: true
    },
    {
      id: 'dep-004',
      version: 'v2.0.5',
      modelName: 'Sales Forecasting',
      deployedAt: '2025-08-27T16:45:00Z',
      deployedBy: 'Emily Chen',
      status: 'active',
      performance: {
        accuracy: 91.7,
        latency: 89,
        throughput: 2100
      },
      changes: ['Seasonal adjustment improvements', 'Data pipeline optimization'],
      rollbackAvailable: false
    },
    {
      id: 'dep-005',
      version: 'v2.0.4',
      modelName: 'Sales Forecasting',
      deployedAt: '2025-08-26T09:30:00Z',
      deployedBy: 'David Brown',
      status: 'archived',
      performance: {
        accuracy: 90.9,
        latency: 95,
        throughput: 1950
      },
      changes: ['Performance optimizations', 'Memory usage improvements'],
      rollbackAvailable: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10 border-success/20';
      case 'rolled_back':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'archived':
        return 'text-muted-foreground bg-muted border-border';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'rolled_back':
        return 'RotateCcw';
      case 'archived':
        return 'Archive';
      default:
        return 'Circle';
    }
  };

  const filteredHistory = deploymentHistory?.filter(deployment =>
    deployment?.modelName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    deployment?.version?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    deployment?.deployedBy?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRollback = (deployment) => {
    setSelectedVersion(deployment);
    onRollback(deployment);
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Deployment History</h2>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
        <Input
          type="search"
          placeholder="Search deployments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="w-full"
        />
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredHistory?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No deployments found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredHistory?.map((deployment) => (
              <div key={deployment?.id} className="p-6 hover:bg-muted/50 transition-colors duration-150">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{deployment?.modelName}</h3>
                      <span className="text-sm font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        {deployment?.version}
                      </span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(deployment?.status)}`}>
                        <Icon name={getStatusIcon(deployment?.status)} size={12} />
                        <span className="capitalize">{deployment?.status?.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <span>Deployed by {deployment?.deployedBy}</span>
                      <span>•</span>
                      <span>{formatDate(deployment?.deployedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewDetails(deployment)}
                    >
                      Details
                    </Button>
                    {deployment?.rollbackAvailable && (
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="RotateCcw"
                        onClick={() => handleRollback(deployment)}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{deployment?.performance?.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{deployment?.performance?.latency}ms</p>
                    <p className="text-xs text-muted-foreground">Latency</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-lg font-bold text-foreground">{deployment?.performance?.throughput}</p>
                    <p className="text-xs text-muted-foreground">Req/min</p>
                  </div>
                </div>

                {/* Changes */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Changes in this version:</h4>
                  <ul className="space-y-1">
                    {deployment?.changes?.map((change, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Icon name="GitCommit" size={12} />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Rollback Confirmation Modal */}
      {selectedVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-popover border border-border rounded-lg w-96 elevation-3">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Icon name="RotateCcw" size={20} className="text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-popover-foreground">Confirm Rollback</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-popover-foreground mb-2">
                  <strong>Model:</strong> {selectedVersion?.modelName}
                </p>
                <p className="text-sm text-popover-foreground mb-2">
                  <strong>Version:</strong> {selectedVersion?.version}
                </p>
                <p className="text-sm text-popover-foreground">
                  <strong>Deployed:</strong> {formatDate(selectedVersion?.deployedAt)}
                </p>
              </div>
              <div className="flex items-center justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedVersion(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="warning"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => {
                    // Handle rollback logic here
                    setSelectedVersion(null);
                  }}
                >
                  Rollback
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentHistory;