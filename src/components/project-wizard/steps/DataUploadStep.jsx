import React, { useState, useCallback } from 'react';
import { Upload, File, X, Database, FileText, Image, Music, Video } from 'lucide-react';
import Button from '../../ui/Button';
import Icon from '../../AppIcon';
import KaggleBrowser from '../../dataset/KaggleBrowser';

const DataUploadStep = ({ data, updateData, stepData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const dataTypes = [
    { id: 'image', label: 'Images', icon: 'Camera', desc: 'JPG, PNG, GIF files for computer vision' },
    { id: 'text', label: 'Text', icon: 'FileText', desc: 'CSV, TXT, JSON files for NLP tasks' },
    { id: 'audio', label: 'Audio', icon: 'Music', desc: 'MP3, WAV files for audio processing' },
    { id: 'video', label: 'Video', icon: 'Video', desc: 'MP4, AVI files for video analysis' },
    { id: 'tabular', label: 'Tabular', icon: 'Database', desc: 'CSV, Excel files for structured data' },
    { id: 'mixed', label: 'Mixed', icon: 'Layers', desc: 'Multiple data types combined' }
  ];

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (files) => {
    setUploading(true);
    const newDatasets = [];

    for (const file of files) {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataset = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: getFileType(file),
        file: file,
        uploadedAt: new Date(),
        status: 'ready'
      };
      newDatasets.push(dataset);
    }

    updateData({
      datasets: [...(data.datasets || []), ...newDatasets]
    });
    setUploading(false);
  };

  const getFileType = (file) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.includes('csv') || file.type.includes('excel')) return 'tabular';
    return 'text';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeDataset = (datasetId) => {
    updateData({
      datasets: data.datasets.filter(d => d.id !== datasetId)
    });
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image': return 'Camera';
      case 'audio': return 'Music';
      case 'video': return 'Video';
      case 'tabular': return 'Database';
      default: return 'FileText';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      {/* Data Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-4">
          What type of data are you working with? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataTypes.map((type) => (
            <div
              key={type.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                data.dataType === type.id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => updateData({ dataType: type.id })}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  data.dataType === type.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon name={type.icon} size={18} />
                </div>
                <h4 className="font-medium text-foreground">{type.label}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{type.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* File Upload Area */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-foreground mb-4">
          Upload Your Dataset *
        </label>
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
              {uploading ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={24} className="text-muted-foreground" />
              )}
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {uploading ? 'Uploading...' : 'Upload Dataset Files'}
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your files, or click to browse
            </p>
            <Button
              variant="outline"
              onClick={() => document.getElementById('dataset-upload').click()}
              disabled={uploading}
              iconName="Upload"
              iconPosition="left"
            >
              Choose Files
            </Button>
            <input
              id="dataset-upload"
              type="file"
              multiple
              accept=".csv,.json,.txt,.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4,.avi,.xlsx,.xls"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Supported formats: CSV, JSON, TXT, JPG, PNG, GIF, MP3, WAV, MP4, AVI, Excel files
        </p>
      </div>

      {/* Uploaded Files */}
      {data.datasets && data.datasets.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-foreground mb-4">
            Uploaded Files ({data.datasets.length})
          </h4>
          <div className="space-y-3">
            {data.datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Icon name={getFileIcon(dataset.type)} size={18} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{dataset.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(dataset.size)} • {dataset.type} • {dataset.status}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDataset(dataset.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample Datasets */}
      <div className="p-6 bg-muted/30 rounded-2xl border border-border mb-8">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Download" size={20} className="text-blue-500" />
          Or Try Sample Datasets
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: 'Iris Flower Classification',
              desc: '150 samples with 4 features for multi-class classification',
              type: 'tabular',
              size: '4.5 KB'
            },
            {
              name: 'Movie Reviews Sentiment',
              desc: '25,000 movie reviews for binary sentiment analysis',
              type: 'text',
              size: '66.9 MB'
            },
            {
              name: 'CIFAR-10 Images',
              desc: '60,000 32x32 color images in 10 classes',
              type: 'image',
              size: '163 MB'
            },
            {
              name: 'Stock Price Prediction',
              desc: 'Historical stock prices for time series analysis',
              type: 'tabular',
              size: '2.8 MB'
            }
          ].map((sample, index) => (
            <div
              key={index}
              className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                const sampleDataset = {
                  id: Date.now() + index,
                  name: sample.name,
                  size: sample.size,
                  type: sample.type,
                  isSample: true,
                  uploadedAt: new Date(),
                  status: 'ready'
                };
                updateData({
                  datasets: [...(data.datasets || []), sampleDataset],
                  dataType: data.dataType || sample.type
                });
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-200">
                    <Icon name={getFileIcon(sample.type)} size={18} className="text-primary" />
                  </div>
                  <div>
                    <h5 className="font-medium text-foreground">{sample.name}</h5>
                    <p className="text-sm text-muted-foreground">{sample.desc}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {sample.size}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kaggle Dataset Browser */}
      <div className="p-6 bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl border border-orange-200">
        <KaggleBrowser
          onSelectDataset={(kaggleDataset) => {
            const dataset = {
              id: kaggleDataset.id || Date.now(),
              name: kaggleDataset.name || kaggleDataset.title || kaggleDataset.id,
              size: kaggleDataset.analysis?.totalSamples || 0,
              type: kaggleDataset.taskType === 'image_classification' ? 'image' : 
                    kaggleDataset.taskType === 'sentiment_analysis' ? 'text' : 
                    kaggleDataset.taskType === 'forecasting' ? 'tabular' : 'tabular',
              isKaggleDataset: true,
              kaggleData: kaggleDataset,
              uploadedAt: new Date(),
              status: 'ready'
            };
            updateData({
              datasets: [...(data.datasets || []), dataset],
              dataType: data.dataType || dataset.type
            });
          }}
        />
      </div>
    </div>
  );
};

export default DataUploadStep;
