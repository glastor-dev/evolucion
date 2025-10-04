import { Button } from "./ui/button";
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  ShoppingCart, 
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { ARIA_LABELS } from '../utils/accessibility';

// Import brand assets
import milwaukeeLogo from "../assets/brands/milwaukee (1).svg";
import milwaukeeNew from "../assets/brands/milwaukee (2).svg";
import totmElectricalLogo from "../assets/brands/totm-electrical-logo.svg";
import makitaLogo from "../assets/brands/makita-logo.svg";
import milwaukeeProduct from "../assets/brands/milwaukee-product.svg";
import makitaProduct from "../assets/brands/makita-product.svg";
import makitaLxtProduct from "../assets/brands/makita-lxt-product.webp";
import heroAugustGwt11z from "../assets/brands/hero-august-gwt11z.webp";
import dewaltToughDeals from "../assets/brands/dewalt-tough-deals.svg";
import metaboHptPd from "../assets/brands/metabo-hpt-pd.svg";

export const Hero = () => {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={heroRef} 
      className="bg-black relative overflow-hidden"
      role="banner"
      aria-label="Sección principal con productos destacados"
    >
      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-20 left-10 animate-bounce delay-1000">
          <Sparkles className="w-6 h-6 text-blue-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse delay-2000">
          <Star className="w-8 h-8 text-yellow-400 opacity-40" />
        </div>

      </div>

      {/* Main Banner - Trade of the Month */}
      <div className="relative bg-vue-gradient-dark text-white overflow-hidden min-h-screen flex items-center"
           role="main"
           aria-label="Producto destacado del mes"
      >
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-75"
          style={{
            backgroundImage: `url(${heroAugustGwt11z})`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/50"></div>
        </div>
        
        {/* Animated Grid Background - Hidden on mobile for better performance */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 xl:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-accent font-semibold shadow-lg animate-pulse"
                     role="status"
                     aria-label="Producto nuevo destacado"
                >
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                  NUEVAS
                </div>
                <div className="flex gap-1" role="img" aria-label="Calificación de 5 estrellas">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current animate-pulse" style={{animationDelay: `${i * 200}ms`}} aria-hidden="true" />
                  ))}
                  <span className="sr-only">Calificación: 5 de 5 estrellas</span>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold leading-tight tracking-wide">
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-pulse">
                  POTENCIA EXTREMA:
                </span>
                <br />
                <span className="text-white drop-shadow-lg">
                  1,400 FT.LBS QUE REVOLUCIONAN TU TRABAJO
                </span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed font-body max-w-2xl">
                <strong className="font-heading text-blue-400">GWT11Z Makita:</strong> La llave de impacto de 3/4" más potente del mercado. 
                <span className="text-white font-semibold bg-blue-900/30 px-2 py-1 rounded">4 velocidades XGT</span> para máximo control y yunque extendido para espacios reducidos. 
                <span className="text-blue-300">¡Termina trabajos pesados en la mitad del tiempo!</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4" role="group" aria-label="Acciones del producto">
                <button 
                  className="group relative bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-accent font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black overflow-hidden w-full sm:w-auto"
                  aria-label="Ver precio especial de la llave de impacto GWT11Z Makita"
                  type="button"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    <span className="text-sm sm:text-base">VER PRECIO ESPECIAL</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                </button>
                
                <button 
                  className="group border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-accent font-semibold transition-all duration-300 transform hover:scale-105 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
                  aria-label="Agregar llave de impacto GWT11Z Makita al carrito de compras"
                  type="button"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    <span className="text-sm sm:text-base">AGREGAR AL CARRITO</span>
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-700" 
                   role="region" 
                   aria-label="Especificaciones técnicas del producto"
              >
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400" aria-label="1,400 libras-pie de torque">1,400</div>
                  <div className="text-xs sm:text-sm text-gray-400">FT.LBS TORQUE</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400" aria-label="4 velocidades disponibles">4</div>
                  <div className="text-xs sm:text-sm text-gray-400">VELOCIDADES</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-400" aria-label="Tecnología XGT">XGT</div>
                  <div className="text-xs sm:text-sm text-gray-400">TECNOLOGÍA</div>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'} order-first lg:order-last`}>
              <div className="relative">
                {/* Glowing Effect - Hidden on mobile for better performance */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-full blur-3xl animate-pulse hidden sm:block"></div>
                
                {/* Product Image */}
                <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                  <img 
                    src={heroAugustGwt11z} 
                    alt="Makita GWT11Z" 
                    className="w-full h-auto max-w-sm sm:max-w-md lg:max-w-lg mx-auto drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Cards Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          
          {/* Milwaukee Card */}
          <div className="group bg-gradient-to-br from-red-900 to-black text-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-red-800/30" style={{animationDelay: '100ms'}}>
            {/* Product Image Background */}
            <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
              <img 
                src={milwaukeeNew} 
                alt="Milwaukee Tools" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 to-transparent"></div>

              <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                OFERTA
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold mb-2 sm:mb-3 group-hover:text-red-300 transition-colors">LIBERA EL PODER</h3>
              <p className="text-red-100 mb-4 sm:mb-5 lg:mb-6 font-body leading-relaxed text-sm sm:text-base line-clamp-3">
                Obtenga una batería o llave de impacto <span className="text-red-300 font-bold">GRATIS</span> con compras seleccionadas de Milwaukee M18
              </p>
              
              <Button 
                variant="outline" 
                className="border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white font-accent font-bold px-4 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 w-full group-hover:scale-105 transform text-sm sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  COMPRA AHORA
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

          {/* DeWalt Card */}
          <div className="group bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-yellow-600/30" style={{animationDelay: '200ms'}}>
            {/* Product Image Background */}
            <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
              <img 
                src={dewaltToughDeals} 
                alt="DeWalt Tough Deals" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/60 to-transparent"></div>
              <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-black text-yellow-400 px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-bounce">
                TOUGH DEALS
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-black to-gray-800"></div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold mb-2 sm:mb-3 group-hover:text-gray-800 transition-colors">OFERTAS RESISTENTES</h3>
              <p className="text-black/80 mb-4 sm:mb-5 lg:mb-6 font-body leading-relaxed text-sm sm:text-base line-clamp-3">
                Herramientas DeWalt de <span className="text-black font-bold">calidad profesional</span> con descuentos especiales
              </p>
              
              <Button 
                variant="outline" 
                className="border-2 border-black bg-black text-yellow-400 hover:bg-yellow-400 hover:text-black font-accent font-bold px-4 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 w-full group-hover:scale-105 transform text-sm sm:text-base shadow-lg"
              >
                <span className="flex items-center justify-center gap-2 font-bold">
                  COMPRA AHORA
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

          {/* Makita Card */}
          <div className="group bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-teal-500/30" style={{animationDelay: '300ms'}}>
            {/* Product Image Background */}
            <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
              <img 
                src={makitaLxtProduct} 
                alt="Makita LXT Tools" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-800/80 to-transparent"></div>
              <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 transform group-hover:scale-110 transition-transform duration-300">
                <div className="text-white font-bold text-sm sm:text-base lg:text-lg drop-shadow-lg">
                  MAKITA
                </div>
              </div>
              <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white text-teal-600 px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg z-10 border-2 border-teal-600">
                LXT
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-500"></div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold mb-2 sm:mb-3 group-hover:text-teal-200 transition-colors">SERIE LXT MAKITA</h3>
              <p className="text-teal-100 mb-4 sm:mb-5 lg:mb-6 font-body leading-relaxed text-sm sm:text-base line-clamp-3">
                Herramientas inalámbricas de 18V con <span className="text-teal-200 font-bold">tecnología LXT</span> de Makita
              </p>
              
              <Button 
                variant="outline" 
                className="border-2 border-teal-300 text-teal-300 hover:bg-teal-300 hover:text-teal-800 font-accent font-bold px-4 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 w-full group-hover:scale-105 transform text-sm sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  Explorar herramientas
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

          {/* Metabo HPT Card */}
          <div className="group bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-green-500/30" style={{animationDelay: '400ms'}}>
            {/* Product Image Background */}
            <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden">
              <img 
                src={metaboHptPd} 
                alt="Metabo HPT Tools" 
                className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-800/80 to-transparent"></div>
              <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 bg-white text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                METABO HPT
              </div>
              <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 bg-white text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                ALEMÁN
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold mb-2 sm:mb-3 group-hover:text-green-200 transition-colors">POTENCIA ALEMANA</h3>
              <p className="text-green-100 mb-4 sm:mb-5 lg:mb-6 font-body leading-relaxed text-sm sm:text-base line-clamp-3">
                Herramientas Metabo HPT con <span className="text-green-200 font-bold">ingeniería alemana</span> y rendimiento superior
              </p>
              
              <Button 
                variant="outline" 
                className="border-2 border-green-300 text-green-300 hover:bg-green-300 hover:text-green-800 font-accent font-bold px-4 sm:px-5 lg:px-6 py-2 sm:py-3 rounded-xl transition-all duration-300 w-full group-hover:scale-105 transform text-sm sm:text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  Explorar herramientas
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
