#!/usr/bin/env python3
"""
Comprehensive test to verify the complete Kaggle → Processing → Training pipeline.

This script tests:
1. Kaggle API connectivity and dataset fetching
2. Dataset processing and task type detection  
3. Model training on the processed data
4. End-to-end pipeline through the Flask API
"""

import os
import sys
import pandas as pd
import tempfile
import json
import requests
from pathlib import Path

# Add the project directory to Python path
project_dir = Path(__file__).parent / "project" / "new"
sys.path.insert(0, str(project_dir))

def test_kaggle_connectivity():
    """Test 1: Check if Kaggle API is properly configured"""
    print("="*60)
    print("TEST 1: KAGGLE API CONNECTIVITY")
    print("="*60)
    
    try:
        # Try to import Kaggle API
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        
        # Test authentication
        try:
            api.authenticate()
            print("✅ Kaggle API authentication successful")
            
            # Test a simple API call
            datasets = api.dataset_list(search="iris")
            if datasets:
                print(f"✅ Kaggle API call successful - found dataset: {datasets[0].ref}")
                return True, api
            else:
                print("⚠️ Kaggle API call successful but no datasets found")
                return True, api
                
        except Exception as auth_error:
            print(f"❌ Kaggle authentication failed: {auth_error}")
            print("💡 Make sure you have kaggle.json in ~/.kaggle/ or set KAGGLE_USERNAME/KAGGLE_KEY")
            return False, None
            
    except ImportError:
        print("❌ Kaggle API not installed")
        print("💡 Install with: pip install kaggle")
        return False, None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False, None

def test_kaggle_dataset_download():
    """Test 2: Download a small dataset from Kaggle"""
    print("\n" + "="*60)
    print("TEST 2: KAGGLE DATASET DOWNLOAD")
    print("="*60)
    
    try:
        # Import the data handling module
        from data_handling import download_kaggle_dataset
        
        # Create a temporary directory for testing
        with tempfile.TemporaryDirectory() as temp_dir:
            print(f"Testing Kaggle download to: {temp_dir}")
            
            # Try to download a small, popular dataset
            test_queries = [
                "iris",
                "titanic", 
                "mushroom"
            ]
            
            for query in test_queries:
                print(f"\n🔍 Trying to download dataset for query: '{query}'")
                
                result = download_kaggle_dataset(query, temp_dir)
                
                if isinstance(result, tuple) and len(result) == 2:
                    file_path, task_type = result
                    if file_path and os.path.exists(file_path):
                        # Check if file is a valid CSV
                        try:
                            df = pd.read_csv(file_path)
                            print(f"✅ Successfully downloaded and loaded dataset!")
                            print(f"   📁 File: {file_path}")
                            print(f"   📊 Shape: {df.shape}")
                            print(f"   🎯 Detected task type: {task_type}")
                            print(f"   📋 Columns: {list(df.columns)}")
                            return True, file_path, df, task_type
                        except Exception as csv_error:
                            print(f"⚠️ Downloaded file but couldn't read as CSV: {csv_error}")
                    else:
                        print(f"⚠️ Download returned path but file doesn't exist: {file_path}")
                else:
                    print(f"⚠️ Download failed or returned unexpected format for '{query}'")
            
            print("❌ Could not download any test dataset from Kaggle")
            return False, None, None, None
            
    except Exception as e:
        print(f"❌ Error in dataset download test: {e}")
        return False, None, None, None

def test_dataset_processing(file_path, task_type):
    """Test 3: Process the downloaded dataset"""
    print("\n" + "="*60)
    print("TEST 3: DATASET PROCESSING")
    print("="*60)
    
    try:
        from data_handling import auto_detect_task_type
        from preprocessing import preprocess_dataset
        
        # Test auto-detection
        print(f"🔍 Testing auto-detection on: {file_path}")
        detected_task_type, df = auto_detect_task_type(file_path)
        
        print(f"✅ Auto-detection successful!")
        print(f"   🎯 Detected task type: {detected_task_type}")
        print(f"   📊 Dataset shape: {df.shape}")
        print(f"   📋 Columns: {list(df.columns)}")
        
        # Test preprocessing
        print(f"\n🔄 Testing preprocessing for task type: {detected_task_type}")
        
        X_train, X_test, y_train, y_test, preprocessor, feature_names = preprocess_dataset(
            df, detected_task_type
        )
        
        print(f"✅ Preprocessing successful!")
        print(f"   🏋️ Training set shape: X={X_train.shape}, y={y_train.shape}")
        print(f"   🧪 Test set shape: X={X_test.shape}, y={y_test.shape}")
        print(f"   🏷️ Feature names: {len(feature_names) if feature_names else 0} features")
        
        return True, detected_task_type, X_train, X_test, y_train, y_test
        
    except Exception as e:
        print(f"❌ Error in dataset processing: {e}")
        import traceback
        traceback.print_exc()
        return False, None, None, None, None, None

def test_model_training(X_train, X_test, y_train, y_test, task_type):
    """Test 4: Train a model on the processed data"""
    print("\n" + "="*60)
    print("TEST 4: MODEL TRAINING")
    print("="*60)
    
    try:
        from model_training import train_models
        
        # Create a temporary models directory
        with tempfile.TemporaryDirectory() as temp_models_dir:
            print(f"🏋️ Training models for task type: {task_type}")
            print(f"   📁 Models directory: {temp_models_dir}")
            
            # Train models
            best_model, best_model_name, best_score, y_pred = train_models(
                X_train, y_train, X_test, y_test, task_type, temp_models_dir
            )
            
            if best_model is not None:
                print(f"✅ Model training successful!")
                print(f"   🏆 Best model: {best_model_name}")
                print(f"   📈 Best score: {best_score:.4f}")
                print(f"   🎯 Predictions shape: {y_pred.shape if y_pred is not None else 'None'}")
                
                # Check if model was saved
                import os
                saved_files = os.listdir(temp_models_dir)
                print(f"   💾 Saved files: {saved_files}")
                
                return True, best_model, best_model_name, best_score
            else:
                print("❌ Model training failed - no model returned")
                return False, None, None, None
                
    except Exception as e:
        print(f"❌ Error in model training: {e}")
        import traceback
        traceback.print_exc()
        return False, None, None, None

