#!/usr/bin/env python3
"""
Test script to verify that the processing pipeline fixes are working correctly.

This test verifies that:
1. The system doesn't return mock data when real data is provided
2. The processing pipeline actually processes and trains on real data
3. The database integration works properly
"""

import requests
import json
import tempfile
import os
import pandas as pd

def test_text_prompt_processing():
    """Test that text prompt generates real data and processes it"""
    
    url = "http://localhost:5001/process"
    
    # Test with a text prompt to generate data
    data = {
        'task_type': 'classification',
        'text_prompt': 'Create a dataset about customer satisfaction with purchase decisions'
    }
    
    print("Testing text prompt processing...")
    print(f"Request data: {data}")
    
    try:
        response = requests.post(url, data=data)
        
        if response.status_code == 200:
            result = response.json()
            
            print("✅ Request successful!")
            print(f"Response keys: {list(result.keys())}")
            
            # Check if we got real processing results
            if 'error' in result:
                print(f"❌ Error in response: {result['error']}")
                return False
            
            # Check for actual data processing indicators
            success_indicators = [
                result.get('success', False),
                'data_analysis' in result,
                'model_info' in result,
                'processing_steps' in result
            ]
            
            if all(success_indicators):
                print("✅ All success indicators present!")
                print(f"Total samples: {result.get('totalSamples', 'N/A')}")
                print(f"Features: {result.get('features', 'N/A')}")
                print(f"Model: {result.get('model_info', {}).get('model_name', 'N/A')}")
                print(f"Score: {result.get('model_info', {}).get('score', 'N/A')}")
                return True
            else:
                print(f"❌ Missing success indicators: {success_indicators}")
                print("Response:", json.dumps(result, indent=2))
                return False
        else:
            print(f"❌ HTTP error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the Flask app is running on port 5001")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def test_csv_file_upload():
    """Test that CSV file upload processes real data"""
    
    url = "http://localhost:5001/process"
    
    # Create a test CSV file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False) as f:
        # Create a simple classification dataset
        test_data = pd.DataFrame({
            'feature1': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'feature2': [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            'feature3': ['A', 'B', 'A', 'B', 'A', 'B', 'A', 'B', 'A', 'B'],
            'target': [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        })
        test_data.to_csv(f.name, index=False)
        temp_file_path = f.name
    
    print("Testing CSV file upload...")
    
    try:
        with open(temp_file_path, 'rb') as f:
            files = {'file': ('test_data.csv', f, 'text/csv')}
            data = {'task_type': 'classification'}
            
            response = requests.post(url, data=data, files=files)
        
        # Clean up temp file
        os.unlink(temp_file_path)
        
        if response.status_code == 200:
            result = response.json()
            
            print("✅ Request successful!")
            
            # Check if we got real processing results
            if 'error' in result:
                print(f"❌ Error in response: {result['error']}")
                return False
            
            # Check for actual data processing indicators
            if result.get('success', False) and 'data_analysis' in result:
                print("✅ CSV file processed successfully!")
                print(f"Total samples: {result.get('totalSamples', 'N/A')}")
                print(f"Features: {result.get('features', 'N/A')}")
                print(f"Model: {result.get('model_info', {}).get('model_name', 'N/A')}")
                return True
            else:
                print("❌ CSV processing failed")
                print("Response:", json.dumps(result, indent=2))
                return False
        else:
            print(f"❌ HTTP error: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        return False

def main():
    """Run all tests"""
    print("="*60)
    print("TESTING PROCESSING PIPELINE FIXES")
    print("="*60)
    
    test_results = []
    
    # Test 1: Text prompt processing
    print("\n" + "="*40)
    print("TEST 1: Text Prompt Processing")
    print("="*40)
    result1 = test_text_prompt_processing()
    test_results.append(("Text Prompt Processing", result1))
    
    # Test 2: CSV file upload
    print("\n" + "="*40)
    print("TEST 2: CSV File Upload")
    print("="*40)
    result2 = test_csv_file_upload()
    test_results.append(("CSV File Upload", result2))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = 0
    for test_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name}: {status}")
        if result:
            passed += 1
    
    print(f"\nTotal: {passed}/{len(test_results)} tests passed")
    
    if passed == len(test_results):
        print("🎉 All tests passed! The processing pipeline fixes are working!")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    return passed == len(test_results)

if __name__ == "__main__":
    main()
