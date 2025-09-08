#!/usr/bin/env python3
"""
Complete Image Recognition Test Case - Web Interface Testing

This script tests the entire image recognition pipeline through the web interface:
1. Dataset download from Kaggle
2. Image preprocessing 
3. CNN model training
4. Model evaluation
5. Deployment and prediction testing

Author: FreeMindAi Test Suite
"""

import requests
import json
import time
import os
from datetime import datetime

class ImageRecognitionTester:
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
        self.test_results = {}
        
    def log(self, message, level="INFO"):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_server_connection(self):
        """Test 1: Check if server is running"""
        self.log("🔌 Testing server connection...")
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            if response.status_code in [200, 404]:  # 404 is ok, means server is running
                self.log("✅ Server is running", "SUCCESS")
                return True
            else:
                self.log(f"❌ Server returned status {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Cannot connect to server: {e}", "ERROR")
            return False
            
    def test_image_classification_pipeline(self):
        """Test 2: Complete image classification pipeline"""
        self.log("🖼️ Testing image classification pipeline...")
        
        # Test data for image classification
        test_data = {
            'task_type': 'image_classification',
            'text_prompt': 'intel image classification dataset'  # Known good dataset
        }
        
        try:
            self.log("📤 Sending request to /process endpoint...")
            self.log(f"Request data: {test_data}")
            
            # Send request with longer timeout for image processing
            response = requests.post(
                f"{self.base_url}/process", 
                data=test_data, 
                timeout=300  # 5 minutes timeout for full pipeline
            )
            
            self.log(f"📥 Response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                self.log("✅ Pipeline completed successfully", "SUCCESS")
                
                # Analyze results
                self.analyze_image_results(result)
                return True
                
            else:
                self.log(f"❌ Request failed with status {response.status_code}", "ERROR")
                self.log(f"Response: {response.text}")
                return False
                
        except requests.exceptions.Timeout:
            self.log("❌ Request timed out (>5 minutes)", "ERROR")
            return False
        except Exception as e:
            self.log(f"❌ Request failed: {e}", "ERROR")
            return False
    
    def analyze_image_results(self, result):
        """Analyze the results from image classification"""
        self.log("📊 Analyzing image classification results...")
        
        # Check key metrics
        success = result.get('success', False)
        total_samples = result.get('totalSamples', 'N/A')
        features = result.get('features', 'N/A')
        best_model = result.get('best_model', 'N/A')
        best_score = result.get('best_score', 'N/A')
        task_type = result.get('task_type', 'N/A')
        message = result.get('message', 'N/A')
        
        # Display results
        self.log("=" * 50)
        self.log("📈 IMAGE RECOGNITION RESULTS")
        self.log("=" * 50)
        self.log(f"✅ Success: {success}")
        self.log(f"🎯 Task Type: {task_type}")
        self.log(f"📊 Total Samples: {total_samples}")
        self.log(f"🔢 Features: {features}")
        self.log(f"🏆 Best Model: {best_model}")
        self.log(f"📈 Best Score: {best_score}")
        self.log(f"💬 Message: {message}")
        self.log("=" * 50)
        
        # Check for image-specific results
        if 'data_analysis' in result:
            data_analysis = result['data_analysis']
            self.log("🔍 Data Analysis:")
            for key, value in data_analysis.items():
                self.log(f"  {key}: {value}")
                
        # Store results for summary
        self.test_results['image_classification'] = {
            'success': success,
            'model': best_model,
            'score': best_score,
            'samples': total_samples,
            'task_type': task_type
        }
        
        # Validate results
        if success and best_model != 'N/A':
            self.log("✅ Image classification pipeline working correctly", "SUCCESS")
        else:
            self.log("❌ Image classification pipeline has issues", "ERROR")
    
    def test_different_image_datasets(self):
        """Test 3: Try different image datasets"""
        self.log("🎨 Testing different image datasets...")
        
        datasets_to_test = [
            "flowers recognition",
            "asl alphabet", 
            "gender classification"
        ]
        
        for dataset in datasets_to_test:
            self.log(f"Testing dataset: {dataset}")
            
            test_data = {
                'task_type': 'image_classification',
                'text_prompt': dataset
            }
            
            try:
                response = requests.post(
                    f"{self.base_url}/process", 
                    data=test_data, 
                    timeout=180  # 3 minutes per dataset
                )
                
                if response.status_code == 200:
                    result = response.json()
                    success = result.get('success', False)
                    model = result.get('best_model', 'N/A')
                    score = result.get('best_score', 'N/A')
                    
                    self.log(f"  ✅ {dataset}: Success={success}, Model={model}, Score={score}")
                else:
                    self.log(f"  ❌ {dataset}: Failed with status {response.status_code}")
                    
            except requests.exceptions.Timeout:
                self.log(f"  ⏰ {dataset}: Timed out")
            except Exception as e:
                self.log(f"  ❌ {dataset}: Error - {e}")
                
    def test_model_deployment(self):
        """Test 4: Test model deployment and prediction endpoints"""
        self.log("🚀 Testing model deployment...")
        
        # Check if there are any saved models we can test predictions with
        # This would typically involve testing prediction endpoints
        
        try:
            # Test a prediction endpoint if it exists
            prediction_data = {
                'action': 'predict',
                'model_type': 'image_classification'
            }
            
            response = requests.post(
                f"{self.base_url}/predict", 
                data=prediction_data, 
                timeout=30
            )
            
            if response.status_code == 200:
                self.log("✅ Prediction endpoint working", "SUCCESS")
            elif response.status_code == 404:
                self.log("ℹ️ Prediction endpoint not implemented yet", "INFO")
            else:
                self.log(f"⚠️ Prediction endpoint returned {response.status_code}", "WARNING")
                
        except requests.exceptions.ConnectionError:
            self.log("ℹ️ Prediction endpoint not available", "INFO")
        except Exception as e:
            self.log(f"⚠️ Prediction test error: {e}", "WARNING")
    
    def generate_test_report(self):
        """Generate final test report"""
        self.log("📋 Generating test report...")
        self.log("=" * 60)
        self.log("🎯 IMAGE RECOGNITION PIPELINE TEST REPORT")
        self.log("=" * 60)
        
        if 'image_classification' in self.test_results:
            result = self.test_results['image_classification']
            self.log(f"📊 Classification Test:")
            self.log(f"  Success: {result['success']}")
            self.log(f"  Best Model: {result['model']}")
            self.log(f"  Score: {result['score']}")
            self.log(f"  Samples: {result['samples']}")
            self.log(f"  Task Type: {result['task_type']}")
            
            if result['success'] and result['model'] != 'N/A':
                self.log("🏆 OVERALL STATUS: ✅ PIPELINE WORKING", "SUCCESS")
            else:
                self.log("🚨 OVERALL STATUS: ❌ PIPELINE ISSUES", "ERROR")
        else:
            self.log("🚨 OVERALL STATUS: ❌ NO RESULTS", "ERROR")
            
        self.log("=" * 60)
    
    def run_complete_test(self):
        """Run all tests in sequence"""
        self.log("🚀 Starting Complete Image Recognition Test Suite")
        self.log("=" * 60)
        
        # Test 1: Server Connection
        if not self.test_server_connection():
            self.log("🚨 Server not available. Cannot continue tests.", "CRITICAL")
            return False
            
        # Test 2: Main Image Classification Pipeline
        self.log("⏳ Running main image classification test (this may take several minutes)...")
        success = self.test_image_classification_pipeline()
        
        # Test 3: Additional datasets (optional - comment out if too slow)
        # self.test_different_image_datasets()
        
        # Test 4: Deployment testing
        self.test_model_deployment()
        
        # Generate report
        self.generate_test_report()
        
        return success

def main():
    """Main test function"""
    print("🖼️ FreeMindAi Image Recognition Test Suite")
    print("==========================================")
    
    tester = ImageRecognitionTester()
    
    try:
        success = tester.run_complete_test()
        
        if success:
            print("\n🎉 Test completed successfully!")
            print("Your image recognition pipeline is working correctly.")
        else:
            print("\n⚠️ Test completed with issues.")
            print("Please check the logs above for details.")
            
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Test suite error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
