import React, { useState } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import apiService from '../utils/api';

const DownloadButton = ({ 
  projectId, 
  trainingJobId, 
  type = 'trained_model', // 'trained_model', 'preprocessed_data', or 'complete_project'
  variant = 'default',
  size = 'sm',
  disabled = false,
  className = '',
  children 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const getDownloadConfig = () => {
    const configs = {
      trained_model: {
        endpoint: '/projects/download/model',
        filename: 'trained_model.zip',
        icon: 'Download',
        label: 'Download Model'
      },
      preprocessed_data: {
        endpoint: '/projects/download/data',
        filename: 'preprocessed_data.zip',
        icon: 'Database',
        label: 'Download Data'
      },
      complete_project: {
        endpoint: '/projects/download/complete',
        filename: 'complete_project.zip',
        icon: 'Package',
        label: 'Download Project'
      }
    };
    return configs[type] || configs.trained_model;
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const config = getDownloadConfig();
      
      // Prepare the request payload
      const payload = {
        projectId,
        type
      };

      if (trainingJobId) {
        payload.trainingJobId = trainingJobId;
      }

      // Make the download request
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}${config.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get the filename from response headers or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = config.filename;
      
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message (you can customize this)
      console.log(`Downloaded: ${filename}`);
      
    } catch (error) {
      console.error('Download error:', error);
      // You can add toast notification here
      alert(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const config = getDownloadConfig();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      loading={isDownloading}
      disabled={disabled || isDownloading}
      iconName={config.icon}
      iconPosition="left"
      className={className}
    >
      {children || config.label}
    </Button>
  );
};

export default DownloadButton;
