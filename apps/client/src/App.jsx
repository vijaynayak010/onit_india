import React, { lazy, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Landingpage from "./components/landing/Landingpage.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import DomainsNavBar from "./components/layout/DomainsNavBar.jsx";
import Footer from "./components/layout/Footer.jsx";
import SEO from "./components/seo/SEO.jsx";
import ScrollToTop from "./components/ScrollToTop.js";
import ScrollingInfo from "./components/ui/ScrollingInfo.jsx";
import SplashCursor from "./components/ui/SplashCursor.jsx";
import AnimatedSection from "./components/ui/AnimatedSection.jsx";
import { getAllUseCaseSlugs } from "./data/useCases.js";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import AppAuth0Provider from "./components/shared/AppAuth0Provider.jsx";
import GatedRoute from "./components/GatedRoute.jsx";
import SiteGate from "./components/SiteGate.jsx";
import "./pages/public/publicPages.css";
import TestModeBadge from "./test-mode/components/TestModeBadge.jsx";

const lazyPage = (importer) => lazy(importer);

const AuthRoleRedirect = lazyPage(() => import("./components/auth/AuthRoleRedirect.jsx"));
const Task_Performers = lazyPage(() => import("./pages/tasks/TaskPerformers.jsx"));
const WhyChooseUsPage = lazyPage(() => import("./components/WhyChooseUsPage.jsx"));
const PrivacyPolicy = lazyPage(() => import("./pages/legal/PrivacyPolicy.jsx"));
const TermsAndConditions = lazyPage(() => import("./pages/legal/TermsAndConditions.jsx"));
const RefundPolicy = lazyPage(() => import("./pages/legal/RefundPolicy.jsx"));
const FAQs = lazyPage(() => import("./components/landing/FAQs.jsx"));
const TrustAndSafety = lazyPage(() => import("./components/TrustAndSafety.jsx"));
const PolicyPage = lazyPage(() => import("./pages/legal/PolicyPage.jsx"));
const AdminLogin = lazyPage(() => import("./components/Blog/AdminLogin.jsx"));
const AdminDashboard = lazyPage(() => import("./components/Blog/AdminDashboard.jsx"));
const AddPost = lazyPage(() => import("./components/Blog/AddPost.jsx"));
const BlogList = lazyPage(() => import("./components/Blog/BlogList.jsx"));
const BlogPost = lazyPage(() => import("./components/Blog/BlogPost.jsx"));
const CampusDetail = lazyPage(() => import("./pages/campus/CampusDetail.jsx"));
const ProviderApp = lazyPage(() => import("./components/provider/ProviderApp.jsx"));
const PerformerApp = lazyPage(() => import("./components/Performer/PerformerApp.jsx"));
const AdminApp = lazyPage(() => import("./components/Admin/AdminApp.jsx"));
const Careers = lazyPage(() => import("./pages/careers/Careers.jsx"));
const AboutUs = lazyPage(() => import("./components/AboutUs.jsx"));
const HowItWorksPage = lazyPage(() => import("./components/HowItWorksPage.jsx"));
const TaskCategories = lazyPage(() => import("./pages/tasks/TaskCategories.jsx"));
const TaskCategoryDetailPage = lazyPage(() => import("./pages/tasks/TaskCategoryDetailPage.jsx"));
const WhatIsOnITIndia = lazyPage(() => import("./components/WhatIsOnITIndia.jsx"));
const ExecutionInfrastructurePage = lazyPage(() => import("./components/ExecutionInfrastructurePage.jsx"));
const PerformerDirectory = lazyPage(() => import("./pages/performers/PerformerDirectory.jsx"));
const DomainDetail = lazyPage(() => import("./pages/domains/DomainDetail.jsx"));
const DomainSubDomainPage = lazyPage(() => import("./pages/domains/DomainSubDomainPage.jsx"));
const ContactPage = lazyPage(() => import("./pages/contact/ContactPage.jsx"));
const NotFoundPage = lazyPage(() => import("./pages/NotFoundPage.jsx"));
const PricingPagePublic = lazyPage(() => import("./pages/pricing/PricingPagePublic.jsx"));
const PartnerWithUsPage = lazyPage(() => import("./components/PartnerWithUsPage.jsx"));
const ContactThankYouPage = lazyPage(() => import("./pages/contact/ContactThankYouPage.jsx"));
const CareersThankYouPage = lazyPage(() => import("./pages/careers/CareersThankYouPage.jsx"));
const SiteDataPolicy = lazyPage(() => import("./pages/legal/SiteDataPolicy.jsx"));
const ForProvidersPage = lazyPage(() => import("./components/ForProvidersPage.jsx"));
const ForPerformersPage = lazyPage(() => import("./components/ForPerformersPage.jsx"));
const FreelancingIndiaPage = lazyPage(() => import("./pages/freelancing/FreelancingIndiaPage.jsx"));
const UseCasePage = lazyPage(() => import("./pages/use-cases/UseCasePage.jsx"));
const UseCasesIndexPage = lazyPage(() => import("./pages/use-cases/UseCasesIndexPage.jsx"));
const TaskGuidelinesPage = lazyPage(() => import("./pages/tasks/TaskGuidelinesPage.jsx"));
const DisputeResolutionPolicy = lazyPage(() => import("./pages/legal/DisputeResolutionPolicy.jsx"));
const PaymentPayoutPolicy = lazyPage(() => import("./pages/legal/PaymentPayoutPolicy.jsx"));
const ProhibitedTasksPolicy = lazyPage(() => import("./pages/legal/ProhibitedTasksPolicy.jsx"));
const TaskCompletionProofPolicy = lazyPage(() => import("./pages/legal/TaskCompletionProofPolicy.jsx"));
const PerformerVerificationOnboarding = lazyPage(() => import("./pages/performers/PerformerVerificationOnboarding.jsx"));
const ServicesIndexPage = lazyPage(() => import("./components/Services/ServicesIndexPage.jsx"));
const RetailAuditServicesPage = lazyPage(() => import("./components/Services/RetailAuditServicesPage.jsx"));
const FieldDataCollectionServicesPage = lazyPage(() => import("./components/Services/FieldDataCollectionServicesPage.jsx"));
const ContentMarketingTaskExecutionPage = lazyPage(() => import("./components/Services/ContentMarketingTaskExecutionPage.jsx"));
const MarketResearchAssistancePage = lazyPage(() => import("./components/Services/MarketResearchAssistancePage.jsx"));
const SocialMediaContentCreationServicesPage = lazyPage(() => import("./components/Services/SocialMediaContentCreationServicesPage.jsx"));
const BlogWritingServicesForStartupsPage = lazyPage(() => import("./components/Services/BlogWritingServicesForStartupsPage.jsx"));
const SEOKeywordResearchServicesPage = lazyPage(() => import("./components/Services/SEOKeywordResearchServicesPage.jsx"));
const InstagramPostDesignServicesPage = lazyPage(() => import("./components/Services/InstagramPostDesignServicesPage.jsx"));
const ShortFormVideoEditingServicesPage = lazyPage(() => import("./components/Services/ShortFormVideoEditingServicesPage.jsx"));
const HelpIndexPage = lazyPage(() => import("./components/Help/HelpIndexPage.jsx"));
const GettingStartedGuidePage = lazyPage(() => import("./components/Help/GettingStartedGuidePage.jsx"));
const PostingYourFirstTaskPage = lazyPage(() => import("./components/Help/PostingYourFirstTaskPage.jsx"));
const CompletingYourFirstTaskPage = lazyPage(() => import("./components/Help/CompletingYourFirstTaskPage.jsx"));
const CommunityIndexPage = lazyPage(() => import("./components/Community/CommunityIndexPage.jsx"));
const SuccessStoriesPage = lazyPage(() => import("./components/Community/SuccessStoriesPage.jsx"));
const TopPerformersLeaderboardPage = lazyPage(() => import("./components/Community/TopPerformersLeaderboardPage.jsx"));
const CompletedTasksExamplesPage = lazyPage(() => import("./components/Community/CompletedTasksExamplesPage.jsx"));
const AuthPage = lazyPage(() => import("./components/provider/pages/AuthPage.jsx"));
const WelcomePage = lazyPage(() => import("./components/provider/pages/WelcomePage.jsx"));
const AccessUnlockPage = lazyPage(() => import("./pages/access/AccessUnlockPage.jsx"));
const PublicSharePage = lazyPage(() => import("./pages/public/PublicSharePage.jsx"));
const InvoiceVerificationPage = lazyPage(() => import("./pages/public/InvoiceVerificationPage.jsx"));
const ManualPageExplorer = lazyPage(() => import("./test-mode/components/ManualPageExplorer.jsx"));

function Home({ onLandingTabChange }) {
  return (
    <>
      <SEO
        title="Post Work. Get it Executed. | Task Execution Platform"
        description="OnIT India connects demand with verified performers. Post tasks, get work executed fast — task marketplace India for micro tasks, gigs, and secure payments."
        keywords="OnIT INDIA, onitindia, task execution platform, task marketplace, task marketplace India, micro task platform, instant task execution, hire people for small tasks, task coordination platform, future of work, execution infrastructure, hyperlocal tasks, gig work India, post task get done, delegate tasks, freelance tasks India"
        canonical="https://www.onitindia.com/"
        webPageSchema={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "OnIT INDIA — Task Execution Platform",
          "description": "Post work. Get it executed. OnIT INDIA connects people who need work done with performers ready to execute tasks quickly.",
          "url": "https://www.onitindia.com/"
        }}
      />
      <AnimatedSection id="home" noAnimation>
        <Landingpage onTabChange={onLandingTabChange} />
      </AnimatedSection>
    </>
  );
}

