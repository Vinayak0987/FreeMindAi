const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect: auth } = require('../middleware/auth');
const path = require('path');
const fs = require('fs').promises;
const archiver = require('archiver');
const { PassThrough } = require('stream');

// Download trained model
router.post('/projects/download/model', auth, [
  body('projectId').isMongoId(),
  body('trainingJobId').optional().isMongoId(),
  body('type').isIn(['trained_model', 'preprocessed_data', 'complete_project'])
], async (req, res) => {
  // Same implementation as existing
  await handleDownload(req, res);
});

// Download preprocessed data
router.post('/projects/download/data', auth, [
  body('projectId').isMongoId(),
  body('type').isIn(['trained_model', 'preprocessed_data', 'complete_project'])
], async (req, res) => {
  // Override type to preprocessed_data
  req.body.type = 'preprocessed_data';
  await handleDownload(req, res);
});

// Download complete project
router.post('/projects/download/complete', auth, [
  body('projectId').isMongoId(),
  body('trainingJobId').optional().isMongoId(),
  body('type').optional().isIn(['trained_model', 'preprocessed_data', 'complete_project'])
], async (req, res) => {
  // Override type to complete_project
  req.body.type = 'complete_project';
  await handleDownload(req, res);
});

// Main download handler
async function handleDownload(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { projectId, trainingJobId, type } = req.body;
    
    // Create a unique filename based on project and type
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${type}_${projectId}_${timestamp}.zip`;
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Pipe archive to response
    archive.pipe(res);
    
    try {
      // Add files based on download type
      switch (type) {
        case 'trained_model':
          await addTrainedModelFiles(archive, projectId, trainingJobId);
          break;
        case 'preprocessed_data':
          await addPreprocessedDataFiles(archive, projectId);
          break;
        case 'complete_project':
          await addCompleteProjectFiles(archive, projectId, trainingJobId);
          break;
      }
      
      // Finalize the archive
      await archive.finalize();
      
    } catch (error) {
      console.error('Error creating archive:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create download archive',
          error: error.message
        });
      }
    }
    
  } catch (error) {
    console.error('Error in download route:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to process download request',
        error: error.message
      });
    }
  }
}

// Legacy route - keeping for backward compatibility
router.post('/model', auth, [
  body('projectId').isMongoId(),
  body('trainingJobId').optional().isMongoId(),
  body('type').isIn(['trained_model', 'preprocessed_data', 'complete_project'])
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

    const { projectId, trainingJobId, type } = req.body;
    
    // Create a unique filename based on project and type
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${type}_${projectId}_${timestamp}.zip`;
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Create ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    // Pipe archive to response
    archive.pipe(res);
    
    try {
      // Add files based on download type
      switch (type) {
        case 'trained_model':
          await addTrainedModelFiles(archive, projectId, trainingJobId);
          break;
        case 'preprocessed_data':
          await addPreprocessedDataFiles(archive, projectId);
          break;
        case 'complete_project':
          await addCompleteProjectFiles(archive, projectId, trainingJobId);
          break;
      }
      
      // Finalize the archive
      await archive.finalize();
      
    } catch (error) {
      console.error('Error creating archive:', error);
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: 'Failed to create download archive',
          error: error.message
        });
      }
    }
    
  } catch (error) {
    console.error('Error in download route:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to process download request',
        error: error.message
      });
    }
  }
});

