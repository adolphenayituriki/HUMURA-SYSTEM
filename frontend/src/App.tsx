import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Beneficiaries from './pages/Beneficiaries';
import Screening from './pages/Screening';
import Referrals from './pages/Referrals';
import Sociotherapy from './pages/Sociotherapy';
import Cooperatives from './pages/Cooperatives';
import Emergencies from './pages/Emergencies';
import Youth from './pages/Youth';
import Reports from './pages/Reports';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Media from './pages/Media';
import Privacy from './pages/Privacy';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

function AuthRoute() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return isAuth ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/media" element={<Media />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route element={<AuthRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>
        </Route>

        {/* Protected dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/screening" element={<Screening />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/sociotherapy" element={<Sociotherapy />} />
          <Route path="/cooperatives" element={<Cooperatives />} />
          <Route path="/emergencies" element={<Emergencies />} />
          <Route path="/youth" element={<Youth />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
