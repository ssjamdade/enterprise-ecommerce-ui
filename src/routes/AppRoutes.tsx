import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../features/home/pages/HomePage";
import LoginPage from "../features/auth/pages/LoginPage";
import AdminLoginPage from "../features/auth/pages/AdminLoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProductCatalogPage from "../features/products/pages/ProductCatalogPage";
import ProductDetailPage from "../features/products/pages/ProductDetailPage";
import CartPage from "../features/cart/pages/CartPage";
import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import OrderConfirmationPage from "../features/orders/pages/OrderConfirmationPage";
import OrderHistoryPage from "../features/orders/pages/OrderHistoryPage";
import SellerKycPage from "../features/seller/pages/SellerKycPage";
import SellerProductsPage from "../features/seller/pages/SellerProductsPage";
import AdminKycReviewPage from "../features/seller/pages/AdminKycReviewPage";
import AdminCategoriesPage from "../features/categories/pages/AdminCategoriesPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { useSessionWatcher } from "../features/auth/hooks/useSessionWatcher";

function SessionMonitor() {
  useSessionWatcher();
  return null;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <SessionMonitor />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductCatalogPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Authenticated Customer Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id/confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />

        {/* Seller Onboarding & KYC Routes */}
        <Route
          path="/seller/kyc"
          element={
            <ProtectedRoute>
              <SellerKycPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute>
              <SellerProductsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Compliance & KYC Review Routes */}
        <Route
          path="/admin/kyc"
          element={
            <AdminRoute>
              <AdminKycReviewPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategoriesPage />
            </AdminRoute>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
