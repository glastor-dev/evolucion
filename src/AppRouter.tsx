import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { usePerformanceMetrics, useWebVitals } from "@/hooks/useWebVitals";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/theme-context";
import { ToastProvider } from "@/components/ui/toast";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AbandonedCartBanner } from "@/components/ui/AbandonedCartBanner";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages - Direct Import
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ServicesPage from "@/pages/ServicesPage";
import AboutPage from "@/pages/AboutPage";

// Lazy-load de páginas para mejorar performance
const ProductDetailModern = React.lazy(() => import("@/pages/ProductDetailModern"));
const WarrantyPolicy = React.lazy(() => import("@/pages/WarrantyPolicy"));
const ShippingPolicy = React.lazy(() => import("@/pages/ShippingPolicy"));

const AppRouter: React.FC = () => {
  const location = useLocation();

  // Inicializar métricas de rendimiento
  usePerformanceMetrics();
  useWebVitals();

  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <FavoritesProvider>
            <ToastProvider>
              <ErrorBoundary>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-grow">
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes location={location}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/tienda" element={<ShopPage />} />
                        <Route path="/tienda/:id" element={<ProductDetailModern />} />
                        <Route path="/servicios" element={<ServicesPage />} />
                        <Route path="/nosotros" element={<AboutPage />} />
                        <Route path="/garantia" element={<WarrantyPolicy />} />
                        <Route path="/envios" element={<ShippingPolicy />} />
                        <Route path="*" element={<div>Not Found</div>} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                  <CartDrawer />
                  <FavoritesPanel />
                  <WhatsAppButton />
                  <AbandonedCartBanner />
                </div>
              </ErrorBoundary>
            </ToastProvider>
          </FavoritesProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default AppRouter;
