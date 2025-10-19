import React from "react";
import { handleSmoothNavigation } from "../utils/navigation";
import { SEO } from "../components/SEO";
import { Hero } from "../components/Hero";
import { Slider } from "../components/Slider";
import ProductCatalog from "../components/ProductCatalog";
import { Testimonials } from "../components/Testimonials";
import { CookieConsent } from "../components/CookieConsent";
import { CookieSettingsButton } from "../components/CookieSettings";
import { HeroSkeleton } from "../components/ui/skeletons";
import { getAllProducts } from "@/services/localProducts";
import { Product } from "@/services/productSchema";

const HomePage: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Cargar productos
    const fetchProducts = async () => {
      try {
        const { products: fetchedProducts, error: fetchError } = await getAllProducts();
        if (!fetchedProducts || fetchedProducts.length === 0) {
          setError('No se encontraron productos');
        } else {
          setProducts(fetchedProducts);
          setError(null);
          console.log(`✅ ${fetchedProducts.length} productos cargados correctamente`);
        }
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar productos');
      }
    };

    // Simular carga inicial y cargar productos
    const timer = setTimeout(() => {
      setLoading(false);
      fetchProducts();
    }, 1200);

    // Rehabilitar sincronización del proceso al volver a Home
    try { sessionStorage.removeItem("disable-process-url-sync"); } catch {}

    // Scroll pendiente o deep link ?target= en HashRouter
    try {
      const url = new URL(window.location.href);
      let target = url.searchParams.get("target");
      if (!target) {
        target = sessionStorage.getItem("pending-scroll-target");
      }
      if (target) {
        sessionStorage.removeItem("pending-scroll-target");
        // limpiar el parámetro target de la URL sin recargar
        const { origin, pathname, hash } = window.location;
        window.history.replaceState(null, "", `${origin}${pathname}${hash.split("?")[0]}`);
        setTimeout(() => handleSmoothNavigation(`#${target}`), 120);
      }
    } catch {}
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO
        title="Glastor - Herramientas Profesionales Makita | Equipos de Construcción y Jardinería"
        description="Descubre la mejor selección de herramientas profesionales Makita en Glastor. Taladros, sierras, lijadoras y equipos de jardinería con la máxima calidad y potencia. Envío gratis en pedidos superiores a $50."
        keywords="Makita, herramientas profesionales, taladros, sierras, lijadoras, jardinería, construcción, equipos eléctricos, batería, inalámbricos, Colombia, Glastor"
        image="https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp"
        type="website"
      />

      {loading ? (
        <HeroSkeleton />
      ) : (
        <Hero />
      )}
      <Slider />
      {/* Catálogo con productos cargados */}
      <ProductCatalog products={products} />
      <Testimonials />
      <CookieConsent />
      <CookieSettingsButton />
    </>
  );
};

export default HomePage;
