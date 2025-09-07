import React from 'react';
import { apiService } from '../../utils/api';

/**
 * This utility component provides better integration between KaggleBrowser and real dataset processing.
 * It handles the conversion of Kaggle datasets to actual processable data.
 */
export const KaggleBrowserIntegration = {
  /**
   * Process a Kaggle dataset by first importing it, then processing it through the real API
   */
  async processKaggleDataset(datasetId, topic = '') {
    try {
      // First import the dataset from Kaggle
      const importResponse = await fetch('/api/kaggle/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetId: datasetId })
      });
      
      const importData = await importResponse.json();
      
      if (!importData.success) {
        throw new Error(importData.message || 'Failed to import Kaggle dataset');
      }
      
      // Check if we have actual files from Kaggle (not just mock data)
      const hasRealFiles = importData.data.source === 'kaggle-api' && importData.data.files;
      
      if (hasRealFiles) {
        // If we have real files, try to process the first CSV file through our real processing API
        const csvFiles = importData.data.files.filter(file => file.endsWith('.csv'));
        
        if (csvFiles.length > 0) {
          // For real Kaggle datasets, we'd need to get the actual file content
          // This is a limitation - we can't directly pass downloaded files to the frontend processing API
          console.log('Real Kaggle dataset imported, but file processing needs backend integration');
        }
      }
      
      // For now, return the imported dataset with enhanced analysis
      const enhancedDataset = {
        id: `kaggle_${datasetId.replace('/', '_')}`,
        name: datasetId,
        type: this.inferTaskType(importData.data.analysis, topic),
        analysis: importData.data.analysis,
        source: importData.data.source,
        isKaggleDataset: true,
        downloadPath: importData.data.downloadPath,
        files: importData.data.files
      };
      
      return {
        success: true,
        dataset: enhancedDataset
      };
      
    } catch (error) {
      console.error('Error processing Kaggle dataset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Auto-fetch and process a Kaggle dataset based on topic
   */
  async autoProcessKaggleDataset(topic, preferredSize = 'medium') {
    try {
      // Use the auto-fetch endpoint
      const response = await fetch('/api/kaggle/auto-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic,
          preferredSize: preferredSize
        })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to auto-fetch dataset');
      }
      
      // Enhance the returned dataset
      const enhancedDataset = {
        id: `kaggle_auto_${Date.now()}`,
        name: data.data.selectedDataset.title,
        type: this.inferTaskType(data.data.analysis, topic),
        analysis: {
          ...data.data.analysis,
          totalSamples: data.data.analysis.totalSamples,
          featureCount: data.data.analysis.featureCount,
          dataQuality: data.data.analysis.dataQuality || 'Good'
        },
        source: 'kaggle-auto',
        isKaggleDataset: true,
        kaggleRef: data.data.selectedDataset.ref,
        matchScore: data.data.matchScore,
        reasoning: data.data.reasoning
      };
      
      return {
        success: true,
        dataset: enhancedDataset
      };
      
    } catch (error) {
      console.error('Error auto-processing Kaggle dataset:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Infer task type from analysis and topic
   */
  inferTaskType(analysis, topic = '') {
    if (analysis.taskType) {
      return analysis.taskType;
    }
    
    const topicLower = topic.toLowerCase();
    
    // Check topic keywords
    if (topicLower.includes('classification') || topicLower.includes('classify')) {
      return 'classification';
    }
    if (topicLower.includes('regression') || topicLower.includes('predict') || topicLower.includes('price')) {
      return 'regression';
    }
    if (topicLower.includes('image') || topicLower.includes('vision') || topicLower.includes('photo')) {
      return 'image_classification';
    }
    if (topicLower.includes('text') || topicLower.includes('sentiment') || topicLower.includes('nlp')) {
      return 'sentiment_analysis';
    }
    
    // Default to classification
    return 'classification';
  },

  /**
   * Validate if dataset processing result is real or mock
   */
  isRealDataProcessing(analysis) {
    // Check for typical mock data characteristics
    const isMock = (
      analysis.totalSamples === 2000 &&
      analysis.featureCount === 2 &&
      analysis.dataQuality === 'Good'
    ) || (
      analysis.totalSamples === 1000 &&
      analysis.featureCount === 15
    );
    
    return !isMock;
  }
};

export default KaggleBrowserIntegration;
