import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const APIDocumentationViewer = ({ selectedDeployment }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [testRequest, setTestRequest] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTestingAPI, setIsTestingAPI] = useState(false);

  const languages = [
    { value: 'curl', label: 'cURL' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'php', label: 'PHP' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'FileText' },
    { id: 'endpoints', label: 'Endpoints', icon: 'Link' },
    { id: 'examples', label: 'Examples', icon: 'Code' },
    { id: 'testing', label: 'API Testing', icon: 'Play' }
  ];

  const mockEndpoints = [
    {
      method: 'POST',
      path: '/predict',
      description: 'Make predictions using the deployed model',
      parameters: [
        { name: 'data', type: 'array', required: true, description: 'Input data for prediction' },
        { name: 'format', type: 'string', required: false, description: 'Response format (json, csv)' }
      ],
      responses: {
        200: 'Successful prediction',
        400: 'Invalid input data',
        401: 'Unauthorized access',
        500: 'Internal server error'
      }
    },
    {
      method: 'GET',
      path: '/health',
      description: 'Check model health and status',
      parameters: [],
      responses: {
        200: 'Model is healthy',
        503: 'Model is unavailable'
      }
    },
    {
      method: 'GET',
      path: '/metrics',
      description: 'Get model performance metrics',
      parameters: [
        { name: 'timeframe', type: 'string', required: false, description: 'Time range for metrics (1h, 24h, 7d)' }
      ],
      responses: {
        200: 'Metrics retrieved successfully',
        401: 'Unauthorized access'
      }
    }
  ];

  const getCodeExample = (language, endpoint) => {
    const baseUrl = selectedDeployment?.endpoint || 'https://api.freemind.ai/v1/models/your-model';
    
    switch (language) {
      case 'curl':
        if (endpoint?.method === 'POST') {
          return `curl -X POST "${baseUrl}${endpoint?.path}" \\
  -H "Content-Type: application/json"\ -H"Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "data": [
      [1.2, 3.4, 5.6, 7.8],
      [2.1, 4.3, 6.5, 8.7]
    ]
  }'`;
        } else {
          return `curl -X ${endpoint?.method} "${baseUrl}${endpoint?.path}" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;
        }
      
      case 'python':
        return `import requests
import json

url = "${baseUrl}${endpoint?.path}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}

${endpoint?.method === 'POST' ? `data = {
    "data": [
        [1.2, 3.4, 5.6, 7.8],
        [2.1, 4.3, 6.5, 8.7]
    ]
}

response = requests.post(url, headers=headers, json=data)` : `response = requests.get(url, headers=headers)`}
print(response.json())`;

      case 'javascript':
        return `const response = await fetch('${baseUrl}${endpoint?.path}', {
  method: '${endpoint?.method}',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  }${endpoint?.method === 'POST' ? `,
  body: JSON.stringify({
    data: [
      [1.2, 3.4, 5.6, 7.8],
      [2.1, 4.3, 6.5, 8.7]
    ]
  })` : ''}
});

const result = await response.json();
console.log(result);`;

      default:
        return 'Code example not available for this language.';
    }
  };

  const handleTestAPI = async () => {
    setIsTestingAPI(true);
    
    // Simulate API call
    setTimeout(() => {
      setTestResponse(`{
  "predictions": [0.85, 0.23],
  "confidence": [0.92, 0.78],
  "model_version": "v2.1.3",
  "processing_time": 145,
  "timestamp": "${new Date()?.toISOString()}"
}`);
      setIsTestingAPI(false);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">API Overview</h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base URL:</span>
                  <span className="font-mono text-sm">{selectedDeployment?.endpoint || 'https://api.freemind.ai/v1/models/your-model'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Authentication:</span>
                  <span>Bearer Token</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content Type:</span>
                  <span>application/json</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate Limit:</span>
                  <span>1000 requests/hour</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-foreground mb-3">Authentication</h4>
              <p className="text-sm text-muted-foreground mb-4">
                All API requests require authentication using a Bearer token in the Authorization header.
              </p>
              <div className="bg-card border border-border rounded-lg p-4">
                <code className="text-sm font-mono">Authorization: Bearer YOUR_API_KEY</code>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-foreground mb-3">Response Format</h4>
              <p className="text-sm text-muted-foreground mb-4">
                All responses are returned in JSON format with consistent structure.
              </p>
              <div className="bg-card border border-border rounded-lg p-4">
                <pre className="text-sm font-mono text-foreground">{`{
  "success": true,
  "data": { ... },
  "message": "Request processed successfully",
  "timestamp": "2025-08-30T09:44:19.645Z"
}`}</pre>
              </div>
            </div>
          </div>
        );

      case 'endpoints':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Available Endpoints</h3>
            {mockEndpoints?.map((endpoint, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    endpoint?.method === 'GET' ? 'bg-success/10 text-success' :
                    endpoint?.method === 'POST'? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                  }`}>
                    {endpoint?.method}
                  </span>
                  <span className="font-mono text-sm">{endpoint?.path}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{endpoint?.description}</p>
                
                {endpoint?.parameters?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-foreground mb-2">Parameters</h5>
                    <div className="space-y-2">
                      {endpoint?.parameters?.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-center space-x-4 text-sm">
                          <span className="font-mono bg-muted px-2 py-1 rounded">{param?.name}</span>
                          <span className="text-muted-foreground">{param?.type}</span>
                          <span className={param?.required ? 'text-error' : 'text-muted-foreground'}>
                            {param?.required ? 'Required' : 'Optional'}
                          </span>
                          <span className="text-muted-foreground">{param?.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-2">Response Codes</h5>
                  <div className="space-y-1">
                    {Object.entries(endpoint?.responses)?.map(([code, description]) => (
                      <div key={code} className="flex items-center space-x-4 text-sm">
                        <span className={`font-mono px-2 py-1 rounded ${
                          code?.startsWith('2') ? 'bg-success/10 text-success' :
                          code?.startsWith('4') ? 'bg-warning/10 text-warning' :
                          'bg-error/10 text-error'
                        }`}>
                          {code}
                        </span>
                        <span className="text-muted-foreground">{description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Code Examples</h3>
              <Select
                options={languages}
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                className="w-40"
              />
            </div>
            {mockEndpoints?.map((endpoint, index) => (
              <div key={index} className="bg-card border border-border rounded-lg">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint?.method === 'GET' ? 'bg-success/10 text-success' :
                      endpoint?.method === 'POST'? 'bg-primary/10 text-primary' : 'bg-warning/10 text-warning'
                    }`}>
                      {endpoint?.method}
                    </span>
                    <span className="font-mono text-sm">{endpoint?.path}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    onClick={() => copyToClipboard(getCodeExample(selectedLanguage, endpoint))}
                  />
                </div>
                <div className="p-4">
                  <pre className="text-sm font-mono text-foreground overflow-x-auto">
                    {getCodeExample(selectedLanguage, endpoint)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        );

      case 'testing':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">API Testing</h3>
            <div className="bg-card border border-border rounded-lg p-6">
              <h4 className="text-md font-semibold text-foreground mb-4">Test Prediction Endpoint</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Request Body (JSON)</label>
                  <textarea
                    className="w-full h-32 p-3 border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    value={testRequest}
                    onChange={(e) => setTestRequest(e?.target?.value)}
                    placeholder={`{
  "data": [
    [1.2, 3.4, 5.6, 7.8],
    [2.1, 4.3, 6.5, 8.7]
  ]
}`}
                  />
                </div>
                
                <Button
                  onClick={handleTestAPI}
                  loading={isTestingAPI}
                  iconName="Play"
                  iconPosition="left"
                  disabled={!selectedDeployment}
                >
                  {isTestingAPI ? 'Testing...' : 'Test API'}
                </Button>
              </div>
            </div>
            {testResponse && (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-foreground">Response</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    onClick={() => copyToClipboard(testResponse)}
                  />
                </div>
                <pre className="text-sm font-mono text-foreground bg-muted p-4 rounded-lg overflow-x-auto">
                  {testResponse}
                </pre>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg elevation-1">
      <div className="border-b border-border">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold text-foreground">API Documentation</h2>
          <div className="flex items-center space-x-2">
            <Icon name="Book" size={20} className="text-primary" />
            <span className="text-sm text-muted-foreground">
              {selectedDeployment ? selectedDeployment?.name : 'Select a deployment'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 px-6">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors duration-150 ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 max-h-96 overflow-y-auto">
        {selectedDeployment ? (
          renderTabContent()
        ) : (
          <div className="text-center py-12">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Select a deployment to view API documentation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIDocumentationViewer;