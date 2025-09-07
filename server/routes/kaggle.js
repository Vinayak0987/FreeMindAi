const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Mock dataset data for when Kaggle API is not available
const MOCK_DATASETS = [
  {
    ref: 'vicsuperman/prediction-of-music-genre',
    title: 'Music Genre Classification Dataset',
    subtitle: 'Predict music genre from audio features',
    description: 'A comprehensive dataset containing audio features for music genre classification',
    downloadCount: 15432,
    voteCount: 234,
    size: '2.5 MB',
    lastUpdated: '2024-01-15T10:00:00Z',
    tags: ['music', 'classification', 'audio', 'machine learning'],
    usabilityRating: 8.5
  },
  {
    ref: 'c/house-prices-advanced-regression-techniques',
    title: 'House Prices - Advanced Regression Techniques',
    subtitle: 'Predict sales prices and practice feature engineering',
    description: 'Predict house prices based on various features',
    downloadCount: 45678,
    voteCount: 567,
    size: '1.2 MB',
    lastUpdated: '2024-02-10T15:30:00Z',
    tags: ['regression', 'housing', 'real estate', 'competition'],
    usabilityRating: 9.2
  },
  {
    ref: 'puneet6060/intel-image-classification',
    title: 'Intel Image Classification',
    subtitle: 'Classify natural images into categories',
    description: 'Natural images classification dataset with 6 categories',
    downloadCount: 23456,
    voteCount: 345,
    size: '150 MB',
    lastUpdated: '2024-01-20T12:00:00Z',
    tags: ['image', 'classification', 'computer vision', 'natural scenes'],
    usabilityRating: 7.8
  },
  {
    ref: 'netflix/netflix-shows',
    title: 'Netflix Movies and TV Shows',
    subtitle: 'Content analysis and recommendation dataset',
    description: 'Netflix dataset with movies and TV shows for recommendation systems and content analysis',
    downloadCount: 78432,
    voteCount: 891,
    size: '5.2 MB',
    lastUpdated: '2024-01-25T09:15:00Z',
    tags: ['movie', 'recommendation', 'content', 'streaming', 'entertainment'],
    usabilityRating: 8.9
  },
  {
    ref: 'movielens/movielens-20m-dataset',
    title: 'MovieLens 20M Movie Ratings',
    subtitle: 'Movie recommendation system dataset',
    description: 'Large-scale movie rating dataset for building recommendation systems',
    downloadCount: 125432,
    voteCount: 1234,
    size: '190 MB',
    lastUpdated: '2024-02-01T14:30:00Z',
    tags: ['movie', 'recommendation', 'ratings', 'collaborative filtering'],
    usabilityRating: 9.5
  },
  {
    ref: 'imdb/imdb-movie-dataset',
    title: 'IMDB Movie Dataset',
    subtitle: 'Movie metadata and ratings for analysis',
    description: 'Comprehensive IMDB movie dataset with ratings, genres, cast, and crew information',
    downloadCount: 67890,
    voteCount: 789,
    size: '12 MB',
    lastUpdated: '2024-01-18T11:45:00Z',
    tags: ['movie', 'imdb', 'ratings', 'entertainment', 'analysis'],
    usabilityRating: 8.7
  },
  {
    ref: 'titanic/titanic-dataset',
    title: 'Titanic - Machine Learning from Disaster',
    subtitle: 'Classic binary classification problem',
    description: 'Predict survival on the Titanic using passenger data',
    downloadCount: 234567,
    voteCount: 2345,
    size: '0.8 MB',
    lastUpdated: '2024-01-10T16:20:00Z',
    tags: ['classification', 'binary', 'beginner', 'competition'],
    usabilityRating: 9.8
  },
  {
    ref: 'iris/iris-flower-dataset',
    title: 'Iris Flower Dataset',
    subtitle: 'Classic multiclass classification dataset',
    description: 'Iris flower species classification based on measurements',
    downloadCount: 156789,
    voteCount: 1567,
    size: '0.1 MB',
    lastUpdated: '2024-01-05T08:00:00Z',
    tags: ['classification', 'multiclass', 'beginner', 'flowers'],
    usabilityRating: 9.9
  },
  {
    ref: 'covid19/covid-19-dataset',
    title: 'COVID-19 Dataset',
    subtitle: 'Comprehensive COVID-19 data for analysis',
    description: 'Global COVID-19 cases, deaths, and vaccination data',
    downloadCount: 89123,
    voteCount: 891,
    size: '15 MB',
    lastUpdated: '2024-02-15T12:00:00Z',
    tags: ['covid', 'pandemic', 'health', 'time series', 'analysis'],
    usabilityRating: 8.3
  },
  {
    ref: 'stock/stock-market-dataset',
    title: 'Stock Market Dataset',
    subtitle: 'Stock prices for prediction and analysis',
    description: 'Historical stock market data for price prediction and financial analysis',
    downloadCount: 45234,
    voteCount: 452,
    size: '25 MB',
    lastUpdated: '2024-02-05T13:30:00Z',
    tags: ['stock', 'prediction', 'finance', 'time series', 'investment'],
    usabilityRating: 8.1
  }
];

