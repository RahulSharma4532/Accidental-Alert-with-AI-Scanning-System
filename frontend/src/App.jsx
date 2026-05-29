import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import Dashboard from './pages/dashboard/Dashboard';
import { AuthProvider } from './store/AuthContext';
import LoginPage from './pages/public/LoginPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import RegisterPage from './pages/public/RegisterPage';
import Profile from './pages/profile/Profile';
import ReportAccident from './pages/accidents/ReportAccident';
import NearbyServices from './pages/nearby/NearbyServices';
import ClaimList from './pages/claims/ClaimList';
import NewClaim from './pages/claims/NewClaim';
import ClaimDetail from './pages/claims/ClaimDetail';
import DisputeList from './pages/disputes/DisputeList';
import NewDispute from './pages/disputes/NewDispute';
import DisputeDetail from './pages/disputes/DisputeDetail';
import InsurerDashboard from './pages/insurer/InsurerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotificationCenter from './pages/notifications/NotificationCenter';
import VideoHearing from './pages/disputes/VideoHearing';
import KnowledgeHub from './pages/knowledge/KnowledgeHub';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import PremiumServices from './pages/payments/PremiumServices';
import TransactionHistory from './pages/payments/TransactionHistory';
import AdminRevenueDashboard from './pages/admin/AdminRevenueDashboard';
import MediatorDashboard from './pages/mediator/MediatorDashboard';
import MediatorDisputeDetail from './pages/mediator/MediatorDisputeDetail';
import AccidentList from './pages/accidents/AccidentList';
import AccidentDetail from './pages/accidents/AccidentDetail';
import DocumentVault from './pages/dashboard/DocumentVault';
import Vehicles from './pages/profile/Vehicles';
import ClaimQueue from './pages/insurer/ClaimQueue';
import KnowYourRights from './pages/knowledge/KnowYourRights';
import CookieBanner from './components/common/CookieBanner';
import InstallPrompt from './components/common/InstallPrompt';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<AccidentList />} />
          <Route path="/accidents" element={<AccidentList />} />
          <Route path="/accidents/:id" element={<AccidentDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/vehicles" element={<Vehicles />} />
          <Route path="/vault" element={<DocumentVault />} />
          <Route path="/report" element={<ReportAccident />} />
          <Route path="/nearby" element={<NearbyServices />} />
          <Route path="/claims" element={<ClaimList />} />
          <Route path="/claims/new" element={<NewClaim />} />
          <Route path="/claims/:id" element={<ClaimDetail />} />
          <Route path="/disputes" element={<DisputeList />} />
          <Route path="/disputes/new" element={<NewDispute />} />
          <Route path="/disputes/:id" element={<DisputeDetail />} />
          <Route path="/insurer" element={<InsurerDashboard />} />
          <Route path="/insurer/queue" element={<ClaimQueue />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route path="/disputes/:id/hearing" element={<VideoHearing />} />
          <Route path="/knowledge" element={<KnowledgeHub />} />
          <Route path="/knowledge/rights" element={<KnowYourRights />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/premium" element={<PremiumServices />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/admin/revenue" element={<AdminRevenueDashboard />} />
          <Route path="/mediator" element={<MediatorDashboard />} />
          <Route path="/mediator/disputes/:id" element={<MediatorDisputeDetail />} />
        </Routes>
        <CookieBanner />
        <InstallPrompt />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
