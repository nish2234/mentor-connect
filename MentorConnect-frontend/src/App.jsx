import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import theme from './theme/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BrowseMentors from './pages/Mentors/BrowseMentors';
import MentorDetail from './pages/Mentors/MentorDetail';
import MentorDashboard from './pages/Dashboard/MentorDashboard';
import MenteeDashboard from './pages/Dashboard/MenteeDashboard';
import MentorProfile from './pages/MentorProfile/MentorProfile';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #e2e8f0',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// App Layout
const AppLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>{children}</main>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1e293b',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
                style: {
                  borderColor: '#22c55e',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  borderColor: '#ef4444',
                },
              },
            }}
          />
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mentors" element={<BrowseMentors />} />
              <Route path="/mentors/:id" element={<MentorDetail />} />

              {/* Mentor Routes */}
              <Route
                path="/mentor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor/profile"
                element={
                  <ProtectedRoute allowedRoles={['MENTOR']}>
                    <MentorProfile />
                  </ProtectedRoute>
                }
              />

              {/* Mentee Routes */}
              <Route
                path="/mentee/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['MENTEE']}>
                    <MenteeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
