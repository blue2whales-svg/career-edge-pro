import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import AuthGuard from "@/components/AuthGuard";

// Only eagerly load the landing page (most common entry)
import LandingPage from "./pages/LandingPage";

// Lazy-load everything else
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const ScholarshipsPage = lazy(() => import("./pages/ScholarshipsPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const OrderPage = lazy(() => import("./pages/OrderPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DocumentReviewPage = lazy(() => import("./pages/DocumentReviewPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const NewCVEditorPage = lazy(() => import("./pages/CVEditorPage"));
const CoverLetterPage = lazy(() => import("./pages/CoverLetterPage"));
const ATSCheckerPage = lazy(() => import("./pages/ATSCheckerPage"));
const TrackerPage = lazy(() => import("./pages/TrackerPage"));
const VaultPage = lazy(() => import("./pages/VaultPage"));
const PostJobPage = lazy(() => import("./pages/PostJobPage"));
const EmployerDashboard = lazy(() => import("./pages/EmployerDashboard"));
const DocumentVaultPage = lazy(() => import("./pages/DocumentVaultPage"));
const ProPage = lazy(() => import("./pages/ProPage"));
const SubscribePage = lazy(() => import("./pages/SubscribePage"));
const RecruitersPage = lazy(() => import("./pages/RecruitersPage"));
const GlobalServicePage = lazy(() => import("./pages/GlobalServicePage"));
const OptimizePage = lazy(() => import("./pages/OptimizePage"));
const SamplesPage = lazy(() => import("./pages/SamplesPage"));
const GenerateCVPage = lazy(() => import("./pages/GenerateCVPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const EuropassBuilder = lazy(() => import("./pages/EuropassBuilder"));
const PortalLayout = lazy(() => import("./components/PortalLayout"));
const PortalDashboard = lazy(() => import("./pages/PortalDashboard"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const PortalDocuments = lazy(() => import("./pages/PortalDocuments"));
const PortalMessages = lazy(() => import("./pages/PortalMessages"));
const PortalSettingsPage = lazy(() => import("./pages/PortalSettingsPage"));
const AdminJobsPage = lazy(() => import("./pages/AdminJobsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ApplicationsPage = lazy(() => import("./pages/ApplicationsPage"));
const ReferralsPage = lazy(() => import("./pages/ReferralsPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const RefundPolicyPage = lazy(() => import("./pages/RefundPolicyPage"));
const DisclaimerPage = lazy(() => import("./pages/DisclaimerPage"));

// Minimal loading skeleton — ultra lightweight
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
        <span className="text-xs font-semibold tracking-widest text-primary">CV EDGE</span>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
              <Route path="/europass-builder" element={<EuropassBuilder />} />
              <Route
                path="/tracker"
                element={<AuthGuard><TrackerPage /></AuthGuard>}
              />
              <Route
                path="/post-job"
                element={<AuthGuard><PostJobPage /></AuthGuard>}
              />
              <Route
                path="/employer-dashboard"
                element={<AuthGuard><EmployerDashboard /></AuthGuard>}
              />
              <Route path="/vault" element={<Navigate to="/document-vault" replace />} />
              <Route
                path="/document-vault"
                element={<AuthGuard><DocumentVaultPage /></AuthGuard>}
              />
              <Route path="/pro" element={<ProPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="/recruiters" element={<RecruitersPage />} />
              <Route path="/global-service" element={<GlobalServicePage />} />
              <Route path="/optimize" element={<OptimizePage />} />
              <Route path="/samples" element={<Navigate to="/templates" replace />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route
                path="/generate-cv"
                element={<AuthGuard><GenerateCVPage /></AuthGuard>}
              />
              <Route path="/review/:orderId" element={<DocumentReviewPage />} />
              <Route
                path="/portal"
                element={<AuthGuard><PortalLayout /></AuthGuard>}
              >
                <Route index element={<PortalDashboard />} />
                <Route path="order/:orderId" element={<OrderDetailPage />} />
                <Route path="documents" element={<PortalDocuments />} />
                <Route path="messages" element={<PortalMessages />} />
                <Route path="settings" element={<PortalSettingsPage />} />
              </Route>
              <Route
                path="/admin/jobs"
                element={<AuthGuard><AdminJobsPage /></AuthGuard>}
              />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route
                path="/dashboard/applications"
                element={<AuthGuard><ApplicationsPage /></AuthGuard>}
              />
              <Route
                path="/dashboard/referrals"
                element={<AuthGuard><ReferralsPage /></AuthGuard>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
