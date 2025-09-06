import React, { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Icon from '../../AppIcon';

const ProjectBasicsStep = ({ data, updateData, stepData }) => {
  const [dragActive, setDragActive] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field, value) => {
    updateData({ [field]: value });
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateData({ thumbnail: { file, preview: e.target.result } });
      };
      reader.readAsDataURL(file);
    }
  };

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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      updateData({ tags: [...data.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    updateData({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Icon name={stepData.icon} size={24} color="white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{stepData.title}</h3>
            <p className="text-muted-foreground">{stepData.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Project Name *
            </label>
            <Input
              type="text"
              value={data.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your project name..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              value={data.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your AI/ML project idea, goals, and expected outcomes..."
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags (e.g., Computer Vision, NLP...)"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim()}
                iconName="Plus"
                size="sm"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="w-4 h-4 rounded-full hover:bg-primary/20 flex items-center justify-center"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Thumbnail
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
            {data.thumbnail ? (
              <div className="relative">
                <img
                  src={data.thumbnail.preview}
                  alt="Project thumbnail"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <button
                  onClick={() => updateData({ thumbnail: null })}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
                  <Upload size={24} className="text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">
                  Upload Thumbnail
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop an image, or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('thumbnail-upload').click()}
                  iconName="Upload"
                  iconPosition="left"
                >
                  Choose File
                </Button>
                <input
                  id="thumbnail-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Recommended: 400x300px or higher, JPG/PNG format
          </p>
        </div>
      </div>

      {/* Project Ideas Section */}
      <div className="mt-12 p-6 bg-muted/30 rounded-2xl border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Lightbulb" size={20} className="text-yellow-500" />
          Need Inspiration? Popular AI/ML Project Ideas
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Image Classification', desc: 'Classify images into categories', icon: 'Camera' },
            { title: 'Sentiment Analysis', desc: 'Analyze text sentiment', icon: 'MessageSquare' },
            { title: 'Recommendation System', desc: 'Recommend products or content', icon: 'Star' },
            { title: 'Time Series Forecasting', desc: 'Predict future values', icon: 'TrendingUp' },
            { title: 'Object Detection', desc: 'Detect objects in images', icon: 'Eye' },
            { title: 'Chatbot Development', desc: 'Build conversational AI', icon: 'Bot' }
          ].map((idea, index) => (
            <div
              key={index}
              className="p-4 bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-200 cursor-pointer group"
              onClick={() => {
                updateData({
                  name: data.name || idea.title,
                  description: data.description || `${idea.desc} using machine learning techniques.`
                });
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-200">
                  <Icon name={idea.icon} size={18} className="text-primary" />
                </div>
                <div>
                  <h5 className="font-medium text-foreground">{idea.title}</h5>
                  <p className="text-sm text-muted-foreground">{idea.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectBasicsStep;
