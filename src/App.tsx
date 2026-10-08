import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/auth';
import type { UserRole } from './types/battery';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { PortalHubPage } from './pages/auth/PortalHubPage';

// Refurbisher Pages
import { RefurbisherDashboard } from './pages/refurbisher/RefurbisherDashboard';
import { RefurbisherBatteries } from './pages/refurbisher/RefurbisherBatteries';
import { AssessmentNewPage } from './pages/refurbisher/AssessmentNewPage';
import { AssessmentResultPage } from './pages/refurbisher/AssessmentResultPage';
import { RefurbisherRequestsPage } from './pages/refurbisher/RefurbisherRequestsPage';
import { RefurbisherReportsPage } from './pages/refurbisher/RefurbisherReportsPage';
import { RefurbisherSettingsPage } from './pages/refurbisher/RefurbisherSettingsPage';

// Second-Life Pages
import { SecondLifeDashboard } from './pages/second-life/SecondLifeDashboard';
import { SecondLifeInventory } from './pages/second-life/SecondLifeInventory';
import { SecondLifeRequestsPage } from './pages/second-life/SecondLifeRequestsPage';

// Recycler Pages
import { RecyclerDashboard } from './pages/recycler/RecyclerDashboard';
import { RecyclerQueuePage } from './pages/recycler/RecyclerQueuePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

// Passport Page
import { BatteryPassportPage } from './pages/passport/BatteryPassportPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const defaultRoute = authService.getRoleDefaultRoute(currentUser.role);
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
};

export function App() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleAuthChange = () => setTick((t) => t + 1);
    window.addEventListener('cellwise_auth_change', handleAuthChange);
    return () => window.removeEventListener('cellwise_auth_change', handleAuthChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/portals" element={<PortalHubPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/:portalRole" element={<LoginPage />} />

        {/* Passport View (Publicly accessible with battery ID or authenticated) */}
        <Route path="/battery/:id/passport" element={<BatteryPassportPage />} />

        {/* Portal A: Refurbisher Routes */}
        <Route
          path="/refurbisher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <RefurbisherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refurbisher/batteries"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <RefurbisherBatteries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refurbisher/assessment/new"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <AssessmentNewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refurbisher/assessment/:id"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <AssessmentResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refurbisher/requests"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <RefurbisherRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refurbisher/reports"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <RefurbisherReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refurbisher/settings"
          element={
            <ProtectedRoute allowedRoles={['refurbisher', 'admin']}>
              <RefurbisherSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Portal B: Second-Life Provider Routes */}
        <Route
          path="/second-life/dashboard"
          element={
            <ProtectedRoute allowedRoles={['second_life', 'admin']}>
              <SecondLifeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/second-life/batteries"
          element={
            <ProtectedRoute allowedRoles={['second_life', 'admin']}>
              <SecondLifeInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/second-life/requests"
          element={
            <ProtectedRoute allowedRoles={['second_life', 'admin']}>
              <SecondLifeRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/second-life/settings"
          element={
            <ProtectedRoute allowedRoles={['second_life', 'admin']}>
              <RefurbisherSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Portal C: Recycler Routes */}
        <Route
          path="/recycler/dashboard"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/batteries"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/tracking"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RecyclerQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/reports"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RefurbisherReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recycler/settings"
          element={
            <ProtectedRoute allowedRoles={['recycler', 'admin']}>
              <RefurbisherSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Portal Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/batteries"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RefurbisherBatteries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assessments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RefurbisherBatteries />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RefurbisherRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RefurbisherSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
