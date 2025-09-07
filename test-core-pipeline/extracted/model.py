import numpy as np
import pandas as pd
from datetime import datetime
import joblib
import os

class ModelPredictor:
    """Model prediction class for classification"""
    
    def __init__(self):
        self.model = None
        self.feature_names = []
        self.created_at = datetime.now().isoformat()
        self.load_model()
    
    def load_model(self):
        """Load the trained model"""
        model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
        
        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print(f"Model loaded successfully from {model_path}")
            except Exception as e:
                print(f"Error loading model: {e}")
                self._create_mock_model()
        else:
            print("No model file found, creating mock model")
            self._create_mock_model()
    
    def _create_mock_model(self):
        """Create a mock model for demonstration"""
        from sklearn.ensemble import RandomForestClassifier
        from sklearn.linear_model import LinearRegression
        
        # Create mock model based on task type
        if 'classification' in ['classification', 'image_classification', 'text_classification', 'sentiment_analysis']:
            self.model = RandomForestClassifier(n_estimators=10, random_state=42)
            # Create mock training data
            X_mock = np.random.rand(100, 5)
            y_mock = np.random.randint(0, 2, 100)
            self.model.fit(X_mock, y_mock)
            self.feature_names = [f'feature_{i}' for i in range(5)]
        else:  # regression
            self.model = LinearRegression()
            X_mock = np.random.rand(100, 5)
            y_mock = np.random.rand(100)
            self.model.fit(X_mock, y_mock)
            self.feature_names = [f'feature_{i}' for i in range(5)]
    
    def predict(self, input_data):
        """Make prediction on input data"""
        try:
            # Convert input to numpy array
            if isinstance(input_data, list):
                X = np.array(input_data).reshape(1, -1)
            elif isinstance(input_data, dict):
                # Convert dict to ordered array based on feature names
                X = np.array([[input_data.get(name, 0) for name in self.feature_names]])
            else:
                X = np.array(input_data).reshape(1, -1)
            
            # Make prediction
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(X)[0]
                prediction = self.model.predict(X)[0]
                return {
                    'prediction': int(prediction),
                    'probabilities': probabilities.tolist(),
                    'confidence': float(np.max(probabilities))
                }
            else:
                prediction = self.model.predict(X)[0]
                return {
                    'prediction': float(prediction)
                }
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")
    
    def get_feature_info(self):
        """Get information about model features"""
        return {
            'feature_names': self.feature_names,
            'feature_count': len(self.feature_names),
            'input_shape': f"({len(self.feature_names)},)"
        }
    
    def get_creation_time(self):
        """Get model creation timestamp"""
        return self.created_at
