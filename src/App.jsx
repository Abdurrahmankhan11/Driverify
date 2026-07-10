import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Auth/Login';
import VerifyOTP from './pages/Auth/VerifyOTP';
import CompleteProfile from './pages/Auth/CompleteProfile';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import UserDashboard from './pages/Dashboards/UserDashboard';
import MiddlemanDashboard from './pages/Dashboards/MiddlemanDashboard';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            }
          />
          
          {/* Dashboard Routes wrapped with Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route
              path="user"
              element={
                <RoleRoute allowedRoles={['USER']}>
                  <UserDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="middleman"
              element={
                <RoleRoute allowedRoles={['MIDDLEMAN']}>
                  <MiddlemanDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="admin"
              element={
                <RoleRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;