import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Auth/Login';
import VerifyOTP from '../pages/Auth/VerifyOTP';

// Auth / Profile
import CompleteProfile from '../pages/Auth/CompleteProfile';

// Dashboards
import UserDashboard from '../pages/Dashboard/User/UserDashboard.jsx';
import UserListings from '../pages/Dashboard/User/UserListings.jsx';
import UserFeaturedListings from '../pages/Dashboard/User/UserFeaturedListings.jsx';
import UserRecentlyViewed from '../pages/Dashboard/User/UserRecentlyViewed.jsx';
import UserWishlist from '../pages/Dashboard/User/UserWishlist.jsx';
import MiddlemanServices from '../pages/Dashboard/User/MiddlemanServices.jsx';
import ProfileView from '../pages/Dashboard/User/ProfileView.jsx';
import UpdateProfile from '../pages/Dashboard/User/UpdateProfile.jsx';
import MiddlemanDashboard from '../pages/Dashboard/Middleman/MiddlemanDashboard.jsx';
import AdminDashboard from '../pages/Dashboard/Admin/AdminDashboard.jsx';
import AdminUserList from '../pages/Dashboard/Admin/AdminUserList.jsx';
import AdminUserDetail from '../pages/Dashboard/Admin/AdminUserDetail.jsx';
import AdminListings from '../pages/Dashboard/Admin/AdminListings.jsx';
import AdminFeaturedListings from '../pages/Dashboard/Admin/AdminFeaturedListings.jsx';
import AdminReports from '../pages/Dashboard/Admin/AdminReports.jsx';
import PostVehicleFlow from '../pages/Dashboard/PostVehicle/PostVehicleFlow.jsx';

// Shared / Other
import VehicleDetails from '../pages/VehicleDetails.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute />}>
        {/* Profile Completion - Requires auth but not a full role yet */}
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Dashboard Routes with Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* USER Role Routes */}
          <Route element={<RoleRoute allowedRoles={['USER']} />}>
            <Route path="user" element={<UserDashboard />} />
            <Route path="user/listings" element={<UserListings />} />
            <Route path="user/featured" element={<UserFeaturedListings />} />
            <Route path="user/recently-viewed" element={<UserRecentlyViewed />} />
            <Route path="user/wishlist" element={<UserWishlist />} />
            <Route path="user/middleman-services" element={<MiddlemanServices />} />
            <Route path="user/vehicle/:id" element={<VehicleDetails />} />
            <Route path="user/listings/:id" element={<VehicleDetails />} />
            <Route path="user/post-vehicle" element={<PostVehicleFlow />} />
            <Route path="user/profile" element={<ProfileView />} />
            <Route path="user/profile/edit" element={<UpdateProfile />} />
          </Route>

          {/* MIDDLEMAN Role Routes */}
          <Route element={<RoleRoute allowedRoles={['MIDDLEMAN']} />}>
            <Route path="middleman" element={<MiddlemanDashboard />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUserList />} />
            <Route path="admin/users/:id" element={<AdminUserDetail />} />
            <Route path="admin/listings" element={<AdminListings />} />
            <Route path="admin/featured" element={<AdminFeaturedListings />} />
            <Route path="admin/listings/:id" element={<VehicleDetails />} />
            <Route path="admin/reports" element={<AdminReports />} />
            <Route path="admin/profile" element={<ProfileView />} />
            <Route path="admin/profile/edit" element={<UpdateProfile />} />
          </Route>

        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