// Search Kaggle datasets
router.get('/search', async (req, res) => {
  try {
    const { q = '', sort = 'hottest', page = 1, size = 20 } = req.query;
    
    console.log(`🔍 Searching Kaggle datasets: "${q}"`);
    
    // Try to use real Kaggle API if available
    if (process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY) {
      try {
        const kaggleCommand = `kaggle datasets list --search "${q}" --sort-by ${sort} --page ${page} --page-size ${size} --csv`;
        
        const searchResults = await new Promise((resolve, reject) => {
          exec(kaggleCommand, (error, stdout, stderr) => {
            if (error) {
              console.warn('⚠️ Kaggle CLI not available, using mock data');
              resolve(null);
            } else {
              try {
                // Parse CSV output from Kaggle CLI
                const lines = stdout.trim().split('\n');
                if (lines.length > 1) {
                  const headers = lines[0].split(',');
                  const datasets = lines.slice(1).map(line => {
                    // Handle CSV parsing more carefully
                    const values = [];
                    let current = '';
                    let inQuotes = false;
                    
                    for (let i = 0; i < line.length; i++) {
                      const char = line[i];
                      if (char === '"') {
                        inQuotes = !inQuotes;
                      } else if (char === ',' && !inQuotes) {
                        values.push(current.trim());
                        current = '';
                      } else {
                        current += char;
                      }
                    }
                    values.push(current.trim()); // Add the last value
                    
                    const dataset = {};
                    headers.forEach((header, index) => {
                      dataset[header] = values[index] || '';
                    });
                    
                    return {
                      ref: dataset.ref || '',
                      title: dataset.title || 'Untitled Dataset',
                      subtitle: dataset.subtitle || '',
                      description: dataset.description || dataset.title || 'No description',
                      downloadCount: parseInt(dataset.downloadCount) || 0,
                      voteCount: parseInt(dataset.voteCount) || 0,
                      size: dataset.size || 'Unknown',
                      lastUpdated: dataset.lastUpdated || new Date().toISOString(),
                      tags: dataset.tags ? dataset.tags.split(' ') : [],
                      usabilityRating: parseFloat(dataset.usabilityRating) || 0
                    };
                  });
                  resolve(datasets);
                } else {
                  resolve([]);
                }
              } catch (parseError) {
                console.warn('⚠️ Failed to parse Kaggle CLI output, using mock data');
                resolve(null);
              }
            }
          });
        });
        
        if (searchResults) {
          return res.json({
            success: true,
            message: `Found ${searchResults.length} datasets`,
            data: searchResults,
            metadata: {
              query: q,
              page: parseInt(page),
              size: parseInt(size),
              source: 'kaggle-api'
            }
          });
        }
      } catch (apiError) {
        console.warn('⚠️ Kaggle API error, using mock data:', apiError.message);
      }
    }
    
    // Fallback to mock data
    console.log('📋 Using mock dataset data for search');
    const filteredMockData = MOCK_DATASETS.filter(dataset => {
      if (!q) return true;
      
      const query = q.toLowerCase();
      const title = dataset.title.toLowerCase();
      const description = dataset.description.toLowerCase();
      const tags = dataset.tags.map(tag => tag.toLowerCase());
      
      // Split query into words for better matching
      const queryWords = query.split(/\s+/).filter(word => word.length > 0);
      
      // Check if all query words are found somewhere in the dataset
      return queryWords.every(word => 
        title.includes(word) ||
        description.includes(word) ||
        tags.some(tag => tag.includes(word) || word.includes(tag))
      );
    });
    
    res.json({
      success: true,
      message: `Found ${filteredMockData.length} mock datasets`,
      data: filteredMockData,
      metadata: {
        query: q,
        page: parseInt(page),
        size: parseInt(size),
        source: 'mock-data'
      }
    });
    
  } catch (error) {
    console.error('❌ Dataset search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search datasets',
      error: error.message
    });
  }
});

