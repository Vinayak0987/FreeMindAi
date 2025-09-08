#!/usr/bin/env python3
"""
Fixed Image Recognition Test - Using Correct API Parameters

This test uses the correct API parameters to test image classification.
"""

import requests
import json
import time
import os
import shutil
import zipfile
import tempfile
from datetime import datetime
from PIL import Image, ImageDraw

class FixedImageTester:
    def __init__(self, base_url="http://localhost:5001"):
        self.base_url = base_url
        
    def log(self, message, level="INFO"):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
    
    def create_simple_dataset(self):
        """Create a very simple image dataset"""
        temp_dir = tempfile.mkdtemp()
        
        # Create directory structure
        train_dir = os.path.join(temp_dir, 'training')
        os.makedirs(os.path.join(train_dir, 'class_a'), exist_ok=True)
        os.makedirs(os.path.join(train_dir, 'class_b'), exist_ok=True)
        
        # Create simple images
        for i in range(3):
            # Class A - blue squares
            img = Image.new('RGB', (32, 32), 'white')
            draw = ImageDraw.Draw(img)
            draw.rectangle([8, 8, 24, 24], fill='blue')
            img.save(os.path.join(train_dir, 'class_a', f'img_{i}.png'))
            
            # Class B - red circles
            img = Image.new('RGB', (32, 32), 'white')
            draw = ImageDraw.Draw(img)
            draw.ellipse([8, 8, 24, 24], fill='red')
            img.save(os.path.join(train_dir, 'class_b', f'img_{i}.png'))
        
        # Create zip
        zip_path = os.path.join(temp_dir, 'dataset.zip')
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for root, dirs, files in os.walk(train_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, temp_dir)
                    zipf.write(file_path, arcname)
        
        return zip_path
    
    def test_image_upload(self):
        """Test image upload with correct API parameters"""
        self.log("🚀 Testing image upload with correct parameters...")
        
        zip_path = self.create_simple_dataset()
        
        try:
            with open(zip_path, 'rb') as f:
                # Use the correct key: 'folder_zip' (from the Flask app code)
                files = {'folder_zip': ('dataset.zip', f, 'application/zip')}
                data = {'task_type': 'image_classification'}
                
                self.log("📤 Uploading with folder_zip key...")
                response = requests.post(
                    f"{self.base_url}/process", 
                    files=files,
                    data=data,
                    timeout=120
                )
                
                self.log(f"📥 Response status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    success = result.get('success', False)
                    task_type = result.get('detected_task_type', 'N/A')
                    model_info = result.get('model_info', {})
                    
                    self.log("✅ Upload successful!")
                    self.log(f"   Success: {success}")
                    self.log(f"   Task Type: {task_type}")
                    self.log(f"   Model: {model_info.get('model_name', 'N/A')}")
                    self.log(f"   Score: {model_info.get('score', 'N/A')}")
                    
                    return success and task_type == 'image_classification'
                else:
                    self.log(f"❌ Upload failed: {response.text}", "ERROR")
                    return False
                    
        except Exception as e:
            self.log(f"❌ Test error: {e}", "ERROR")
            return False
        finally:
            # Cleanup
            try:
                shutil.rmtree(os.path.dirname(zip_path))
            except:
                pass
    
    def test_text_prompt_image(self):
        """Test text prompt for image datasets"""
        self.log("🔍 Testing text prompt for image datasets...")
        
        # Try different image dataset prompts
        prompts = [
            "flowers classification dataset",
            "image classification simple dataset",
            "cats and dogs images"
        ]
        
        for prompt in prompts:
            self.log(f"Testing prompt: '{prompt}'")
            
            try:
                data = {
                    'task_type': 'image_classification',
                    'text_prompt': prompt
                }
                
                response = requests.post(
                    f"{self.base_url}/process",
                    data=data,
                    timeout=90
                )
                
                if response.status_code == 200:
                    result = response.json()
                    success = result.get('success', False)
                    task_type = result.get('detected_task_type', 'N/A')
                    samples = result.get('totalSamples', 'N/A')
                    
                    self.log(f"  Result: Success={success}, Type={task_type}, Samples={samples}")
                    
                    if success and task_type == 'image_classification':
                        self.log(f"✅ Found working prompt: '{prompt}'")
                        return True
                else:
                    self.log(f"  ❌ HTTP {response.status_code}")
                    
            except Exception as e:
                self.log(f"  ❌ Error: {e}")
        
        return False
    
    def run_tests(self):
        """Run all tests"""
        self.log("🖼️ Starting Fixed Image Recognition Tests")
        self.log("=" * 50)
        
        # Test 1: File upload
        upload_success = self.test_image_upload()
        
        # Test 2: Text prompts (if upload fails)
        prompt_success = False
        if not upload_success:
            self.log("⚠️ Upload test failed, trying text prompts...")
            prompt_success = self.test_text_prompt_image()
        
        # Final results
        self.log("=" * 50)
        self.log("🎯 TEST RESULTS:")
        self.log(f"   File Upload: {'✅ PASS' if upload_success else '❌ FAIL'}")
        self.log(f"   Text Prompts: {'✅ PASS' if prompt_success else '❌ FAIL'}")
        
        overall_success = upload_success or prompt_success
        
        if overall_success:
            self.log("🏆 OVERALL: ✅ IMAGE RECOGNITION WORKING")
            self.log("   At least one method works correctly")
        else:
            self.log("🚨 OVERALL: ❌ ISSUES DETECTED")
            self.log("   Neither upload nor text prompts work correctly")
        
        return overall_success

def main():
    """Main test function"""
    print("🖼️ FreeMindAi Fixed Image Recognition Test")
    print("=" * 50)
    
    # Check if PIL is available
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        print("❌ PIL (Pillow) not available. Installing...")
        import subprocess
        subprocess.check_call(['pip', 'install', 'Pillow'])
    
    tester = FixedImageTester()
    
    try:
        success = tester.run_tests()
        
        if success:
            print("\n🎉 IMAGE RECOGNITION TEST PASSED!")
            print("Your image recognition pipeline is working.")
        else:
            print("\n⚠️ IMAGE RECOGNITION TEST FAILED")
            print("There are issues with the image recognition pipeline.")
            
    except KeyboardInterrupt:
        print("\n⏹️ Test interrupted by user")
    except Exception as e:
        print(f"\n💥 Test error: {e}")

if __name__ == "__main__":
    main()
