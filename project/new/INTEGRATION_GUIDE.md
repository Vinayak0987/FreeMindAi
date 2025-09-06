# FreeMindAI Backend Integration Guide

## 🔧 Quick Integration Steps

### 1. Backend Service Integration

The nebula backend can be integrated with your existing FreeMindAI project in several ways:

#### Option A: Microservices Architecture (Recommended)
```bash
# Start the nebula backend as a separate service
cd project/new
python app.py  # Runs on localhost:5000 (typically)
```

#### Option B: API Route Integration
Copy the API routes to your existing Next.js API directory:
```bash
# Copy API routes to your main project
cp -r project/new/api/* api/
```

### 2. Frontend Integration Points

#### Update your existing API utilities (`src/utils/api.js`):
```javascript
// Add nebula backend endpoints
const NEBULA_BASE_URL = process.env.NEXT_PUBLIC_NEBULA_API_URL || 'http://localhost:5000';

export const nebulaAPI = {
  // Data Processing
  processDataset: (formData) => fetch(`${NEBULA_BASE_URL}/api/process`, {
    method: 'POST',
    body: formData
  }),
  
  // Model Training  
  trainModel: (config) => fetch(`${NEBULA_BASE_URL}/api/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  }),
  
  // Deployment
  deployModel: (modelId) => fetch(`${NEBULA_BASE_URL}/api/deploy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId })
  }),
  
  // Analysis & Reports
  getReport: (filename) => fetch(`${NEBULA_BASE_URL}/api/report/${filename}`),
  
  // File Downloads
  downloadFile: (filename) => fetch(`${NEBULA_BASE_URL}/api/download/${filename}`)
};
```

### 3. Environment Configuration

#### Add to your `.env.local` file:
```env
# Nebula Backend Configuration
NEXT_PUBLIC_NEBULA_API_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/freemindai
JWT_SECRET=your_jwt_secret_here

# Optional: Cloud storage (if using Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Enhanced Component Integration

#### Update your existing components to use nebula backend:

**Dataset Management Page (`src/pages/dataset-management/index.jsx`)**:
```javascript
import { nebulaAPI } from '../../utils/api';

// Add data processing capability
const handleDatasetProcess = async (datasetId) => {
  const formData = new FormData();
  formData.append('datasetId', datasetId);
  
  try {
    const response = await nebulaAPI.processDataset(formData);
    const result = await response.json();
    // Update UI with processing results
  } catch (error) {
    console.error('Processing failed:', error);
  }
};
```

**Model Training Page (`src/pages/model-training/index.jsx`)**:
```javascript
// Add YOLOv8 training integration
const handleYOLOTraining = async (config) => {
  try {
    const response = await nebulaAPI.trainModel({
      modelType: 'yolov8',
      dataset: config.datasetId,
      epochs: config.epochs,
      batchSize: config.batchSize
    });
    
    const trainingJob = await response.json();
    // Track training progress
  } catch (error) {
    console.error('Training failed:', error);
  }
};
```

**Model Deployment Page (`src/pages/model-deployment/index.jsx`)**:
```javascript
// Add deployment functionality  
const handleModelDeploy = async (modelId) => {
  try {
    const response = await nebulaAPI.deployModel(modelId);
    const deployment = await response.json();
    // Show deployment status
  } catch (error) {
    console.error('Deployment failed:', error);
  }
};
```

### 5. Database Integration

#### Option A: Use Existing MongoDB Setup
Update `project/new/lib/mongodb.js` to use your existing MongoDB connection.

#### Option B: Merge Database Models  
Copy user models to your existing database schema:
```bash
# Copy nebula user model to your models directory
cp project/new/models/user.js server/models/NebulaUser.js
```

### 6. New Feature Integration

#### AI Chatbot Integration
```javascript
// Add to your AI Assistant Chat component
import { nebulaAPI } from '../../utils/api';

const handleNebulaChat = async (message) => {
  try {
    const response = await fetch('http://localhost:5000/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return await response.json();
  } catch (error) {
    console.error('Chatbot error:', error);
  }
};
```

### 7. Visualization Integration

Add new visualization components to your dashboard:

```javascript
// New component: MLVisualization.jsx
import { useEffect, useState } from 'react';

const MLVisualization = ({ modelId }) => {
  const [visualData, setVisualData] = useState(null);
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/visualize/${modelId}`)
      .then(res => res.json())
      .then(setVisualData);
  }, [modelId]);
  
  return (
    <div className="visualization-container">
      {/* Render visualization data */}
    </div>
  );
};
```

## 🚀 Deployment Integration

### Vercel Integration
Update your main `vercel.json` to include backend routes:
```json
{
  "functions": {
    "api/nebula/[...slug].js": {
      "runtime": "@vercel/python"
    }
  },
  "routes": [
    {
      "src": "/api/nebula/(.*)",
      "dest": "/project/new/api/$1"
    }
  ]
}
```

### Environment Variables for Production
```env
NEXT_PUBLIC_NEBULA_API_URL=https://your-domain.vercel.app/api/nebula
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-production-jwt-secret
```

## 📊 Feature Enhancement Roadmap

1. **Phase 1**: Basic Integration
   - [ ] Backend service running
   - [ ] API endpoints connected
   - [ ] Database integration

2. **Phase 2**: UI Enhancement  
   - [ ] Dataset processing interface
   - [ ] Model training dashboard
   - [ ] Visualization components

3. **Phase 3**: Advanced Features
   - [ ] Real-time training monitoring
   - [ ] Advanced analytics dashboard
   - [ ] Automated model deployment

## 🔍 Testing Integration

```bash
# Test backend connectivity
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🐛 Troubleshooting

### Common Issues:
1. **CORS Errors**: Add your frontend domain to CORS configuration
2. **MongoDB Connection**: Ensure MongoDB is running and accessible
3. **Python Dependencies**: Run `pip install -r requirements.txt`
4. **Port Conflicts**: Check if ports 3000 and 5000 are available

### Debug Mode:
```bash
# Run backend in debug mode
cd project/new
python -c "import app; app.app.run(debug=True)"
```

This integration guide provides a comprehensive approach to merging the powerful nebula backend with your existing FreeMindAI project, enabling advanced ML capabilities while maintaining your current architecture.
