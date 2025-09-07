from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from model import ModelPredictor
from config import Config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Initialize model
model_predictor = ModelPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'test-music-classifier',
        'task_type': 'classification',
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    """Make predictions"""
    try:
        if not request.json:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Get input data
        input_data = request.json.get('data')
        if input_data is None:
            return jsonify({'error': 'No data field provided'}), 400
        
        # Make prediction
        result = model_predictor.predict(input_data)
        
        return jsonify({
            'success': True,
            'prediction': result,
            'task_type': 'classification'
        })
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'model_name': 'test-music-classifier',
        'task_type': 'classification',
        'version': '1.0.0',
        'features': model_predictor.get_feature_info(),
        'created_at': model_predictor.get_creation_time()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=Config.DEBUG)