def test_end_to_end_api():
    """Test 5: End-to-end test through Flask API"""
    print("\n" + "="*60)
    print("TEST 5: END-TO-END API TEST")
    print("="*60)
    
    url = "http://localhost:5001/process"
    
    # Test with a Kaggle query
    data = {
        'task_type': 'classification',
        'text_prompt': 'iris dataset'  # Popular dataset that should work
    }
    
    print(f"🌐 Testing API endpoint: {url}")
    print(f"📤 Request data: {data}")
    
    try:
        response = requests.post(url, data=data, timeout=300)  # 5 minute timeout
        
        if response.status_code == 200:
            result = response.json()
            
            print("✅ API request successful!")
            
            if 'error' in result:
                print(f"❌ API returned error: {result['error']}")
                return False
            
            # Check for successful processing indicators
            success_indicators = [
                result.get('success', False),
                'data_analysis' in result,
                'model_info' in result
            ]
            
            if all(success_indicators):
                print("✅ End-to-end pipeline successful!")
                print(f"   📊 Total samples: {result.get('totalSamples', 'N/A')}")
                print(f"   🔧 Features: {result.get('features', 'N/A')}")
                print(f"   🎯 Task type: {result.get('task_type', 'N/A')}")
                print(f"   🏆 Model: {result.get('model_info', {}).get('model_name', 'N/A')}")
                print(f"   📈 Score: {result.get('model_info', {}).get('score', 'N/A')}")
                
                # Check if download URL is provided
                if 'download_url' in result:
                    print(f"   💾 Download available: {result['download_url']}")
                
                return True
            else:
                print(f"❌ Missing success indicators: {success_indicators}")
                print(f"📋 Response keys: {list(result.keys())}")
                return False
        else:
            print(f"❌ HTTP error: {response.status_code}")
            print(f"📤 Response: {response.text[:500]}...")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to Flask API")
        print("💡 Make sure the Flask app is running: python project/new/app.py")
        return False
    except requests.exceptions.Timeout:
        print("❌ API request timed out (>5 minutes)")
        print("💡 This might indicate an issue with the processing pipeline")
        return False
    except Exception as e:
        print(f"❌ Unexpected error in API test: {e}")
        return False

def main():
    """Run all tests in sequence"""
    print("🚀 KAGGLE → PROCESSING → TRAINING PIPELINE TEST")
    print("=" * 80)
    
    results = []
    
    # Test 1: Kaggle connectivity
    kaggle_ok, api = test_kaggle_connectivity()
    results.append(("Kaggle API Connectivity", kaggle_ok))
    
    if not kaggle_ok:
        print("\n❌ Kaggle API not working - skipping dataset tests")
        print("💡 Fix Kaggle configuration first, then re-run this test")
    else:
        # Test 2: Download dataset  
        download_ok, file_path, df, task_type = test_kaggle_dataset_download()
        results.append(("Kaggle Dataset Download", download_ok))
        
        if download_ok:
            # Test 3: Process dataset
            process_ok, detected_task_type, X_train, X_test, y_train, y_test = test_dataset_processing(file_path, task_type)
            results.append(("Dataset Processing", process_ok))
            
            if process_ok:
                # Test 4: Train model
                train_ok, best_model, best_model_name, best_score = test_model_training(
                    X_train, X_test, y_train, y_test, detected_task_type
                )
                results.append(("Model Training", train_ok))
    
    # Test 5: End-to-end API test (independent)
    api_ok = test_end_to_end_api()
    results.append(("End-to-End API", api_ok))
    
    # Summary
    print("\n" + "="*80)
    print("🎯 TEST RESULTS SUMMARY")
    print("="*80)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:.<40} {status}")
        if result:
            passed += 1
    
    print(f"\n📊 Overall Result: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("🎉 ALL TESTS PASSED! The Kaggle → Processing → Training pipeline is working!")
    elif passed > 0:
        print("⚠️ PARTIAL SUCCESS - Some components are working, check failed tests above")
    else:
        print("❌ ALL TESTS FAILED - Major issues with the pipeline")
    
    # Recommendations
    print("\n💡 RECOMMENDATIONS:")
    
    if not results[0][1]:  # Kaggle API failed
        print("   • Fix Kaggle API configuration (kaggle.json or environment variables)")
        print("   • Install Kaggle: pip install kaggle")
    
    if results[0][1] and not results[1][1]:  # Kaggle works but download fails
        print("   • Check internet connection")
        print("   • Verify Kaggle dataset permissions")
    
    if len(results) > 2 and results[1][1] and not results[2][1]:  # Download works but processing fails
        print("   • Check data_handling.py and preprocessing.py for errors")
        print("   • Verify database integration")
    
    if len(results) > 3 and results[2][1] and not results[3][1]:  # Processing works but training fails
        print("   • Check model_training.py for errors")
        print("   • Verify scikit-learn installation")
    
    if results[-1][1] == False:  # API test failed
        print("   • Make sure Flask app is running: python project/new/app.py")
        print("   • Check port 5001 is not blocked")
    
    return passed == len(results)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
