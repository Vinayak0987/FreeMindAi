import React, { useState, useEffect } from 'react';
import { Search, Download, Star, Users, Calendar, ExternalLink, Sparkles, Filter } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';
import { KaggleBrowserIntegration } from './KaggleBrowserIntegration';

const KaggleBrowser = ({ onSelectDataset, isVisible = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [filters, setFilters] = useState({
    taskType: 'all',
    size: 'all',
    popularity: 'all'
  });

  const taskTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'classification', label: 'Classification' },
    { value: 'regression', label: 'Regression' },
    { value: 'image_classification', label: 'Computer Vision' },
    { value: 'sentiment_analysis', label: 'NLP/Text' },
    { value: 'recommendation', label: 'Recommendation' },
    { value: 'forecasting', label: 'Time Series' }
  ];

  const popularQueries = [
    'titanic', 'house prices', 'iris', 'mnist', 'sentiment analysis', 
    'stock prediction', 'image classification', 'covid-19'
  ];

  // Search Kaggle datasets
  const searchDatasets = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`/api/kaggle/search?q=${encodeURIComponent(query)}&size=10`);
      const data = await response.json();
      
      if (data.success) {
        // Handle different API response structures
        const datasets = data.data || [];
        setSearchResults(Array.isArray(datasets) ? datasets : []);
      } else {
        console.error('Search failed:', data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-fetch dataset using AI
  const autoFetchDataset = async (topic) => {
    setIsImporting(true);
    try {
      const result = await KaggleBrowserIntegration.autoProcessKaggleDataset(
        topic, 
        filters.size !== 'all' ? filters.size : 'medium'
      );
      
      if (result.success) {
        onSelectDataset && onSelectDataset(result.dataset);
        setSelectedDataset(result.dataset);
        
        // Check if this is real data processing
        const isRealData = KaggleBrowserIntegration.isRealDataProcessing(result.dataset.analysis);
        if (!isRealData) {
          console.warn('⚠️ Kaggle dataset processing returned mock data. This means either Kaggle API is not configured or the dataset processing failed.');
        }
      } else {
        console.error('Auto-fetch failed:', result.error);
      }
    } catch (error) {
      console.error('Auto-fetch error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  // Import specific dataset
  const importDataset = async (datasetId) => {
    setIsImporting(true);
    try {
      const result = await KaggleBrowserIntegration.processKaggleDataset(datasetId);
      
      if (result.success) {
        onSelectDataset && onSelectDataset(result.dataset);
        setSelectedDataset(result.dataset);
        
        // Check if this is real data processing
        const isRealData = KaggleBrowserIntegration.isRealDataProcessing(result.dataset.analysis);
        if (!isRealData) {
          console.warn('⚠️ Kaggle dataset processing returned mock data. This means either Kaggle API is not configured or the dataset processing failed.');
        }
      } else {
        console.error('Import failed:', result.error);
      }
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString();
  };

  const getTaskTypeIcon = (taskType) => {
    const icons = {
      classification: 'Target',
      regression: 'TrendingUp',
      image_classification: 'Camera',
      sentiment_analysis: 'MessageCircle',
      recommendation: 'Heart',
      forecasting: 'BarChart3'
    };
    return icons[taskType] || 'Database';
  };

  const getTaskTypeColor = (taskType) => {
    const colors = {
      classification: 'text-blue-600',
      regression: 'text-green-600', 
      image_classification: 'text-purple-600',
      sentiment_analysis: 'text-orange-600',
      recommendation: 'text-pink-600',
      forecasting: 'text-indigo-600'
    };
    return colors[taskType] || 'text-gray-600';
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl border border-orange-200">
        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
          <Icon name="Database" size={20} color="white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            Browse Kaggle Datasets
            <div className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
              AI Powered
            </div>
          </h3>
          <p className="text-sm text-gray-600">
            Find and import datasets from the world's largest data science community
          </p>
        </div>
      </div>

      {/* AI Auto-Fetch */}
      <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={18} className="text-purple-600" />
          <h4 className="font-medium text-gray-900">Smart Dataset Discovery</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Tell us what you're working on, and our AI will find the perfect dataset for you
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {popularQueries.map((query) => (
            <button
              key={query}
              onClick={() => autoFetchDataset(query)}
              disabled={isImporting}
              className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {query}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Describe your ML project (e.g., 'predict customer churn')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && autoFetchDataset(searchQuery)}
            className="flex-1"
          />
          <Button
            onClick={() => autoFetchDataset(searchQuery)}
            disabled={!searchQuery.trim() || isImporting}
            iconName="Sparkles"
            size="sm"
          >
            {isImporting ? 'Finding...' : 'Find Dataset'}
          </Button>
        </div>
      </div>

      {/* Manual Search */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Manual Search</h4>
          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            onClick={() => {/* Open filter modal */}}
          >
            Filters
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Search Kaggle datasets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchDatasets()}
            className="flex-1"
            iconName="Search"
          />
          <Button
            onClick={() => searchDatasets()}
            disabled={!searchQuery.trim() || isSearching}
            iconName="Search"
            size="sm"
          >
            Search
          </Button>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Searching Kaggle datasets...</p>
          </div>
        )}

        {searchResults && searchResults.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">
              Found {searchResults.length} datasets
            </h5>
            {searchResults.map((dataset) => (
              <div
                key={dataset.ref || dataset.id || dataset.title}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all duration-200 cursor-pointer"
                onClick={() => importDataset(dataset.ref || dataset.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h6 className="font-medium text-gray-900 mb-1">{dataset.title}</h6>
                    <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {dataset.taskType && (
                        <div className="flex items-center gap-1">
                          <Icon name={getTaskTypeIcon(dataset.taskType)} size={12} className={getTaskTypeColor(dataset.taskType)} />
                          <span className="capitalize">{dataset.taskType.replace('_', ' ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Icon name="Download" size={12} />
                        <span>{formatNumber(dataset.downloadCount || 0)} downloads</span>
                      </div>
                      {dataset.usabilityRating && (
                        <div className="flex items-center gap-1">
                          <Icon name="Star" size={12} />
                          <span>{dataset.usabilityRating.toFixed(1)} rating</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        <span>{dataset.size || 'Unknown size'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    iconName="Download"
                    disabled={isImporting}
                    onClick={(e) => {
                      e.stopPropagation();
                      importDataset(dataset.ref || dataset.id);
                    }}
                  >
                    Import
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {searchResults && searchResults.length === 0 && searchQuery && !isSearching && (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Search" size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No datasets found for "{searchQuery}"</p>
            <p className="text-sm">Try different keywords or use AI auto-fetch above</p>
          </div>
        )}
      </div>

      {/* Selected Dataset Preview */}
      {selectedDataset && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-green-600" />
            <h4 className="font-medium text-green-900">Dataset Ready</h4>
          </div>
          <p className="text-sm text-green-700">
            <strong>{selectedDataset.name}</strong> has been imported and analyzed successfully!
          </p>
          {selectedDataset.analysis && (
            <div className="mt-2 text-xs text-green-600">
              {selectedDataset.analysis.totalSamples} samples • {selectedDataset.analysis.featureCount} features • {selectedDataset.analysis.analysis?.dataQuality} quality
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KaggleBrowser;
