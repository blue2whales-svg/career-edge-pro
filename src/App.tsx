import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
import NewCVEditorPage from "./pages/CVEditorPage";
import CoverLetterPage from "./pages/CoverLetterPage";
import ATSCheckerPage from "./pages/ATSCheckerPage";
import TrackerPage from "./pages/TrackerPage";
import VaultPage from "./pages/VaultPage";
import PostJobPage from "./pages/PostJobPage";
import EmployerDashboard from "./pages/EmployerDashboard";
import DocumentVaultPage from "./pages/DocumentVaultPage";
import ProPage from "./pages/ProPage";
import RecruitersPage from "./pages/RecruitersPage";
import GlobalServicePage from "./pages/GlobalServicePage";
import OptimizePage from "./pages/OptimizePage";
import SamplesPage from "./pages/SamplesPage";
import GenerateCVPage from "./pages/GenerateCVPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PortalLayout from "./components/PortalLayout";
import PortalDashboard from "./pages/PortalDashboard";
import OrderDetailPage from "./pages/OrderDetailPage";
import PortalDocuments from "./pages/PortalDocuments";
import PortalMessages from "./pages/PortalMessages";
import PortalSettingsPage from "./pages/PortalSettingsPage";
import AdminJobsPage from "./pages/AdminJobsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js";
    script.type = "module";
    script.async = true;

    script.onload = () => {
      const chatbot = document.createElement("zapier-interfaces-chatbot-embed");
      chatbot.setAttribute("is-popup", "true");
      chatbot.setAttribute("chatbot-id", "cmn7mjqup0043z045os1e5hcw");

      document.body.appendChild(chatbot);
    };

    document.body.appendChild(script);
  }, []);

  return (
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
            <Route
              path="/tracker"
              element={
                <AuthGuard>
                  <TrackerPage />
                </AuthGuard>
              }
            />
            <Route
              path="/post-job"
              element={
                <AuthGuard>
                  <PostJobPage />
                </AuthGuard>
              }
            />
            <Route
              path="/employer-dashboard"
              element={
                <AuthGuard>
                  <EmployerDashboard />
                </AuthGuard>
              }
            />
            <Route path="/vault" element={<Navigate to="/document-vault" replace />} />
            <Route
              path="/document-vault"
              element={
                <AuthGuard>
                  <DocumentVaultPage />
                </AuthGuard>
              }
            />
            <Route path="/pro" element={<ProPage />} />
            <Route path="/recruiters" element={<RecruitersPage />} />
            <Route path="/global-service" element={<GlobalServicePage />} />
            <Route path="/optimize" element={<OptimizePage />} />
            <Route path="/samples" element={<Navigate to="/templates" replace />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route
              path="/generate-cv"
              element={
                <AuthGuard>
                  <GenerateCVPage />
                </AuthGuard>
              }
            />
            <Route path="/review/:orderId" element={<DocumentReviewPage />} />

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

            <Route
              path="/admin/jobs"
              element={
                <AuthGuard>
                  <AdminJobsPage />
                </AuthGuard>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
