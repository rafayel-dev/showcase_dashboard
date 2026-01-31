import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import ErrorFallbackPage from "./components/common/ErrorFallbackPage";
import AppSpin from "./components/common/AppSpin";

// Lazy Load Pages
const LoginPage = React.lazy(() => import("./features/auth/LoginPage"));
const ForgotPasswordPage = React.lazy(() => import("./features/auth/ForgotPasswordPage"));
const OtpVerifyPage = React.lazy(() => import("./features/auth/OtpVerifyPage"));
const ResetPasswordPage = React.lazy(() => import("./features/auth/ResetPasswordPage"));

const DashboardOverview = React.lazy(() => import("./features/dashboard/DashboardOverview"));
const ProductPage = React.lazy(() => import("./features/products/ProductPage"));
const AddProductPage = React.lazy(() => import("./features/products/AddProductPage"));
const DraftPage = React.lazy(() => import("./features/products/DraftPage"));
const OrderPage = React.lazy(() => import("./features/orders/OrderPage"));
const AdminPage = React.lazy(() => import("./features/admins/AdminPage"));
const CategoryPage = React.lazy(() => import("./features/categories/CategoryPage"));
const PrivacyPage = React.lazy(() => import("./features/setting/PrivacyPage"));
const TermsPage = React.lazy(() => import("./features/setting/TermsPage"));
const AboutPage = React.lazy(() => import("./features/setting/AboutPage"));
const NotificationPage = React.lazy(() => import("./features/notifications/NotificationPage"));
const CouponPage = React.lazy(() => import("./features/coupons/CouponPage"));
const SliderPage = React.lazy(() => import("./features/slider/SliderPage"));

const Loading: React.FC = () => <AppSpin />;

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    !!localStorage.getItem("isAuthenticated")
  );

  React.useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
    }
  }, [isAuthenticated]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/overview" replace /> : <Navigate to="/login" replace />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={
          <Suspense fallback={<Loading />}>
            <LoginPage onLogin={handleLogin} />
          </Suspense>
        } />

        <Route path="/forgot-password" element={
          <Suspense fallback={<Loading />}>
            <ForgotPasswordPage />
          </Suspense>
        } />

        <Route path="/otp-verify" element={
          <Suspense fallback={<Loading />}>
            <OtpVerifyPage />
          </Suspense>
        } />

        <Route path="/reset-password" element={
          <Suspense fallback={<Loading />}>
            <ResetPasswordPage />
          </Suspense>
        } />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<ProtectedRoute><DashboardLayout onLogout={handleLogout} /></ProtectedRoute>}>
          <Route path="overview" element={<Suspense fallback={<Loading />}><DashboardOverview /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<Loading />}><ProductPage /></Suspense>} />
          <Route path="add-product" element={<Suspense fallback={<Loading />}><AddProductPage /></Suspense>} />
          <Route path="edit-product/:productId" element={<Suspense fallback={<Loading />}><AddProductPage /></Suspense>} />
          <Route path="drafts-product" element={<Suspense fallback={<Loading />}><DraftPage /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<Loading />}><OrderPage /></Suspense>} />
          <Route path="admins" element={<Suspense fallback={<Loading />}><AdminPage /></Suspense>} />
          <Route path="coupons" element={<Suspense fallback={<Loading />}><CouponPage /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<Loading />}><CategoryPage /></Suspense>} />
          <Route path="privacy" element={<Suspense fallback={<Loading />}><PrivacyPage /></Suspense>} />
          <Route path="terms" element={<Suspense fallback={<Loading />}><TermsPage /></Suspense>} />
          <Route path="about" element={<Suspense fallback={<Loading />}><AboutPage /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<Loading />}><NotificationPage /></Suspense>} />
          <Route path="sliders" element={<Suspense fallback={<Loading />}><SliderPage /></Suspense>} />
        </Route>

        <Route path="*" element={<ErrorFallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
