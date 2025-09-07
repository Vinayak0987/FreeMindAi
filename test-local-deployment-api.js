// Use built-in fetch (Node.js 18+)
const fs = require('fs');

async function testLocalDeployment() {
  console.log('🧪 Testing local deployment API endpoint...');
  
  const localDeploymentConfig = {
    platform: 'local',
    serviceName: 'test-music-classifier',
    environment: 'development',
    taskType: 'classification',
    dataType: 'tabular',
    modelConfig: {
      dataset: {
        name: 'Music Genre Classification Dataset',
        samples: '50000',
        features: '18',
        size: '7.36 MB'
      }
    },
    deploymentConfig: {
      autoScaling: false,
      memoryLimit: 1024,
      enableMonitoring: true
    }
  };

  try {
    console.log('📦 Sending deployment request...');
    const response = await fetch('http://localhost:5000/api/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localDeploymentConfig)
    });

    if (response.ok) {
      console.log('✅ API call successful');
      console.log('📄 Response headers:');
      for (const [key, value] of response.headers.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      // Check if it's a ZIP file
      const contentType = response.headers.get('content-type');
      if (contentType === 'application/zip') {
        console.log('📁 Receiving ZIP file...');
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = 'test-deployment-package.zip';
        fs.writeFileSync(filename, buffer);
        console.log(`✅ ZIP file saved as: ${filename}`);
        console.log(`📊 File size: ${(buffer.length / 1024).toFixed(2)} KB`);
      } else {
        console.log('📄 Response body:');
        const responseText = await response.text();
        console.log(responseText);
      }
    } else {
      console.error('❌ API call failed');
      console.error('Status:', response.status);
      console.error('Response:', await response.text());
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testLocalDeployment();
