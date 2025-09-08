import requests
import json

def test_api():
    """Test the API endpoint"""
    url = 'http://localhost:5001/process'
    data = {
        'task_type': 'classification',
        'text_prompt': 'titanic dataset'
    }

    try:
        print('🌐 Testing API endpoint...')
        response = requests.post(url, data=data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            print('✅ API Response successful!')
            print(f'   Success: {result.get("success", False)}')
            print(f'   Samples: {result.get("totalSamples", "N/A")}')
            print(f'   Features: {result.get("features", "N/A")}')
            print(f'   Best Model: {result.get("best_model", "N/A")}')
            print(f'   Score: {result.get("best_score", "N/A")}')
            print(f'   Message: {result.get("message", "N/A")}')
        else:
            print(f'❌ API Error: {response.status_code}')
            print(f'Response: {response.text}')
            
    except requests.exceptions.ConnectionError:
        print('❌ API server not running on localhost:5001')
        print('   Start the server with: python app.py')
    except Exception as e:
        print(f'❌ API test failed: {e}')

if __name__ == "__main__":
    test_api()
