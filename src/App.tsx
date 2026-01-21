import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './features/dashboard/DashboardOverview';
import ProductPage from './features/products/ProductPage';
import AddProductPage from './features/products/AddProductPage';
import OrderPage from './features/orders/OrderPage';
import AdminPage from './features/admins/AdminPage';
import CategoryPage from './features/categories/CategoryPage';
import DraftPage from './features/products/DraftPage';
import ErrorFallbackPage from './components/common/ErrorFallbackPage';

const App: React.FC = () => {
  // Initialize isAuthenticated state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem('isAuthenticated')
  );

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to login if not authenticated, or to dashboard if authenticated */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/overview" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          {/* Nested routes for the dashboard */}
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="add-product" element={<AddProductPage />} />
          <Route path="drafts-product" element={<DraftPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="admins" element={<AdminPage />} />
          <Route path="categories" element={<CategoryPage />} />
        </Route>
        <Route path="*" element={<ErrorFallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;




