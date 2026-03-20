import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import AuthGuard from "@/components/AuthGuard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ServicesPage from "./pages/ServicesPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import PricingPage from "./pages/PricingPage";
import JobsPage from "./pages/JobsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutPage from "./pages/AboutPage";
import OrderPage from "./pages/OrderPage";
import ContactPage from "./pages/ContactPage";
import DocumentReviewPage from "./pages/DocumentReviewPage";
import TemplatesPage from "./pages/TemplatesPage";
import NewCVEditorPage from "./pages/NewCVEditorPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import ATSCheckerPage from "./pages/ATSCheckerPage";
import TrackerPage from "./pages/TrackerPage";
import VaultPage from "./pages/VaultPage";
import ProPage from "./pages/ProPage";
import RecruitersPage from "./pages/RecruitersPage";
import GlobalServicePage from "./pages/GlobalServicePage";
import OptimizePage from "./pages/OptimizePage";
import SamplesPage from "./pages/SamplesPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PortalLayout from "./components/PortalLayout";
import PortalDashboard from "./pages/PortalDashboard";
import OrderDetailPage from "./pages/OrderDetailPage";
import PortalDocuments from "./pages/PortalDocuments";
import PortalMessages from "./pages/PortalMessages";
import PortalSettingsPage from "./pages/PortalSettingsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/cv-builder" element={<Navigate to="/templates" replace />} />
          <Route path="/cv-editor/:templateId" element={<NewCVEditorPage />} />
          <Route path="/cover-letter" element={<CoverLetterPage />} />
          <Route path="/ats-checker" element={<ATSCheckerPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/pro" element={<ProPage />} />
          <Route path="/recruiters" element={<RecruitersPage />} />
          <Route path="/global-service" element={<GlobalServicePage />} />
          <Route path="/optimize" element={<OptimizePage />} />
          <Route path="/samples" element={<SamplesPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/review/:orderId" element={<DocumentReviewPage />} />

          {/* Client Portal (auth-protected) */}
          <Route
            path="/portal"
            element={
              <AuthGuard>
                <PortalLayout />
              </AuthGuard>
            }
          >
            <Route index element={<PortalDashboard />} />
            <Route path="order/:orderId" element={<OrderDetailPage />} />
            <Route path="documents" element={<PortalDocuments />} />
            <Route path="messages" element={<PortalMessages />} />
            <Route path="settings" element={<PortalSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
