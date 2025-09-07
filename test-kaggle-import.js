// Use built-in fetch (Node.js 18+)

async function testKaggleImport() {
  console.log('🧪 Testing Kaggle import endpoint...');
  
  try {
    const response = await fetch('http://localhost:5000/api/kaggle/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datasetName: 'vicsuperman/prediction-of-music-genre'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Import successful!');
      console.log('Data:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.text();
      console.error('❌ Import failed');
      console.error('Status:', response.status);
      console.error('Response:', errorData);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testKaggleImport();
