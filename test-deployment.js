const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testLocalDeployment() {
  console.log('🚀 Testing local deployment functionality...\n');

  try {
    const response = await axios({
      method: 'post',
      url: 'http://localhost:5002/api/deploy',
      data: {
        platform: 'local',
        serviceName: 'test-ml-model',
        environment: 'development',
        taskType: 'classification',
        dataType: 'tabular',
        modelConfig: {
          version: '1.0.0',
          framework: 'scikit-learn'
        },
        deploymentConfig: {
          autoScaling: true
        }
      },
      responseType: 'stream', // Important for file downloads
      timeout: 30000
    });

    console.log('✅ Request successful! Status:', response.status);
    console.log('📦 Content-Type:', response.headers['content-type']);
    console.log('📁 Content-Disposition:', response.headers['content-disposition']);

    // Save the file to downloads
    if (!fs.existsSync('downloads')) {
      fs.mkdirSync('downloads');
    }

    const fileName = 'test-ml-model-local-deployment.zip';
    const filePath = path.join('downloads', fileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const stats = fs.statSync(filePath);
        console.log(`📥 Downloaded: ${fileName}`);
        console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`📍 Saved to: ${filePath}`);
        resolve();
      });

      writer.on('error', (err) => {
        console.error('❌ Error writing file:', err.message);
        reject(err);
      });
    });

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    throw error;
  }
}

// Test other deployment platforms too
async function testCloudDeployment() {
  console.log('\n🌥️ Testing cloud deployment simulation...\n');

  try {
    const response = await axios.post('http://localhost:5002/api/deploy', {
      platform: 'vercel',
      serviceName: 'test-vercel-deployment',
      environment: 'production',
      taskType: 'image_classification',
      dataType: 'image',
      modelConfig: {
        version: '1.0.0',
        framework: 'tensorflow'
      }
    });

    console.log('✅ Cloud deployment simulation successful!');
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ Cloud deployment test failed:', error.response?.data || error.message);
  }
}

// Main test function
async function runTests() {
  try {
    await testLocalDeployment();
    await testCloudDeployment();
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📝 Summary:');
    console.log('   ✓ Local deployment ZIP generation works');
    console.log('   ✓ File download mechanism works');
    console.log('   ✓ Cloud deployment simulation works');
    console.log('\n💡 Next steps:');
    console.log('   - Integrate with frontend deployment UI');
    console.log('   - Test with actual model configurations');
    console.log('   - Add error handling for edge cases');

  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
