const axios = require('axios');

async function testAuth() {
  try {
    console.log('Testing registration...');
    
    // Test registration
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User 3',
      email: 'test3@example.com',
      password: 'Password123'
    });
    
    console.log('Registration Response:', registerResponse.data);
    
    // Test login
    console.log('\nTesting login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test3@example.com',
      password: 'Password123'
    });
    
    console.log('Login Response:', loginResponse.data);
  } catch (error) {
    console.log('Error:', error.response?.data || error.message);
  }
}

testAuth();