#!/usr/bin/env python3
"""
Verify if the API is returning real Iris dataset or synthetic/mock data.
The real Iris dataset should have:
- 150 samples (not 200)
- 4 features + 1 target = 5 columns total
- Specific column names: SepalLength, SepalWidth, PetalLength, PetalWidth, Species
"""

import requests
import json

def test_iris_authenticity():
    """Test if we're getting the real Iris dataset or mock data"""
    
    print("🔍 VERIFYING IRIS DATASET AUTHENTICITY")
    print("="*50)
    
    url = "http://localhost:5001/process"
    data = {
        'task_type': 'classification',
        'text_prompt': 'iris dataset'
    }
    
    print("📤 Sending request for Iris dataset...")
    
    try:
        response = requests.post(url, data=data, timeout=120)
        
        if response.status_code != 200:
            print(f"❌ HTTP Error: {response.status_code}")
            return
        
        result = response.json()
        
        if 'error' in result:
            print(f"❌ API Error: {result['error']}")
            return
        
        print("\n📊 RECEIVED DATA ANALYSIS:")
        print("-" * 30)
        
        # Check key metrics
        total_samples = result.get('totalSamples', 'N/A')
        features = result.get('features', 'N/A')
        
        print(f"Total Samples: {total_samples}")
        print(f"Features: {features}")
        
        # Real Iris dataset characteristics
        REAL_IRIS_SAMPLES = 150
        REAL_IRIS_FEATURES = 4  # + 1 target = 5 total columns
        REAL_IRIS_COLUMNS = ['Id', 'SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm', 'Species']
        
        print(f"\n🎯 AUTHENTICITY CHECK:")
        print("-" * 30)
        
        # Check sample count
        if total_samples == REAL_IRIS_SAMPLES:
            print("✅ Sample count matches real Iris dataset (150)")
            samples_authentic = True
        elif total_samples == 200:
            print("❌ Sample count is 200 - this suggests SYNTHETIC/MOCK data")
            samples_authentic = False
        else:
            print(f"⚠️ Unexpected sample count: {total_samples}")
            samples_authentic = False
        
        # Check feature count  
        if features == REAL_IRIS_FEATURES:
            print("✅ Feature count matches real Iris dataset (4 features + 1 target)")
            features_authentic = True
        elif features == 5:
            print("⚠️ 5 features could be real (4 + target) but need to check column names")
            features_authentic = None
        else:
            print(f"❌ Unexpected feature count: {features}")
            features_authentic = False
        
        # Check column names if available
        data_analysis = result.get('data_analysis', {})
        column_names = data_analysis.get('column_names', [])
        
        print(f"\nColumn names received: {column_names}")
        
        if column_names:
            # Check if we have real Iris column names
            iris_like_columns = any(
                'sepal' in col.lower() or 'petal' in col.lower() or 'species' in col.lower() 
                for col in column_names
            )
            
            generic_columns = all(
                col.lower() in ['feature1', 'feature2', 'feature3', 'feature4', 'target']
                for col in column_names
            )
            
            if iris_like_columns:
                print("✅ Column names suggest REAL Iris dataset")
                columns_authentic = True
            elif generic_columns:
                print("❌ Generic column names suggest SYNTHETIC/MOCK data")
                columns_authentic = False
            else:
                print("⚠️ Unknown column pattern")
                columns_authentic = None
        else:
            print("⚠️ No column names available for verification")
            columns_authentic = None
        
        # Final verdict
        print(f"\n🏁 FINAL VERDICT:")
        print("-" * 30)
        
        authentic_indicators = [samples_authentic, features_authentic, columns_authentic]
        authentic_count = sum(1 for x in authentic_indicators if x is True)
        mock_count = sum(1 for x in authentic_indicators if x is False)
        
        if samples_authentic is False or columns_authentic is False:
            print("❌ CONCLUSION: This appears to be SYNTHETIC/MOCK data")
            print("💡 The system is generating fake data instead of using real Iris dataset")
            print("\nReasons:")
            if not samples_authentic:
                print("  • Sample count is 200 instead of 150 (real Iris has 150)")
            if columns_authentic is False:
                print("  • Column names are generic (feature1, feature2, etc.) instead of Iris-specific names")
        elif authentic_count >= 2:
            print("✅ CONCLUSION: This appears to be REAL Iris data")
            print("🎉 The system successfully downloaded and processed the actual dataset")
        else:
            print("⚠️ CONCLUSION: Inconclusive - mixed indicators")
        
        # Additional debugging info
        print(f"\n🔧 DEBUGGING INFO:")
        print(f"  • Processing success: {result.get('success', False)}")
        print(f"  • Message: {result.get('message', 'N/A')}")
        print(f"  • Task type: {result.get('task_type', 'N/A')}")
        
        model_info = result.get('model_info', {})
        print(f"  • Model: {model_info.get('model_name', 'N/A')}")
        print(f"  • Score: {model_info.get('score', 'N/A')}")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API - make sure Flask app is running")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_iris_authenticity()
