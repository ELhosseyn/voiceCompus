// loginTest.js - A simple test file for the login functionality

document.addEventListener('DOMContentLoaded', function() {
  const testButton = document.createElement('button');
  testButton.textContent = 'Test Login';
  testButton.style.position = 'fixed';
  testButton.style.bottom = '20px';
  testButton.style.right = '20px';
  testButton.style.zIndex = '9999';
  testButton.style.padding = '10px';
  testButton.style.background = '#4a90e2';
  testButton.style.color = 'white';
  testButton.style.border = 'none';
  testButton.style.borderRadius = '4px';
  
  document.body.appendChild(testButton);
  
  const resultDiv = document.createElement('div');
  resultDiv.style.position = 'fixed';
  resultDiv.style.bottom = '70px';
  resultDiv.style.right = '20px';
  resultDiv.style.width = '300px';
  resultDiv.style.maxHeight = '200px';
  resultDiv.style.overflow = 'auto';
  resultDiv.style.background = 'rgba(0,0,0,0.8)';
  resultDiv.style.color = 'white';
  resultDiv.style.padding = '10px';
  resultDiv.style.borderRadius = '4px';
  resultDiv.style.zIndex = '9999';
  resultDiv.style.display = 'none';
  
  document.body.appendChild(resultDiv);
  
  testButton.addEventListener('click', async function() {
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Testing login...<br>';
    
    try {
      // Test direct fetch request first
      resultDiv.innerHTML += 'Testing with fetch API...<br>';
      const fetchResponse = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: 'cs_student1@example.com',
          password: 'password'
        })
      });
      
      const fetchData = await fetchResponse.json();
      resultDiv.innerHTML += `Fetch Status: ${fetchResponse.status}<br>`;
      resultDiv.innerHTML += `Fetch Response: ${JSON.stringify(fetchData).substring(0, 100)}...<br><br>`;
      
      // Now test with axios
      resultDiv.innerHTML += 'Testing with axios...<br>';
      const axiosResult = await testAxiosLogin();
      resultDiv.innerHTML += axiosResult;
      
    } catch (error) {
      resultDiv.innerHTML += `Error: ${error.message}<br>`;
      resultDiv.innerHTML += `Check your console for more details<br>`;
      console.error('Login test error:', error);
    }
  });
  
  async function testAxiosLogin() {
    try {
      const axios = window.axios;
      if (!axios) {
        return 'Axios not found in window object. Make sure to include axios.';
      }
      
      const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const response = await axiosInstance.post('/auth/login', {
        email: 'cs_student1@example.com',
        password: 'password'
      });
      
      return `Axios Status: ${response.status}<br>Axios Response: ${JSON.stringify(response.data).substring(0, 100)}...<br>`;
    } catch (error) {
      return `Axios Error: ${error.message}<br>Details: ${JSON.stringify(error.response?.data || {})}<br>`;
    }
  }
});
