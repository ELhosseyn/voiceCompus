// Test login functionality
import api from './api';

const testLogin = async (email = 'cs_student1@example.com', password = 'password') => {
  try {
    console.log(`Attempting to login with ${email}...`);
    const response = await api.post('/auth/login', { email, password });
    console.log('Login successful!', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export { testLogin };
