// Test script for API communication
import { useState } from 'react';
import axios from 'axios';

// Set the base URL
const API_URL = 'http://localhost:8000/api';

// Test authentication
const testAuth = async () => {
  try {
    console.log('Testing authentication...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password'
    });
    console.log('Auth test successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Auth test failed:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Test fetching reports
const testReports = async (token) => {
  try {
    console.log('Testing reports API...');
    const response = await axios.get(`${API_URL}/reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Reports test successful:', response.data);
  } catch (error) {
    console.error('Reports test failed:', error.response ? error.response.data : error.message);
  }
};

// Test fetching suggestions
const testSuggestions = async (token) => {
  try {
    console.log('Testing suggestions API...');
    const response = await axios.get(`${API_URL}/suggestions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Suggestions test successful:', response.data);
  } catch (error) {
    console.error('Suggestions test failed:', error.response ? error.response.data : error.message);
  }
};

// Run all tests
const runTests = async () => {
  try {
    const token = await testAuth();
    
    if (token) {
      await testReports(token);
      await testSuggestions(token);
    }
  } catch (error) {
    console.error('Tests failed to complete');
  }
};

// Export the testing functions
export { runTests, testAuth, testReports, testSuggestions };
