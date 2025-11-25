// Test script for API CORS debugging
console.log('API CORS Test Script');
console.log('---------------------');

// Test direct connection to Laravel backend
async function testConnection() {
  try {
    // Test 1: Simple GET request to CORS test endpoint
    console.log('Test 1: Simple GET request to CORS test endpoint');
    const corsTestResponse = await fetch('http://localhost:8000/cors-test.php', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log(`Status: ${corsTestResponse.status}`);
    if (corsTestResponse.ok) {
      const data = await corsTestResponse.json();
      console.log('Response:', data);
      console.log('Test 1: SUCCESS ✅');
    } else {
      console.error('Test 1: FAILED ❌');
    }
    
    // Test 2: Login request to Laravel API
    console.log('\nTest 2: Login request to Laravel API');
    const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: 'cs_student1@example.com',
        password: 'password'
      })
    });
    
    console.log(`Status: ${loginResponse.status}`);
    try {
      const loginData = await loginResponse.json();
      console.log('Response:', loginData);
      if (loginResponse.ok) {
        console.log('Test 2: SUCCESS ✅');
        
        // If login succeeded, store token for next test
        const token = loginData.token;
        if (token) {
          localStorage.setItem('test_token', token);
          console.log('Token saved to localStorage');
          
          // Test 3: Try to access a protected endpoint with the token
          console.log('\nTest 3: Access protected endpoint with token');
          const protectedResponse = await fetch('http://localhost:8000/api/reports', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          });
          
          console.log(`Status: ${protectedResponse.status}`);
          const protectedData = await protectedResponse.json();
          console.log('Response:', protectedData);
          console.log(protectedResponse.ok ? 'Test 3: SUCCESS ✅' : 'Test 3: FAILED ❌');
        }
      } else {
        console.error('Test 2: FAILED ❌');
      }
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.error('Test 2: FAILED ❌');
    }
    
  } catch (error) {
    console.error('Connection test failed:', error.message);
  }
}

export { testConnection };
