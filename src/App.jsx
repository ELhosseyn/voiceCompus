import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/HomePage';
import ReportHistoryPage from '@/pages/ReportHistoryPage';
import SuggestionsPage from '@/pages/SuggestionsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import DepartmentalAdminLoginPage from '@/pages/DepartmentalAdminLoginPage';
import DepartmentalAdminDashboardPage from '@/pages/DepartmentalAdminDashboardPage';
import { ThemeProvider } from '@/components/ThemeProvider';
import authService from '@/services/authService';

    function App() {
      const [user, setUser] = React.useState(() => {
    return authService.getUser();
  });

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Verify the token is still valid by fetching current user
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Authentication error:', error);
          // If token is invalid, log the user out
          handleLogout();
        }
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (userData, anonymous, role) => {
    // User data and token are already stored in localStorage by authService.login
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear user state
      setUser(null);
    }
  };
      
      const isAuthenticated = !!user;
      const userEmail = user && !user.isAnonymous ? user.email : '';
      const isAnonymousUser = user && user.isAnonymous;
      const isAdmin = user && user.role === 'admin';
      const isDepartmentAdmin = user && user.role === 'department_admin';
      const userDepartment = user && user.department;

      return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Router>
            <Routes>
              <Route 
                path="/login" 
                element={isAuthenticated && !isAdmin && !isDepartmentAdmin ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} 
              />
              <Route 
                path="/" 
                element={isAuthenticated && !isAdmin && !isDepartmentAdmin ? <HomePage userEmail={userEmail} isAnonymous={isAnonymousUser} onLogout={handleLogout} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/history" 
                element={isAuthenticated && !isAnonymousUser && !isAdmin && !isDepartmentAdmin ? <ReportHistoryPage userEmail={userEmail} onLogout={handleLogout} /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/suggestions" 
                element={isAuthenticated && !isAdmin && !isDepartmentAdmin ? <SuggestionsPage userEmail={userEmail} isAnonymous={isAnonymousUser} onLogout={handleLogout} /> : <Navigate to="/login" />} 
              />
              
              <Route 
                path="/admin/login" 
                element={isAdmin ? <Navigate to="/admin/dashboard" /> : <AdminLoginPage onLogin={handleLogin} />} 
              />
              <Route 
                path="/admin/dashboard" 
                element={isAdmin ? <AdminDashboardPage onLogout={handleLogout} /> : <Navigate to="/admin/login" />} 
              />

              <Route
                path="/departmental-admin/login"
                element={isDepartmentAdmin ? <Navigate to="/departmental-admin/dashboard" /> : <DepartmentalAdminLoginPage onLogin={handleLogin} />}
              />
              <Route
                path="/departmental-admin/dashboard"
                element={isDepartmentAdmin ? <DepartmentalAdminDashboardPage userDepartment={userDepartment} onLogout={handleLogout} /> : <Navigate to="/departmental-admin/login" />}
              />

              <Route path="*" element={<Navigate to={isAuthenticated && !isAdmin && !isDepartmentAdmin ? "/" : "/login"} />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      );
    }

    export default App;