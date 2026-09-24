import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts & Route Protections
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import UnauthorizedPage from './pages/public/UnauthorizedPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Dashboards
import ClientDashboard from './pages/dashboards/ClientDashboard';
import DesignerDashboard from './pages/dashboards/DesignerDashboard';
import ContractorDashboard from './pages/dashboards/ContractorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

// Projects
import ProjectsListPage from './pages/projects/ProjectsListPage';
import NewProjectPage from './pages/projects/NewProjectPage';
import ProjectWorkspace from './pages/projects/ProjectWorkspace';

// Admin
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage';

// Shared
import ProfilePage from './pages/shared/ProfilePage';
import NotificationsPage from './pages/shared/NotificationsPage';
import ProfessionalsDirectoryPage from './pages/shared/ProfessionalsDirectoryPage';

// Role-based root redirector helper
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'DESIGNER') return <Navigate to="/designer/dashboard" replace />;
  if (user.role === 'CONTRACTOR') return <Navigate to="/contractor/dashboard" replace />;
  return <Navigate to="/client/dashboard" replace />;
};

export function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Authenticated Workspace Pages */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dynamic /dashboard redirector */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Client Routes */}
        <Route
          path="/client/dashboard"
          element={
            <RoleRoute allowedRoles={['CLIENT', 'ADMIN']}>
              <ClientDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/client/projects/new"
          element={
            <RoleRoute allowedRoles={['CLIENT', 'ADMIN']}>
              <NewProjectPage />
            </RoleRoute>
          }
        />

        {/* Designer Routes */}
        <Route
          path="/designer/dashboard"
          element={
            <RoleRoute allowedRoles={['DESIGNER', 'ADMIN']}>
              <DesignerDashboard />
            </RoleRoute>
          }
        />

        {/* Contractor Routes */}
        <Route
          path="/contractor/dashboard"
          element={
            <RoleRoute allowedRoles={['CONTRACTOR', 'ADMIN']}>
              <ContractorDashboard />
            </RoleRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminUsersPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <ProjectsListPage />
            </RoleRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <RoleRoute allowedRoles={['ADMIN']}>
              <AdminAuditLogsPage />
            </RoleRoute>
          }
        />

        {/* Shared Workspace Routes */}
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:id" element={<ProjectWorkspace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/professionals" element={<ProfessionalsDirectoryPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