// Import/download a specific dataset
router.post('/import', [
  body('datasetId').notEmpty().withMessage('Dataset ID is required'),
  body('projectId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { datasetId, projectId = 'default' } = req.body;
    
    console.log(`📥 Importing dataset: ${datasetId}`);
    
    // Create download directory
    const downloadDir = path.join(process.cwd(), 'kaggle_downloads', projectId);
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
    
    // Try real Kaggle download if available
    if (process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY) {
      try {
        const downloadCommand = `kaggle datasets download -d ${datasetId} -p "${downloadDir}" --unzip`;
        
        const downloadResult = await new Promise((resolve, reject) => {
          exec(downloadCommand, (error, stdout, stderr) => {
            if (error) {
              console.warn('⚠️ Kaggle download failed, using mock data');
              resolve(null);
            } else {
              resolve(stdout);
            }
          });
        });
        
        if (downloadResult) {
          // Analyze downloaded files
          const analysis = await analyzeDownloadedDataset(downloadDir, datasetId);
          
          return res.json({
            success: true,
            message: 'Dataset imported successfully from Kaggle',
            data: {
              datasetId,
              projectId,
              downloadPath: downloadDir,
              analysis,
              files: fs.readdirSync(downloadDir),
              source: 'kaggle-api'
            }
          });
        }
      } catch (downloadError) {
        console.warn('⚠️ Kaggle download error, using mock data:', downloadError.message);
      }
    }
    
    // Fallback to mock data generation
    console.log('🎭 Generating mock dataset for analysis');
    const mockAnalysis = await generateMockDatasetAnalysis(datasetId, downloadDir);
    
    res.json({
      success: true,
      message: 'Mock dataset created for testing',
      data: {
        datasetId,
        projectId,
        downloadPath: downloadDir,
        analysis: mockAnalysis,
        files: ['mock_data.csv', 'data_info.txt'],
        source: 'mock-data'
      }
    });
    
  } catch (error) {
    console.error('❌ Dataset import error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import dataset',
      error: error.message
    });
  }
});

// Auto-fetch dataset using AI
router.post('/auto-fetch', [
  body('topic').notEmpty().withMessage('Topic is required'),
  body('preferredSize').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const { topic, preferredSize = 'medium' } = req.body;
    
    console.log(`🤖 Auto-fetching dataset for topic: "${topic}"`);
    
    // Find the best matching dataset from our mock data based on topic
    const topicLower = topic.toLowerCase();
    let matchedDataset = null;
    let bestScore = 0;
    
    for (const dataset of MOCK_DATASETS) {
      let score = 0;
      
      // Check title match
      if (dataset.title.toLowerCase().includes(topicLower)) score += 3;
      
      // Check description match
      if (dataset.description.toLowerCase().includes(topicLower)) score += 2;
      
      // Check tags match
      const tagMatches = dataset.tags.filter(tag => 
        tag.toLowerCase().includes(topicLower) || topicLower.includes(tag.toLowerCase())
      );
      score += tagMatches.length;
      
      // Check individual words
      const topicWords = topicLower.split(/\s+/);
      topicWords.forEach(word => {
        if (dataset.title.toLowerCase().includes(word)) score += 1;
        if (dataset.description.toLowerCase().includes(word)) score += 1;
        dataset.tags.forEach(tag => {
          if (tag.toLowerCase().includes(word)) score += 1;
        });
      });
      
      if (score > bestScore) {
        bestScore = score;
        matchedDataset = dataset;
      }
    }
    
    if (!matchedDataset) {
      // Fallback to first dataset if no match
      matchedDataset = MOCK_DATASETS[0];
    }
    
    // Generate analysis for the matched dataset
    const analysis = {
      totalSamples: Math.floor(Math.random() * 50000) + 1000,
      featureCount: Math.floor(Math.random() * 20) + 5,
      dataQuality: 'Good',
      taskType: matchedDataset.tags.includes('classification') ? 'classification' : 
                matchedDataset.tags.includes('regression') ? 'regression' : 'analysis',
      complexity: 'Medium'
    };
    
    res.json({
      success: true,
      message: `AI selected best dataset for "${topic}"`,
      data: {
        selectedDataset: matchedDataset,
        analysis,
        matchScore: bestScore,
        reasoning: `Selected based on ${bestScore > 0 ? 'topic relevance' : 'general suitability'} for ${topic}`,
        source: 'ai-mock-selection'
      }
    });
    
  } catch (error) {
    console.error('❌ Auto-fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to auto-fetch dataset',
      error: error.message
    });
  }
});

