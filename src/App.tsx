import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import CreateDelivery from './pages/vendor/CreateDelivery';
import VendorTracking from './pages/vendor/Tracking';
// Courier Pages
import CourierDashboard from './pages/courier/Dashboard';
import CourierDeliveries from './pages/courier/Deliveries';

// Create a client
const queryClient = new QueryClient();

interface PrivateRouteProps {
  children: React.ReactElement;
  roles: string[];
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="bg-uber-dark-gray text-white h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!roles.includes(user.role)) {
    // Redirect if user role is not allowed
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/courier/dashboard'} />;
  }

  return children;
};


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Vendor Routes */}
        <Route path="/vendor/dashboard" element={<PrivateRoute roles={['vendor']}><VendorDashboard /></PrivateRoute>} />
        <Route path="/vendor/create-delivery" element={<PrivateRoute roles={['vendor']}><CreateDelivery /></PrivateRoute>} />
        <Route path="/vendor/tracking" element={<PrivateRoute roles={['vendor']}><VendorTracking /></PrivateRoute>} />

        {/* Courier Routes */}
          <Route path="/courier/dashboard" element={<PrivateRoute roles={['courier']}><CourierDashboard /></PrivateRoute>} />
          <Route path="/courier/deliveries" element={<PrivateRoute roles={['courier']}><CourierDeliveries /></PrivateRoute>} />


        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
