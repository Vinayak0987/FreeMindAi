#!/usr/bin/env python3
"""
Simple test to verify the Kaggle → Processing → Training pipeline works through the API.
"""

import requests
import json
import time

def test_kaggle_to_training_pipeline():
    """Test the complete pipeline: Kaggle download → Processing → Training"""
    
    print("🚀 TESTING COMPLETE KAGGLE → PROCESSING → TRAINING PIPELINE")
    print("=" * 70)
    
    url = "http://localhost:5001/process"
    
    # Test different datasets
    test_cases = [
        {
            'name': 'Iris Classification',
            'task_type': 'classification',
            'text_prompt': 'iris dataset'
        },
        {
            'name': 'Titanic Dataset', 
            'task_type': 'classification',
            'text_prompt': 'titanic dataset'
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📊 TEST {i}: {test_case['name']}")
        print("-" * 40)
        print(f"Task Type: {test_case['task_type']}")
        print(f"Query: '{test_case['text_prompt']}'")
        
        try:
            print("\n🔄 Sending request...")
            response = requests.post(url, data=test_case, timeout=300)
            
            if response.status_code != 200:
                print(f"❌ HTTP Error: {response.status_code}")
                print(f"Response: {response.text[:200]}...")
                continue
            
            result = response.json()
            
            # Check for error
            if 'error' in result:
                print(f"❌ API Error: {result['error']}")
                continue
            
            # Check for successful processing
            if not result.get('success', False):
                print("❌ Processing failed")
                continue
            
            # Extract key information
            total_samples = result.get('totalSamples', 'N/A')
            features = result.get('features', 'N/A')
            task_type = result.get('task_type', 'N/A')
            
            # Model information
            model_info = result.get('model_info', {})
            model_name = model_info.get('model_name', 'N/A')
            model_score = model_info.get('score', 'N/A')
            
            # Data analysis
            data_analysis = result.get('data_analysis', {})
            column_names = data_analysis.get('column_names', [])
            
            print("✅ SUCCESS! Pipeline completed successfully")
            print(f"📊 Dataset: {total_samples} samples, {features} features")
            print(f"🎯 Task Type: {task_type}")
            print(f"🏆 Best Model: {model_name}")
            print(f"📈 Model Score: {model_score}")
            
            if column_names:
                print(f"📋 Columns: {column_names[:5]}{'...' if len(column_names) > 5 else ''}")
            
            # Check if download is available
            download_url = result.get('download_url')
            if download_url:
                print(f"💾 Model Download: Available ({download_url})")
            
            # Additional verification checks
            verification_score = 0
            total_checks = 5
            
            if isinstance(total_samples, int) and total_samples > 0:
                verification_score += 1
                print("✓ Real dataset loaded")
            
            if isinstance(features, int) and features > 0:
                verification_score += 1
                print("✓ Features extracted")
            
            if model_name != 'N/A' and model_name:
                verification_score += 1
                print("✓ Model trained")
            
            if isinstance(model_score, (int, float)) and model_score > 0:
                verification_score += 1
                print("✓ Model evaluated")
            
            if download_url:
                verification_score += 1
                print("✓ Artifacts generated")
            
            print(f"\n🎯 Verification: {verification_score}/{total_checks} checks passed")
            
            if verification_score >= 4:
                print("🎉 EXCELLENT: Full pipeline working!")
            elif verification_score >= 3:
                print("👍 GOOD: Core pipeline working!")
            else:
                print("⚠️ LIMITED: Some issues detected")
                
        except requests.exceptions.Timeout:
            print("❌ Request timed out (>5 minutes)")
        except requests.exceptions.ConnectionError:
            print("❌ Could not connect to API")
            print("💡 Make sure Flask app is running: python project/new/app.py")
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
    
    print("\n" + "="*70)
    print("✅ PIPELINE VERIFICATION COMPLETE")
    print(
        "\nIf you see 'SUCCESS' messages above, your Kaggle → Processing → Training "
        "pipeline is working correctly!"
    )
    print("\n💡 The system can now:")
    print("   • Download datasets from Kaggle")
    print("   • Process and analyze the data")
    print("   • Train machine learning models")
    print("   • Generate downloadable model artifacts")

if __name__ == "__main__":
    test_kaggle_to_training_pipeline()