// Get dataset information
router.get('/info/:datasetName', async (req, res) => {
  try {
    const { datasetName } = req.params;
    
    // Try to find in mock data first
    const mockDataset = MOCK_DATASETS.find(d => d.ref === datasetName);
    if (mockDataset) {
      return res.json({
        success: true,
        message: 'Dataset info retrieved',
        data: mockDataset
      });
    }
    
    // Try Kaggle API
    if (process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY) {
      const infoCommand = `kaggle datasets show ${datasetName}`;
      
      exec(infoCommand, (error, stdout, stderr) => {
        if (error) {
          return res.status(404).json({
            success: false,
            message: 'Dataset not found',
            error: error.message
          });
        }
        
        res.json({
          success: true,
          message: 'Dataset info retrieved from Kaggle',
          data: {
            ref: datasetName,
            info: stdout,
            source: 'kaggle-api'
          }
        });
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Dataset not found and Kaggle API not configured'
      });
    }
    
  } catch (error) {
    console.error('❌ Dataset info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dataset info',
      error: error.message
    });
  }
});

// Analyze downloaded dataset
async function analyzeDownloadedDataset(downloadDir, datasetName) {
  try {
    const files = fs.readdirSync(downloadDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      return generateMockAnalysis(datasetName);
    }
    
    // Analyze first CSV file
    const csvFile = path.join(downloadDir, csvFiles[0]);
    const analysis = await analyzeCsvFile(csvFile);
    
    return {
      summary: {
        totalRows: analysis.totalRows,
        totalColumns: analysis.totalColumns,
        fileSize: `${(fs.statSync(csvFile).size / 1024).toFixed(2)} KB`,
        dataTypes: analysis.dataTypes
      },
      columns: analysis.columns,
      preview: analysis.preview,
      insights: analysis.insights
    };
    
  } catch (error) {
    console.warn('⚠️ Analysis failed, using mock data:', error.message);
    return generateMockAnalysis(datasetName);
  }
}

// Analyze CSV file
function analyzeCsvFile(csvPath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const columns = [];
    let totalRows = 0;
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('headers', (headers) => {
        headers.forEach(header => {
          columns.push({
            name: header,
            type: 'unknown',
            description: `Feature: ${header}`
          });
        });
      })
      .on('data', (row) => {
        if (totalRows < 5) {
          rows.push(row);
        }
        totalRows++;
      })
      .on('end', () => {
        // Infer data types from first few rows
        if (rows.length > 0) {
          columns.forEach(col => {
            const sampleValues = rows.map(row => row[col.name]).filter(v => v !== '');
            const numericCount = sampleValues.filter(v => !isNaN(v)).length;
            col.type = numericCount > sampleValues.length * 0.8 ? 'numeric' : 'categorical';
          });
        }
        
        const dataTypes = {
          numeric: columns.filter(c => c.type === 'numeric').length,
          categorical: columns.filter(c => c.type === 'categorical').length
        };
        
        const insights = [
          `Dataset contains ${totalRows} rows and ${columns.length} columns`,
          `${dataTypes.numeric} numeric features and ${dataTypes.categorical} categorical features`,
          'Dataset appears to be well-structured for machine learning'
        ];
        
        resolve({
          totalRows,
          totalColumns: columns.length,
          columns,
          preview: rows,
          dataTypes,
          insights
        });
      })
      .on('error', reject);
  });
}

