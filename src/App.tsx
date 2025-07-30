import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SchoolLogin from './pages/SchoolLogin';
import RegisterSchool from './pages/RegisterSchool';
import SchoolConfirmation from './pages/SchoolConfirmation';
import PlanSelection from './pages/PlanSelection';
import KYCVerification from './pages/KYCVerification';
import Subscription from './components/Subscription';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { ThemeProvider } from './contexts/ThemeContext';
import TenantRoute from './components/TenantRoute';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <AuthProvider>
      <TenantProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/:subdomain/login" element={<SchoolLogin />} />
                
                {/* Registration flow */}
                <Route path="/register/school" element={<RegisterSchool />} />
                <Route path="/register/school/plan" element={<PlanSelection />} />
                <Route path="/register/school/confirmation" element={<SchoolConfirmation />} />
                <Route path="/register/school/kyc" element={<KYCVerification />} />
                <Route path="/subscription" element={<Subscription />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard/*" 
                  element={
                    <TenantRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </TenantRoute>
                  } 
                />
                
                {/* Tenant-specific routes */}
                <Route 
                  path="/:subdomain/dashboard/*" 
                  element={
                    <TenantRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </TenantRoute>
                  } 
                />
                
                {/* Error routes */}
                <Route path="/school-not-found" element={<div>École non trouvée</div>} />
                <Route path="/unauthorized" element={<div>Accès non autorisé</div>} />
                <Route path="*" element={<div>Page non trouvée</div>} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </TenantProvider>
    </AuthProvider>
  );
}

export default App;