// Helper function to add trained model files to archive
async function addTrainedModelFiles(archive, projectId, trainingJobId) {
  const projectDir = path.join(process.cwd(), 'ml_system', projectId);
  const modelsDir = path.join(projectDir, 'models');
  const downloadsDir = path.join(projectDir, 'downloads');
  
  try {
    // Add model files (look for common model file extensions)
    const modelFiles = ['best_model.pkl', 'best_model.keras', 'best_model.pt'];
    
    for (const modelFile of modelFiles) {
      const modelPath = path.join(modelsDir, modelFile);
      try {
        await fs.access(modelPath);
        archive.file(modelPath, { name: modelFile });
        break; // Only add one model file
      } catch (err) {
        // File doesn't exist, continue to next
        continue;
      }
    }
    
    // Add Streamlit app file
    const streamlitAppPath = path.join(downloadsDir, 'load_model.py');
    try {
      await fs.access(streamlitAppPath);
      archive.file(streamlitAppPath, { name: 'load_model.py' });
    } catch (err) {
      // Create a basic Streamlit app if none exists
      const basicApp = createBasicStreamlitApp();
      archive.append(basicApp, { name: 'load_model.py' });
    }
    
    // Add requirements.txt
    const requirementsPath = path.join(downloadsDir, 'requirements.txt');
    try {
      await fs.access(requirementsPath);
      archive.file(requirementsPath, { name: 'requirements.txt' });
    } catch (err) {
      // Create basic requirements if none exists
      const basicRequirements = createBasicRequirements();
      archive.append(basicRequirements, { name: 'requirements.txt' });
    }
    
    // Add README
    const readme = createProjectReadme('trained_model');
    archive.append(readme, { name: 'README.md' });
    
  } catch (error) {
    console.error('Error adding trained model files:', error);
    throw error;
  }
}

// Helper function to add preprocessed data files to archive
async function addPreprocessedDataFiles(archive, projectId) {
  const projectDir = path.join(process.cwd(), 'ml_system', projectId);
  const datasetsDir = path.join(projectDir, 'datasets');
  
  try {
    // Add dataset files
    const datasetFiles = await fs.readdir(datasetsDir).catch(() => []);
    
    for (const file of datasetFiles) {
      if (file.endsWith('.csv') || file.endsWith('.zip')) {
        const filePath = path.join(datasetsDir, file);
        archive.file(filePath, { name: `data/${file}` });
      }
    }
    
    // Add data processing information
    const dataInfo = createDataProcessingInfo();
    archive.append(dataInfo, { name: 'data_info.md' });
    
    // Add README
    const readme = createProjectReadme('preprocessed_data');
    archive.append(readme, { name: 'README.md' });
    
  } catch (error) {
    console.error('Error adding preprocessed data files:', error);
    throw error;
  }
}

// Helper function to add complete project files to archive
async function addCompleteProjectFiles(archive, projectId, trainingJobId) {
  // Add both model and data files
  await addTrainedModelFiles(archive, projectId, trainingJobId);
  await addPreprocessedDataFiles(archive, projectId);
  
  // Add setup script
  const setupScript = createSetupScript();
  archive.append(setupScript, { name: 'setup_env.py' });
  
  // Override README with complete project version
  const readme = createProjectReadme('complete_project');
  archive.append(readme, { name: 'README.md' });
}

// Helper functions to create file content
function createBasicStreamlitApp() {
  return `import streamlit as st
import pickle
import pandas as pd
import numpy as np

# Load the model
@st.cache_resource
def load_model():
    try:
        with open('best_model.pkl', 'rb') as f:
            model = pickle.load(f)
        return model
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None

def main():
    st.title("ML Model Predictions")
    st.write("Upload your data or enter values for prediction")
    
    model = load_model()
    if not model:
        st.stop()
    
    # File upload option
    uploaded_file = st.file_uploader("Choose a CSV file", type="csv")
    
    if uploaded_file is not None:
        # Read and display data
        data = pd.read_csv(uploaded_file)
        st.write("Data preview:")
        st.write(data.head())
        
        # Make predictions
        if st.button("Predict"):
            try:
                predictions = model.predict(data)
                st.write("Predictions:")
                st.write(predictions)
            except Exception as e:
                st.error(f"Error making predictions: {e}")

if __name__ == "__main__":
    main()
`;
}

function createBasicRequirements() {
  return `streamlit>=1.28.0
pandas>=1.5.0
numpy>=1.21.0
scikit-learn>=1.0.0
matplotlib>=3.5.0
seaborn>=0.11.0
`;
}