const MainContent = () => {
  const location = useLocation();
  const [, setLandingActiveTab] = useState("post");

  // Normalize path for robust matching
  const lowerPath = location.pathname.toLowerCase();

  const isFullPagePath =
    lowerPath.startsWith('/s/') ||
    lowerPath === '/verify-invoice' ||
    lowerPath === '/test-explorer' ||
    lowerPath.startsWith('/admin') ||
    lowerPath.startsWith('/provider/') ||
    lowerPath === '/provider' ||
    lowerPath.startsWith('/performer/') ||
    lowerPath === '/performer' ||
    lowerPath.startsWith('/auth') ||
    lowerPath.startsWith('/signup') ||
    lowerPath.startsWith('/register') ||
    lowerPath === '/providerlogin' ||
    lowerPath === '/performerlogin';

  /** PerformerDirectory mounts its own ScrollingInfo + Navbar + SplashCursor + padding */
  const isPerformerDirectoryPage = lowerPath === '/performers-directory';

  const isHomePage = lowerPath === '/' || lowerPath === '/home';

  // Portal paths and the custom homepage hero manage their own specialized chrome.
  const showGlobalChrome = !isHomePage && !isFullPagePath && !isPerformerDirectoryPage;

  const showDomainsNav = false;

  return (
    <div className="min-h-screen w-full font-sans antialiased">
      {showGlobalChrome && <ScrollingInfo />}
      {showGlobalChrome && <Navbar />}
      {showGlobalChrome && <SplashCursor />}
      <div
        className={
          isFullPagePath
            ? ""
            : showGlobalChrome
              ? "pt-28 md:pt-32 min-h-screen"
              : "min-h-screen"
        }
      >
        {showDomainsNav && (
          <>
            <DomainsNavBar fixedBelowHero />
            <div className="h-12 sm:h-14 flex-shrink-0" aria-hidden />
          </>
        )}
        <Routes>
          <Route path="/test-explorer" element={<ManualPageExplorer />} />
          <Route path="/s/:code" element={<PublicSharePage />} />
          <Route path="/verify-invoice" element={<InvoiceVerificationPage />} />
          <Route path="/" element={<Home onLandingTabChange={setLandingActiveTab} />} />
          <Route path="/home" element={<Home onLandingTabChange={setLandingActiveTab} />} />
          <Route path="/freelancing" element={<FreelancingIndiaPage />} />
          <Route path="/providerlogin" element={<AuthRoleRedirect role="PROVIDER" />} />
          <Route path="/performerlogin" element={<AuthRoleRedirect role="TASKER" />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          <Route path="/register" element={<AuthPage initialMode="signup" />} />
          <Route path="/otp" element={<Navigate to="/auth" replace />} />
          <Route path="/provider/welcome" element={<WelcomePage />} />
          <Route path="/task-performers" element={<Task_Performers />} />
          <Route path="/performers-directory" element={<PerformerDirectory />} />
          <Route path="/domains/:slug/:subDomainSlug" element={<DomainSubDomainPage />} />
          <Route path="/domains/:slug" element={<DomainDetail />} />
          <Route path="/campus-detail" element={<CampusDetail />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/deletion" element={<Navigate to="/" replace />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/trust-safety" element={<TrustAndSafety />} />
          <Route path="/policies/:slug" element={<PolicyPage />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/why-choose-us" element={<WhyChooseUsPage />} />
          <Route path="/what-is-onit-india" element={<WhatIsOnITIndia />} />
          <Route path="/execution-infrastructure" element={<ExecutionInfrastructurePage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/tasks" element={<TaskCategories />} />
          <Route path="/tasks/:categorySlug" element={<TaskCategoryDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact/thank-you" element={<ContactThankYouPage />} />
          <Route path="/careers/thank-you" element={<CareersThankYouPage />} />
          <Route path="/pricing" element={<PricingPagePublic />} />
          <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
          <Route path="/cookie-policy" element={<SiteDataPolicy />} />
          <Route path="/use-cases" element={<UseCasesIndexPage />} />
          <Route path="/for-providers" element={<ForProvidersPage />} />
          <Route path="/for-performers" element={<ForPerformersPage />} />
          {getAllUseCaseSlugs().map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<UseCasePage slug={slug} />} />
          ))}

          <Route path="/task-guidelines" element={<TaskGuidelinesPage />} />
          <Route path="/dispute-resolution-policy" element={<DisputeResolutionPolicy />} />
          <Route path="/payment-payout-policy" element={<PaymentPayoutPolicy />} />
          <Route path="/prohibited-tasks-policy" element={<ProhibitedTasksPolicy />} />
          <Route path="/task-completion-proof-policy" element={<TaskCompletionProofPolicy />} />
          <Route path="/performer-verification-onboarding" element={<PerformerVerificationOnboarding />} />
          <Route path="/services" element={<ServicesIndexPage />} />
          <Route path="/services/retail-audit-services" element={<RetailAuditServicesPage />} />
          <Route path="/services/field-data-collection-services" element={<FieldDataCollectionServicesPage />} />
          <Route path="/services/content-marketing-task-execution" element={<ContentMarketingTaskExecutionPage />} />
          <Route path="/services/market-research-assistance" element={<MarketResearchAssistancePage />} />
          <Route path="/services/social-media-content-creation-services" element={<SocialMediaContentCreationServicesPage />} />
          <Route path="/services/blog-writing-services-for-startups" element={<BlogWritingServicesForStartupsPage />} />
          <Route path="/services/seo-keyword-research-services" element={<SEOKeywordResearchServicesPage />} />
          <Route path="/services/instagram-post-design-services" element={<InstagramPostDesignServicesPage />} />
          <Route path="/services/short-form-video-editing-services" element={<ShortFormVideoEditingServicesPage />} />
          <Route path="/community" element={<CommunityIndexPage />} />
          <Route path="/community/success-stories" element={<SuccessStoriesPage />} />
          <Route path="/community/top-performers" element={<TopPerformersLeaderboardPage />} />
          <Route path="/community/completed-tasks-examples" element={<CompletedTasksExamplesPage />} />
          <Route path="/help" element={<HelpIndexPage />} />
          <Route path="/help/getting-started" element={<GettingStartedGuidePage />} />
          <Route path="/help/posting-your-first-task" element={<PostingYourFirstTaskPage />} />
          <Route path="/help/completing-your-first-task" element={<CompletingYourFirstTaskPage />} />
          <Route path="/provider/*" element={<GatedRoute><ProviderApp /></GatedRoute>} />
          <Route path="/performer/*" element={<GatedRoute><PerformerApp /></GatedRoute>} />
          <Route path="/admin/*" element={<GatedRoute><AdminApp /></GatedRoute>} />
          <Route path="/dev/*" element={<AccessUnlockPage />} />
          <Route path="/provider" element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    if (!import.meta.env.PROD || navigator.userAgent === "ReactSnap") return undefined;

    const initializeClarity = () => {
      import("@microsoft/clarity").then(({ default: Clarity }) => {
        Clarity.init("wjlutvpx00");
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(initializeClarity, { timeout: 3000 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(initializeClarity, 1500);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <Router>
      <AppAuth0Provider>
        <AuthProvider>
          <NotificationProvider>
            <ScrollToTop />
            <SiteGate>
              <MainContent />
            </SiteGate>
            <TestModeBadge />
          </NotificationProvider>
        </AuthProvider>
      </AppAuth0Provider>
    </Router>);
}

export default App;
