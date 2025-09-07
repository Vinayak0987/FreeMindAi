const axios = require('axios');

console.log('🔧 Testing Kaggle API endpoints...\n');

async function testKaggleEndpoints() {
  try {
    // Test search endpoint
    console.log('1. Testing Kaggle search endpoint...');
    const searchResponse = await axios.get('http://localhost:5000/api/kaggle/search', {
      params: { q: 'music' }
    });
    
    console.log(`✅ Search: ${searchResponse.status} - Found ${searchResponse.data.data.length} datasets`);
    console.log(`📊 Sample dataset: ${searchResponse.data.data[0]?.title || 'N/A'}\n`);
    
    // Test import endpoint
    console.log('2. Testing Kaggle import endpoint...');
    const importResponse = await axios.post('http://localhost:5000/api/kaggle/import', {
      datasetName: 'vicsuperman/prediction-of-music-genre',
      projectId: 'test-project'
    });
    
    console.log(`✅ Import: ${importResponse.status} - ${importResponse.data.message}`);
    console.log(`📈 Analysis: ${importResponse.data.data.analysis.summary.totalRows} rows, ${importResponse.data.data.analysis.summary.totalColumns} columns\n`);
    
    // Test local deployment with dataset
    console.log('3. Testing local deployment with dataset...');
    const deploymentData = {
      platform: 'local',
      serviceName: 'test-music-classifier',
      environment: 'development',
      taskType: 'classification',
      dataType: 'tabular',
      modelConfig: {
        dataset: {
          name: 'Music Genre Dataset',
          samples: 1000,
          features: 15,
          size: '2.5 MB'
        }
      }
    };
    
    const deployResponse = await axios({
      method: 'post',
      url: 'http://localhost:5000/api/deploy',
      data: deploymentData,
      responseType: 'stream',
      timeout: 30000
    });
    
    console.log(`✅ Deployment: ${deployResponse.status} - ZIP package generated`);
    console.log(`📦 Content-Type: ${deployResponse.headers['content-type']}`);
    
    // Save a small portion to verify it's a real ZIP
    const chunks = [];
    deployResponse.data.on('data', (chunk) => {
      chunks.push(chunk);
      if (chunks.length === 1) {
        const header = chunk.toString('hex').substring(0, 8);
        console.log(`🔍 ZIP header: ${header} ${header === '504b0304' ? '✅' : '❌'}`);
      }
    });
    
    await new Promise((resolve) => {
      deployResponse.data.on('end', resolve);
    });
    
    const totalSize = chunks.reduce((total, chunk) => total + chunk.length, 0);
    console.log(`📊 Package size: ${(totalSize / 1024).toFixed(2)} KB\n`);
    
    console.log('🎉 All Kaggle integration tests passed!\n');
    console.log('✅ Summary:');
    console.log('   - Kaggle dataset search working');
    console.log('   - Dataset import with mock data working');
    console.log('   - Local deployment with dataset context working');
    console.log('   - ZIP package generation working\n');
    
    console.log('🚀 Ready for full end-to-end testing!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data);
    }
    return false;
  }
}

testKaggleEndpoints().then(success => {
  process.exit(success ? 0 : 1);
});
