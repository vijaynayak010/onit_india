import React from 'react';
import { useLocation } from 'react-router-dom';
import ComingSoonPage from './ComingSoonPage';
import { isTestModeEnabled } from '../test-mode/testModeConfig';

const PUBLIC_PATH_PREFIXES = [
    '/about',
    '/blog',
    '/campus-detail',
    '/community',
    '/contact',
    '/careers',
    '/cookie-policy',
    '/dispute-resolution-policy',
    '/domains',
    '/execution-infrastructure',
    '/faqs',
    '/for-performers',
    '/for-providers',
    '/freelancing',
    '/help',
    '/how-it-works',
    '/partner-with-us',
    '/payment-payout-policy',
    '/performer-verification-onboarding',
    '/performers-directory',
    '/policies',
    '/pricing',
    '/privacy-policy',
    '/prohibited-tasks-policy',
    '/refund-policy',
    '/services',
    '/s',
    '/task-completion-proof-policy',
    '/task-guidelines',
    '/task-performers',
    '/tasks',
    '/terms-and-conditions',
    '/trust-safety',
    '/use-cases',
    '/what-is-onit-india',
    '/why-choose-us',
    '/verify-invoice',
    '/for-startups',
    '/for-creators',
    '/for-businesses',
    '/for-marketers',
    '/for-agencies',
    '/for-enterprises',
    '/for-researchers',
    '/for-ecommerce',
];

/** Auth flows must work without visiting /dev first */
const AUTH_PATH_PREFIXES = [
    '/auth',
    '/otp',
    '/provider/welcome',
    '/provider/restore-account',
    '/performer/restore-account',
    '/admin-login',
    '/providerlogin',
    '/performerlogin',
];

const isPublicPath = (pathname) => {
    if (pathname === '/' || pathname === '/home') return true;
    return PUBLIC_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
};

const isAuthPath = (pathname) =>
    AUTH_PATH_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );

const isAppPath = (pathname) =>
    pathname === '/provider' ||
    pathname.startsWith('/provider/') ||
    pathname === '/performer' ||
    pathname.startsWith('/performer/') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

/**
 * SiteGate - Shows a coming-soon barrier for unauthenticated visitors on gated routes.
 * Public marketing pages (home, about, blog, contact, etc.) are always accessible.
 */
const SiteGate = ({ children }) => {
    const location = useLocation();

    if (isTestModeEnabled()) {
        return children;
    }

    const ACCESS_KEY = 'onit_dev_access_2026';
    const isDevUnlocked = localStorage.getItem(ACCESS_KEY) === 'granted';
    const isAuthenticated = !!localStorage.getItem('onit_token');

    const isAssetPath = /\.(jpg|jpeg|png|gif|pdf|docx?|doc|txt|webp)$/i.test(location.pathname) ||
                       location.pathname.includes('/kyc-documents/') ||
                       location.pathname.includes('/candidate-resumes/');

    const isDevPath = location.pathname.startsWith('/dev');
    const isPublic = isPublicPath(location.pathname);
    const isAuth = isAuthPath(location.pathname);
    const isProtectedApp = isAppPath(location.pathname);

    if (!isDevUnlocked && !isAuthenticated && !isAssetPath && !isDevPath && !isPublic && !isAuth && isProtectedApp) {
        console.warn("[SITE-GATE] Access blocked. Rendering Coming Soon page.");
        return <ComingSoonPage />;
    }

    return children;
};

export default SiteGate;
