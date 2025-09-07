#!/usr/bin/env python3
"""
Debug script to trace why the API is getting synthetic data instead of real Kaggle data.
"""

import sys
import os
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent / "project" / "new"
sys.path.insert(0, str(project_dir))

from data_handling import download_kaggle_dataset
import tempfile
import pandas as pd
import requests

def debug_kaggle_download():
    """Debug the Kaggle download process step by step"""
    
    print("🔍 DEBUGGING KAGGLE DOWNLOAD PROCESS")
    print("=" * 50)
    
    # Test 1: Direct function call with persistent directory
    datasets_dir = os.path.join(os.path.dirname(__file__), "debug_datasets")
    os.makedirs(datasets_dir, exist_ok=True)
    
    print(f"\n📁 Step 1: Testing download to persistent directory")
    print(f"   Directory: {datasets_dir}")
    
    result = download_kaggle_dataset('iris', datasets_dir)
    print(f"   Result: {result}")
    
    if result and isinstance(result, tuple) and len(result) == 2:
        file_path, task_type = result
        print(f"   File path: {file_path}")
        print(f"   Task type: {task_type}")
        print(f"   File exists: {os.path.exists(file_path) if file_path else False}")
        
        if file_path and os.path.exists(file_path):
            df = pd.read_csv(file_path)
            print(f"   Real data shape: {df.shape}")
            print(f"   Real columns: {list(df.columns)}")
            print(f"   ✅ SUCCESS: Real Iris data downloaded to persistent location")
        else:
            print(f"   ❌ FAILURE: File doesn't exist at specified path")
    else:
        print(f"   ❌ FAILURE: Download returned unexpected result")
    
    # Test 2: API request simulation
    print(f"\n📁 Step 2: Testing API request simulation")
    
    # Simulate the exact API call flow
    text_prompt = 'iris dataset'
    DATASETS_DIR = "ml_system/datasets"
    os.makedirs(DATASETS_DIR, exist_ok=True)
    
    print(f"   API datasets dir: {DATASETS_DIR}")
    
    # Clear the directory like the API does
    if os.path.exists(DATASETS_DIR):
        for f in os.listdir(DATASETS_DIR):
            try:
                os.remove(os.path.join(DATASETS_DIR, f))
            except:
                pass
    
    # Try Kaggle download like the API does
    kaggle_result = download_kaggle_dataset(text_prompt, DATASETS_DIR)
    
    print(f"   API Kaggle result: {kaggle_result}")
    
    if isinstance(kaggle_result, tuple) and len(kaggle_result) == 2:
        kaggle_file, detected_task_type = kaggle_result
        print(f"   Kaggle file: {kaggle_file}")
        print(f"   Detected type: {detected_task_type}")
        print(f"   File exists: {os.path.exists(kaggle_file) if kaggle_file else False}")
        
        if kaggle_file and os.path.exists(kaggle_file):
            print(f"   ✅ API would get REAL data")
            df = pd.read_csv(kaggle_file)
            print(f"   Data shape: {df.shape}")
            print(f"   Columns: {list(df.columns)}")
        else:
            print(f"   ❌ API would fallback to synthetic data")
    else:
        print(f"   ❌ API would fallback to synthetic data (invalid result)")
    
    # Test 3: What files are actually in the datasets directory?
    print(f"\n📁 Step 3: Checking what's in the datasets directory")
    if os.path.exists(DATASETS_DIR):
        files = os.listdir(DATASETS_DIR)
        print(f"   Files in {DATASETS_DIR}: {files}")
        
        for f in files:
            full_path = os.path.join(DATASETS_DIR, f)
            if f.lower().endswith('.csv'):
                try:
                    df = pd.read_csv(full_path)
                    print(f"   {f}: {df.shape} - {list(df.columns)}")
                except Exception as e:
                    print(f"   {f}: Error reading - {e}")
    else:
        print(f"   Directory doesn't exist: {DATASETS_DIR}")

def test_actual_api_call():
    """Test the actual API to see what it returns"""
    
    print(f"\n🌐 Step 4: Testing actual API call")
    print("-" * 30)
    
    url = "http://localhost:5001/process"
    data = {
        'task_type': 'classification',
        'text_prompt': 'iris dataset'
    }
    
    try:
        response = requests.post(url, data=data, timeout=120)
        
        if response.status_code == 200:
            result = response.json()
            
            total_samples = result.get('totalSamples', 'N/A')
            features = result.get('features', 'N/A')
            data_analysis = result.get('data_analysis', {})
            column_names = data_analysis.get('column_names', [])
            
            print(f"   API Response:")
            print(f"   - Samples: {total_samples}")
            print(f"   - Features: {features}")
            print(f"   - Columns: {column_names}")
            print(f"   - Success: {result.get('success', False)}")
            print(f"   - Message: {result.get('message', 'N/A')}")
            
            # Determine if this is real or synthetic data
            if total_samples == 150 and 'sepal' in str(column_names).lower():
                print(f"   ✅ API returned REAL Iris data")
            elif total_samples == 200 and column_names == ['feature1', 'feature2', 'feature3', 'feature4', 'target']:
                print(f"   ❌ API returned SYNTHETIC data")
            else:
                print(f"   ⚠️ API returned unknown data format")
                
        else:
            print(f"   ❌ HTTP Error: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    debug_kaggle_download()
    test_actual_api_call()
    print(f"\n🎯 SUMMARY:")
    print(f"   If Step 1 shows real data but API returns synthetic data,")
    print(f"   then there's a disconnect in the API logic flow.")