// Generate mock dataset analysis
async function generateMockDatasetAnalysis(datasetName, downloadDir) {
  // Create mock CSV file
  const mockCsvPath = path.join(downloadDir, 'mock_data.csv');
  const mockCsvContent = generateMockCsvContent(datasetName);
  fs.writeFileSync(mockCsvPath, mockCsvContent);
  
  // Create info file
  const infoPath = path.join(downloadDir, 'data_info.txt');
  fs.writeFileSync(infoPath, `Mock dataset generated for: ${datasetName}\nCreated: ${new Date().toISOString()}`);
  
  return generateMockAnalysis(datasetName);
}

// Generate mock CSV content based on dataset name
function generateMockCsvContent(datasetName) {
  if (datasetName.includes('music') || datasetName.includes('genre')) {
    return `genre,tempo,loudness,energy,danceability
rock,120,-5.2,0.8,0.6
pop,128,-3.1,0.9,0.8
jazz,100,-8.5,0.6,0.4
classical,90,-12.0,0.3,0.2
electronic,140,-2.5,0.95,0.9`;
  } else if (datasetName.includes('house') || datasetName.includes('price')) {
    return `price,bedrooms,bathrooms,sqft,age
500000,3,2,1800,10
750000,4,3,2500,5
300000,2,1,1200,25
900000,5,4,3200,2
650000,3,2.5,2000,8`;
  } else if (datasetName.includes('image') || datasetName.includes('classification')) {
    return `filename,label,width,height,channels
img001.jpg,cat,224,224,3
img002.jpg,dog,224,224,3
img003.jpg,bird,224,224,3
img004.jpg,car,224,224,3
img005.jpg,flower,224,224,3`;
  } else {
    return `feature1,feature2,feature3,target
1.2,3.4,5.6,A
2.3,4.5,6.7,B
3.4,5.6,7.8,A
4.5,6.7,8.9,C
5.6,7.8,9.0,B`;
  }
}

// Generate mock analysis data
function generateMockAnalysis(datasetName) {
  if (datasetName.includes('music') || datasetName.includes('genre')) {
    return {
      summary: {
        totalRows: 1000,
        totalColumns: 15,
        fileSize: '2.5 MB',
        dataTypes: {
          numeric: 12,
          categorical: 3
        }
      },
      preview: [
        { genre: 'rock', tempo: 120, loudness: -5.2, energy: 0.8 },
        { genre: 'pop', tempo: 128, loudness: -3.1, energy: 0.9 },
        { genre: 'jazz', tempo: 100, loudness: -8.5, energy: 0.6 }
      ],
      columns: [
        { name: 'genre', type: 'categorical', description: 'Music genre label' },
        { name: 'tempo', type: 'numeric', description: 'Beats per minute' },
        { name: 'loudness', type: 'numeric', description: 'Overall loudness in dB' },
        { name: 'energy', type: 'numeric', description: 'Energy level (0-1)' }
      ],
      insights: [
        'Dataset contains 10 different music genres',
        'Well-balanced classes with ~100 samples each',
        'Strong correlation between energy and loudness',
        'Tempo varies significantly across genres'
      ]
    };
  } else {
    return {
      summary: {
        totalRows: 500,
        totalColumns: 10,
        fileSize: '1.2 MB',
        dataTypes: {
          numeric: 8,
          categorical: 2
        }
      },
      preview: [
        { feature1: 1.2, feature2: 3.4, target: 'A' },
        { feature1: 2.3, feature2: 4.5, target: 'B' },
        { feature1: 3.4, feature2: 5.6, target: 'A' }
      ],
      columns: [
        { name: 'feature1', type: 'numeric', description: 'Numeric feature 1' },
        { name: 'feature2', type: 'numeric', description: 'Numeric feature 2' },
        { name: 'target', type: 'categorical', description: 'Target variable' }
      ],
      insights: [
        'Dataset contains balanced classes',
        'Features show normal distribution',
        'Suitable for classification tasks'
      ]
    };
  }
}

module.exports = router;
