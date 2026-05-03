import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer routes */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Driver routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute role="driver">
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-400 mb-2">403</h1>
                <p className="text-slate-400">Access denied. You don't have permission to view this page.</p>
              </div>
            </div>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