function createProjectReadme(type) {
  const readmeContent = {
    'trained_model': `# Trained ML Model

This package contains your trained machine learning model and everything needed to use it.

## Files Included

- \`best_model.pkl/keras/pt\`: Your trained model
- \`load_model.py\`: Streamlit app for making predictions
- \`requirements.txt\`: Required Python packages
- \`README.md\`: This file

## Quick Start

1. Install dependencies:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. Run the Streamlit app:
   \`\`\`bash
   streamlit run load_model.py
   \`\`\`

3. Upload your data and get predictions!

## Support

For issues or questions, please refer to the FreeMind AI documentation.
`,
    'preprocessed_data': `# Preprocessed Dataset

This package contains your cleaned and preprocessed dataset ready for analysis.

## Files Included

- \`data/\`: Preprocessed dataset files
- \`data_info.md\`: Information about data processing steps
- \`README.md\`: This file

## Data Processing Applied

- Missing value imputation
- Feature scaling/normalization
- Categorical encoding
- Feature engineering

## Usage

Load the data in your preferred environment and start building models!

\`\`\`python
import pandas as pd
data = pd.read_csv('data/your_dataset.csv')
\`\`\`
`,
    'complete_project': `# Complete ML Project

This package contains everything from your FreeMind AI project: trained model, processed data, and deployment code.

## Files Included

### Model Files
- \`best_model.pkl/keras/pt\`: Your trained model
- \`load_model.py\`: Streamlit app for predictions

### Data Files
- \`data/\`: Preprocessed datasets
- \`data_info.md\`: Data processing information

### Setup Files
- \`requirements.txt\`: Python dependencies
- \`setup_env.py\`: Environment setup script
- \`README.md\`: This file

## Quick Start

1. Set up environment (optional):
   \`\`\`bash
   python setup_env.py
   \`\`\`

2. Or install manually:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

3. Run the app:
   \`\`\`bash
   streamlit run load_model.py
   \`\`\`

## Project Structure

\`\`\`
project/
├── best_model.*          # Trained model
├── load_model.py          # Streamlit app
├── requirements.txt       # Dependencies
├── setup_env.py          # Setup script
├── data/                 # Datasets
│   └── *.csv
├── data_info.md          # Data info
└── README.md             # This file
\`\`\`

Enjoy your ML project! 🎉
`
  };
  
  return readmeContent[type] || readmeContent['complete_project'];
}

function createDataProcessingInfo() {
  return `# Data Processing Information

## Processing Steps Applied

1. **Data Cleaning**
   - Removed duplicate rows
   - Handled missing values using appropriate imputation strategies

2. **Feature Engineering**
   - Scaled numerical features using StandardScaler
   - Encoded categorical variables using One-Hot Encoding
   - Created additional features where applicable

3. **Data Validation**
   - Verified data types and formats
   - Checked for outliers and anomalies
   - Ensured consistent data quality

## Data Quality Metrics

- Original dataset size: [rows] x [columns]
- Final dataset size: [rows] x [columns]
- Missing values: Handled appropriately
- Data types: Validated and corrected

## Usage Notes

The preprocessed data is ready for machine learning applications. All transformations have been applied consistently across training and test sets.
`;
}

function createSetupScript() {
  return `import subprocess
import sys
import os

def setup_environment():
    """Set up Python virtual environment and install dependencies."""
    print("Setting up FreeMind AI project environment...")
    
    # Create virtual environment
    print("Creating virtual environment...")
    subprocess.run([sys.executable, "-m", "venv", "venv"])
    
    # Determine pip path based on OS
    if os.name == "nt":  # Windows
        pip_path = os.path.join("venv", "Scripts", "pip")
        python_path = os.path.join("venv", "Scripts", "python")
    else:  # Unix/MacOS
        pip_path = os.path.join("venv", "bin", "pip")
        python_path = os.path.join("venv", "bin", "python")
    
    # Upgrade pip
    print("Upgrading pip...")
    subprocess.run([python_path, "-m", "pip", "install", "--upgrade", "pip"])
    
    # Install requirements
    print("Installing dependencies...")
    subprocess.run([pip_path, "install", "-r", "requirements.txt"])
    
    print("Setup complete! 🎉")
    print("\\nTo activate the environment:")
    if os.name == "nt":
        print("  venv\\\\Scripts\\\\activate")
    else:
        print("  source venv/bin/activate")
    print("\\nThen run: streamlit run load_model.py")

if __name__ == "__main__":
    setup_environment()
`;
}

module.exports = router;
