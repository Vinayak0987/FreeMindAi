#!/usr/bin/env python3
"""API testing script"""

import requests
import json

BASE_URL = 'http://localhost:5000'

def test_health():
    """Test health endpoint"""
    response = requests.get(f'{BASE_URL}/health')
    print(f"Health Check: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_prediction():
    """Test prediction endpoint"""
    # Sample data for testing
    test_data = {
        'data': [1.0, 2.0, 3.0, 4.0, 5.0]  # Adjust based on your model
    }
    
    response = requests.post(
        f'{BASE_URL}/predict',
        json=test_data,
        headers={'Content-Type': 'application/json'}
    )
    
    print(f"Prediction Test: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

def test_model_info():
    """Test model info endpoint"""
    response = requests.get(f'{BASE_URL}/model/info')
    print(f"Model Info: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.status_code == 200

if __name__ == '__main__':
    print("Testing classification API...")
    print("=" * 50)
    
    try:
        health_ok = test_health()
        print("
" + "-" * 30)
        
        info_ok = test_model_info()
        print("
" + "-" * 30)
        
        pred_ok = test_prediction()
        print("
" + "=" * 50)
        
        if health_ok and info_ok and pred_ok:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running on localhost:5000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
