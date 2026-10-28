/* eslint-disable react-refresh/only-export-components -- application entry point */
import React, { Suspense } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    if (error.message && error.message.includes("310")) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", fontFamily: "system-ui", maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ color: "#004d43" }}>Something went wrong</h1>
          <p>The site could not load. Try refreshing the page.</p>
          <pre style={{ background: "#f5f5f5", padding: "1rem", overflow: "auto", fontSize: "12px" }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const LoadingFallback = () => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
    <div style={{ width: '40px', height: '40px', border: '4px solid #10b981', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

const rootElement = document.getElementById("root");

if (navigator.userAgent === "ReactSnap") {
  window.snapSaveState = () => {
    rootElement.dataset.prerendered = "true";
  };
}

const application = (
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);

if (rootElement.hasChildNodes() && rootElement.dataset.prerendered === "true") {
  hydrateRoot(rootElement, application);
} else {
  createRoot(rootElement).render(application);
}
