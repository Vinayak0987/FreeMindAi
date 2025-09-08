#!/usr/bin/env python3
"""
Test image dataset handling specifically
"""

import sys
import os
sys.path.append('./project/new')

from data_handling import download_kaggle_dataset
import tempfile

def test_image_dataset():
    print('🔍 Testing image dataset handling...')
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    print(f'Using temp directory: {temp_dir}')
    
    # Try to download an image dataset using direct reference
    print('\n📥 Attempting to download Intel Image Classification dataset...')
    try:
        result = download_kaggle_dataset('puneet6060/intel-image-classification', temp_dir)
        print(f'Download result: {result}')
        
        if result and result[0]:
            file_path, task_type = result
            print(f'File path: {file_path}')
            print(f'Task type: {task_type}')
            print(f'File exists: {os.path.exists(file_path)}')
            
            # Check what's in the temp directory
            print(f'\nContents of temp directory:')
            if os.path.exists(temp_dir):
                for item in os.listdir(temp_dir):
                    item_path = os.path.join(temp_dir, item)
                    is_dir = os.path.isdir(item_path)
                    print(f'  {item} ({"directory" if is_dir else "file"})')
                    
            # The issue might be that it's only looking for CSV files
            # but image datasets have folders, not CSV files
            print(f'\n🔍 Analyzing the issue...')
            print('The download_kaggle_dataset function is designed for CSV files,')
            print('but image datasets contain folders with images.')
            
        else:
            print('❌ Download failed or returned None')
            
    except Exception as e:
        print(f'❌ Error: {e}')
        import traceback
        traceback.print_exc()

def test_image_api_call():
    """Test the API call for image classification"""
    print('\n🌐 Testing image classification API call...')
    
    import requests
    
    test_data = {
        'task_type': 'image_classification',
        'text_prompt': 'puneet6060/intel-image-classification'  # Use direct dataset reference
    }
    
    try:
        print(f'Sending request: {test_data}')
        response = requests.post(
            'http://localhost:5001/process',
            data=test_data,
            timeout=60  # Shorter timeout for debugging
        )
        
        print(f'Response status: {response.status_code}')
        
        if response.status_code == 200:
            result = response.json()
            print(f'Success: {result.get("success", False)}')
            print(f'Task type: {result.get("task_type", "N/A")}')
            print(f'Samples: {result.get("totalSamples", "N/A")}')
            print(f'Message: {result.get("message", "N/A")}')
            
            # Check if it's returning synthetic data
            if result.get('totalSamples') == 200 and 'feature1' in str(result.get('data_analysis', {})):
                print('⚠️ API is returning synthetic data, not real image data')
            else:
                print('✅ API appears to be handling image data correctly')
        else:
            print(f'Error response: {response.text}')
            
    except Exception as e:
        print(f'❌ API call error: {e}')

if __name__ == "__main__":
    test_image_dataset()
    test_image_api_call()
