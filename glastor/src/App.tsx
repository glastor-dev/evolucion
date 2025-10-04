import { Videos } from "./components/Videos";
import { CookieConsent } from "./components/CookieConsent";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { Navbar } from "./components/Navbar";
import { BenefitsBar } from "./components/BenefitsBar";


import { Slider } from "./components/Slider";

import { Testimonials } from "./components/Testimonials";
import { Routes, Route } from 'react-router-dom';
import StorePage from './pages/Store';
import AboutPage from './pages/About';
import { HelmetProvider } from 'react-helmet-async';
import { useWebVitals, usePerformanceMetrics } from './hooks/useWebVitals';
import { SEO } from './components/SEO';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/theme-context';
import { ToastProvider } from './components/ui/toast';
import { ErrorBoundary } from './components/ui/error-boundary';
import { CartDrawer } from "./components/CartDrawer";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { WhatsAppButton } from "./components/WhatsAppButton";
import "./App.css";

function App() {
  // Monitoreo de Web Vitals (solo en desarrollo)
  useWebVitals({
    debug: import.meta.env.DEV,
    reportToAnalytics: import.meta.env.PROD,
  });

  // Métricas de rendimiento adicionales
  usePerformanceMetrics();

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="system">
          <ToastProvider>
            <FavoritesProvider>
              <CartProvider>
                <SEO 
                  title="Glastor - Herramientas Profesionales Makita | Equipos de Construcción y Jardinería"
                  description="Descubre la mejor selección de herramientas profesionales Makita en Glastor. Taladros, sierras, lijadoras y equipos de jardinería con la máxima calidad y potencia. Envío gratis en pedidos superiores a $50."
                  keywords="Makita, herramientas profesionales, taladros, sierras, lijadoras, jardinería, construcción, equipos eléctricos, batería, inalámbricos, Colombia, Glastor"
                  image="https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp"
                  type="website"
                />
                {/* Enlace de accesibilidad para saltar al contenido principal */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md focus:ring-2 focus:ring-primary"
                >
                  Saltar al contenido
                </a>
                <Navbar />
                <BenefitsBar />
                <main id="main-content" role="main" tabIndex={-1}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <Hero />
                          <Slider />
                          <Videos />
                          <HowItWorks />
                          <Testimonials />
                        </>
                      }
                    />
                    <Route path="/tienda" element={<StorePage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </main>
                <Footer />
                <CookieConsent />
                <CartDrawer />
                <FavoritesPanel />
                <WhatsAppButton 
                  variant="floating"
                  phoneNumber="+5491132578591"
                  message="¡Hola! Me interesa conocer más sobre sus productos Makita."
                />
              </CartProvider>
            </FavoritesProvider>
          </ToastProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
