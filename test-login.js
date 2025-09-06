const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'Password123'
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
  }
}

testLogin();