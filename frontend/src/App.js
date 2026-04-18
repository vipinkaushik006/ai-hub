import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminCreateBlog from "./pages/AdminCreateBlog";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

// ✅ Lazy load all pages — each becomes its own chunk
// Only the current page's JS is downloaded on first visit
const HomePage = lazy(() => import("./pages/HomePage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage"));
const ToolDetailPage = lazy(() => import("./pages/ToolDetailPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const DevToolsPage = lazy(() => import("./pages/DevToolsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const BookmarksPage = lazy(() => import("./pages/BookmarksPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// ─────────────────────────────────────────────
// Route guards
// ─────────────────────────────────────────────

// ✅ Blocks unauthenticated users — shows nothing while auth loads
const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// ✅ Blocks non-admin users — redirects to home
const AdminRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

// ✅ Redirects logged-in users away from login/register
const GuestRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return !user ? <Outlet /> : <Navigate to="/" replace />;
};

// ✅ Minimal full-screen loader shown during lazy chunk loading
// and while auth state is being resolved
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-900">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────
function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        {/* ✅ BrowserRouter — clean URLs, SEO-friendly, works on Vercel */}
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-dark-900">
            <Navbar />

            <main className="flex-1">
              {/* ✅ Suspense required for lazy() — shows loader during chunk fetch */}
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/tools/:slug" element={<ToolDetailPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogDetailPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/dev-tools" element={<DevToolsPage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/sitemap" element={<Sitemap />} />

                  {/* ✅ Guest-only routes — redirect to / if already logged in */}
                  <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage />}
                    />
                  </Route>

                  {/* ✅ Protected routes — redirect to /login if not authenticated */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/bookmarks" element={<BookmarksPage />} />
                  </Route>

                  {/* ✅ Admin-only routes — redirect to / if not admin */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminPage />} />
                    <Route
                      path="/admin/create-blog"
                      element={<AdminCreateBlog />}
                    />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>

          {/* ✅ Toaster inside Router so toast actions can use navigation */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.1)",
              },
              duration: 4000, // ✅ Auto-dismiss after 4s
            }}
          />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
