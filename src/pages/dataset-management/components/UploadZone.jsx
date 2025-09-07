import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadZone = ({ onUpload, isVisible, onClose }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const supportedFormats = [
    { type: 'CSV', extensions: '.csv', icon: 'FileSpreadsheet', description: 'Comma-separated values' },
    { type: 'Excel', extensions: '.xlsx, .xls', icon: 'FileSpreadsheet', description: 'Excel spreadsheets' },
    { type: 'JSON', extensions: '.json', icon: 'FileText', description: 'JavaScript Object Notation' },
    { type: 'Images', extensions: '.jpg, .png, .gif', icon: 'Image', description: 'Image files for computer vision' },
    { type: 'Text', extensions: '.txt, .md', icon: 'FileText', description: 'Plain text files' }
  ];

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files?.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Add files to uploaded list with actual File objects
          const newFiles = files?.map(file => ({
            id: Date.now() + Math.random(),
            name: file?.name,
            size: file?.size,
            type: file?.type,
            uploadDate: new Date()?.toISOString(),
            status: 'completed',
            file: file // Preserve the actual File object for processing
          }));
          
          setUploadedFiles(prev => [...prev, ...newFiles]);
          
          // Call parent callback with actual files
          if (onUpload) {
            onUpload(newFiles);
          }
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'csv': case'xlsx': case'xls':
        return 'FileSpreadsheet';
      case 'jpg': case'jpeg': case'png': case'gif':
        return 'Image';
      case 'txt': case'md':
        return 'FileText';
      case 'json':
        return 'FileCode';
      default:
        return 'File';
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev?.filter(file => file?.id !== fileId));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden elevation-3">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Upload Dataset</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your data files to start building ML models
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Icon name="Upload" size={32} className="text-primary" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
                </h3>
                <p className="text-muted-foreground mt-1">
                  or click to browse your computer
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => fileInputRef?.current?.click()}
                iconName="FolderOpen"
              >
                Browse Files
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".csv,.xlsx,.xls,.json,.jpg,.jpeg,.png,.gif,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Uploading files...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Uploaded Files</h3>
              {uploadedFiles?.map((file) => (
                <div key={file?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name={getFileIcon(file?.name)} size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file?.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file?.id)}
                      iconName="X"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Supported Formats */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Supported Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {supportedFormats?.map((format) => (
                <div key={format?.type} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Icon name={format?.icon} size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{format?.type}</p>
                    <p className="text-xs text-muted-foreground">{format?.extensions}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-foreground mb-2">Upload Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Maximum file size: 100MB per file</li>
                  <li>• For CSV files, ensure proper column headers</li>
                  <li>• Image datasets should be organized in folders by class</li>
                  <li>• Text files should be UTF-8 encoded</li>
                  <li>• Multiple files will be processed as a batch</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            {uploadedFiles?.length > 0 && `${uploadedFiles?.length} file(s) ready for processing`}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="default" 
              disabled={uploadedFiles?.length === 0}
              iconName="ArrowRight"
            >
              Continue to Processing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;