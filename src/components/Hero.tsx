import { Button } from "./ui/button";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Award, ShoppingCart, Star, TrendingUp, Zap } from "lucide-react";
import "./hero-advanced.css";

// Import brand assets
import milwaukeeNew from "../assets/brands/milwaukee (2).svg";
import makitaLxtProduct from "../assets/brands/makita-lxt-product.webp";
import heroAugustGwt11z from "../assets/brands/hero-august-gwt11z.webp";
import dewaltToughDeals from "../assets/brands/dewalt-tough-deals.svg";
import metaboHptPd from "../assets/brands/metabo-hpt-pd.svg";

export const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Dynamic Particle System */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        {/* Floating geometric elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            {i % 3 === 0 ? (
              <div
                className="w-2 h-2 bg-vue-primary/30 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 300}ms` }}
              />
            ) : i % 3 === 1 ? (
              <Star
                className="w-3 h-3 text-vue-secondary/40 animate-spin"
                style={{ animationDuration: "8s", animationDelay: `${i * 200}ms` }}
              />
            ) : (
              <div
                className="w-1 h-8 bg-gradient-to-t from-vue-primary/20 to-transparent animate-pulse"
                style={{ animationDelay: `${i * 400}ms` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Cinematic Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        role="main"
        aria-label="Producto destacado del mes"
      >
        {/* Multi-layer Background System */}
        <div className="absolute inset-0 z-0">
          {/* Primary background with dynamic blur */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{
              backgroundImage: `url(${heroAugustGwt11z})`,
              transform: `translateY(${scrollY * 0.3}px) scale(1.1)`,
              filter: isVisible ? "blur(2px)" : "blur(4px)",
            }}
          />

          {/* Cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-br from-vue-primary/20 via-transparent to-vue-secondary/10" />
        </div>

        {/* Advanced Grid Pattern */}
        <div className="absolute inset-0 opacity-5 z-5 hidden lg:block">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
                linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px, 150px 150px, 50px 50px, 50px 50px",
              animation: "grid-flow 25s linear infinite",
            }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-8 sm:space-y-12">
              {/* Status Badges */}
              <div
                className={`flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 transition-all duration-1000 delay-300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-vue-primary/20 to-vue-secondary/20 backdrop-blur-xl border border-vue-primary/30 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl">
                  <TrendingUp className="w-5 h-5 text-vue-primary" aria-hidden="true" />
                  <span>PRODUCTO DEL MES</span>
                  <Award className="w-5 h-5 text-vue-secondary" aria-hidden="true" />
                </div>

                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-vue-secondary/30 px-4 py-2 rounded-xl">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-vue-secondary fill-current animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                  <span className="text-vue-secondary font-bold ml-2">4.9</span>
                </div>
              </div>

              {/* Hero Title - Dramatically Enhanced */}
              <div
                className={`space-y-6 transition-all duration-1000 delay-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.85] tracking-tight">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-vue-primary via-vue-primary/80 to-vue-secondary animate-pulse">
                    POTENCIA
                  </span>
                  <span className="block text-white drop-shadow-2xl mt-2">EXTREMA</span>
                  <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-gray-300 font-light mt-4">
                    1,400 FT.LBS DE REVOLUCIÓN
                  </span>
                </h1>
              </div>

              {/* Enhanced Description */}
              <div
                className={`max-w-4xl mx-auto space-y-6 transition-all duration-1000 delay-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 leading-relaxed font-light">
                  <strong className="text-vue-primary font-bold">GWT11Z Makita:</strong> La herramienta
                  que redefine los estándares profesionales
                </p>

                <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                  <span className="px-4 py-2 bg-vue-primary/40 border border-vue-primary/50 text-vue-primary rounded-full backdrop-blur-sm">
                    4 Velocidades XGT
                  </span>
                  <span className="px-4 py-2 bg-vue-secondary/40 border border-vue-secondary/50 text-vue-secondary rounded-full backdrop-blur-sm">
                    Yunque Extendido
                  </span>
                  <span className="px-4 py-2 bg-vue-primary/30 border border-vue-primary/40 text-vue-primary rounded-full backdrop-blur-sm">
                    Control Máximo
                  </span>
                </div>
              </div>

              {/* Revolutionary CTA Section */}
              <div
                className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-900 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <button
                  className="group relative overflow-hidden bg-gradient-to-r from-vue-primary to-vue-secondary text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-vue-primary/30 hover:shadow-vue-secondary/50 focus:outline-none focus:ring-4 focus:ring-vue-primary/50 w-full sm:w-auto max-w-xs"
                  aria-label="Ver precio especial de la llave de impacto GWT11Z Makita"
                  type="button"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>PRECIO ESPECIAL</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-vue-primary to-vue-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
                </button>

                <button
                  className="group relative overflow-hidden bg-white/5 backdrop-blur-xl border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 w-full sm:w-auto max-w-xs focus:outline-none focus:ring-4 focus:ring-white/20"
                  aria-label="Agregar llave de impacto GWT11Z Makita al carrito de compras"
                  type="button"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span>AGREGAR</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>

              {/* Enhanced Stats Dashboard */}
              <div
                className={`transition-all duration-1000 delay-1100 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="inline-flex items-center gap-8 sm:gap-12 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl px-8 py-6 shadow-2xl">
                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-vue-primary group-hover:scale-110 transition-transform duration-300">
                      1,400
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 font-medium">
                      FT.LBS TORQUE
                    </div>
                  </div>

                  <div className="w-px h-12 bg-white/20" />

                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-vue-secondary group-hover:scale-110 transition-transform duration-300">
                      4
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 font-medium">VELOCIDADES</div>
                  </div>

                  <div className="w-px h-12 bg-white/20" />

                  <div className="text-center group cursor-pointer">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-vue-primary group-hover:scale-110 transition-transform duration-300">
                      XGT
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400 font-medium">TECNOLOGÍA</div>
                  </div>
                </div>
              </div>

              {/* Product Showcase Integration */}
              <div
                className={`mt-16 transition-all duration-1000 delay-1300 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="relative max-w-2xl mx-auto">
                  {/* Floating product image */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-vue-primary/30 to-vue-secondary/30 rounded-full blur-3xl animate-pulse scale-150" />
                    <OptimizedImage
                      src={heroAugustGwt11z}
                      alt="Makita GWT11Z - Llave de impacto profesional"
                      className="relative z-10 w-full h-auto max-w-md mx-auto drop-shadow-2xl group-hover:scale-105 transition-all duration-700 filter brightness-110"
                      aspectRatio="square"
                      priority={true}
                    />

                    {/* Interactive hotspots */}
                    <div
                      className="absolute top-1/4 left-1/4 w-4 h-4 bg-vue-primary rounded-full animate-ping cursor-pointer"
                      title="4 velocidades XGT"
                    />
                    <div
                      className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-vue-secondary rounded-full animate-ping cursor-pointer"
                      title="1,400 FT.LBS"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-xs font-medium">DESCUBRE MÁS</span>
            <div className="w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Promotional Cards Grid - Cinematic Version */}
      <div className="relative py-20 overflow-hidden">
        {/* Fondo cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-pink-900/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-900/40 to-black"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Título cinematográfico */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-vue-primary via-vue-primary/70 to-vue-secondary bg-clip-text text-transparent animate-pulse">
                MARCAS ÉLITE
              </span>
              <span className="relative bg-gradient-to-r from-white via-gray-200 to-vue-primary/60 bg-clip-text text-transparent">
                MARCAS ÉLITE
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-vue-primary/20 via-vue-secondary/20 to-vue-primary/10 blur-3xl animate-pulse"></div>
            </h2>
            <p className="text-xl text-cyan-100/80 max-w-3xl mx-auto">
              Descubre la excelencia en herramientas profesionales con tecnología de vanguardia
            </p>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            {/* Milwaukee Card - Cinematic */}
            <div
              className="group cursor-pointer perspective-1000"
              style={{ animationDelay: "100ms" }}
            >
              <div className="relative h-full overflow-hidden bg-black/80 border border-red-500/20 backdrop-blur-xl hover:border-red-400/60 transition-all duration-700 transform-gpu rounded-2xl hover:scale-105 hover:rotate-y-5 hover:shadow-[0_50px_100px_-20px_rgba(239,68,68,0.4)]">
                {/* Holographic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black/50 to-red-800/20"></div>

                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#ef4444_25%,transparent_25%),linear-gradient(-45deg,#ef4444_25%,transparent_25%)] bg-[length:15px_15px] group-hover:animate-pulse"></div>

                {/* Product Image Background with holographic effects */}
                <div className="relative h-40 lg:h-48 overflow-hidden">
                  <img
                    src={milwaukeeNew}
                    alt="Milwaukee Tools"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 via-red-900/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  {/* Holographic badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border border-red-400/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                    <span className="relative z-10 animate-pulse">OFERTA ESPECIAL</span>
                  </div>

                  {/* Scanning line effect */}
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-70 animate-[scan_2s_ease-in-out_infinite]"
                    style={{ top: "50%" }}
                  ></div>
                </div>

                <div className="relative p-6 z-10">
                  {/* Glowing top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/50"></div>

                  {/* Title with glow effect */}
                  <h3 className="text-2xl font-black mb-4 relative group-hover:text-red-300 transition-colors duration-500">
                    <span className="relative z-10">LIBERA EL PODER</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </h3>

                  <p className="text-red-100/90 mb-6 leading-relaxed text-sm">
                    Obtenga una batería o llave de impacto{" "}
                    <span className="text-red-300 font-bold bg-red-900/30 px-2 py-1 rounded">
                      GRATIS
                    </span>{" "}
                    con compras seleccionadas de Milwaukee M18
                  </p>

                  <Button
                    variant="outline"
                    className="relative w-full bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-400/50 text-red-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-wide">
                      COMPRA AHORA
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-red-400/30 group-hover:border-red-400/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-red-400/30 group-hover:border-red-400/70 transition-colors duration-500"></div>
              </div>
            </div>

            {/* DeWalt Card - Cinematic */}
            <div
              className="group cursor-pointer perspective-1000"
              style={{ animationDelay: "200ms" }}
            >
              <div className="relative h-full overflow-hidden bg-gradient-to-br from-yellow-900/20 via-black/80 to-yellow-800/20 border border-yellow-500/20 backdrop-blur-xl hover:border-yellow-400/60 transition-all duration-700 transform-gpu rounded-2xl hover:scale-105 hover:rotate-y-5 hover:shadow-[0_50px_100px_-20px_rgba(234,179,8,0.4)]">
                {/* Holographic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 via-black/50 to-yellow-600/30"></div>

                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(45deg,#eab308_25%,transparent_25%),linear-gradient(-45deg,#eab308_25%,transparent_25%)] bg-[length:15px_15px] group-hover:animate-pulse"></div>

                {/* Product Image Background with holographic effects */}
                <div className="relative h-40 lg:h-48 overflow-hidden">
                  <img
                    src={dewaltToughDeals}
                    alt="DeWalt Tough Deals"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-yellow-900/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  {/* Holographic badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-black via-gray-800 to-black text-yellow-400 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border border-yellow-400/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-2xl"></div>
                    <span className="relative z-10 animate-bounce">TOUGH DEALS</span>
                  </div>

                  {/* Scanning line effect */}
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-70 animate-[scan_2s_ease-in-out_infinite_0.5s]"
                    style={{ top: "50%" }}
                  ></div>
                </div>

                <div className="relative p-6 z-10">
                  {/* Glowing top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-500/50"></div>

                  {/* Title with glow effect */}
                  <h3 className="text-2xl font-black mb-4 relative text-yellow-300 group-hover:text-yellow-200 transition-colors duration-500">
                    <span className="relative z-10">OFERTAS RESISTENTES</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </h3>

                  <p className="text-yellow-100/90 mb-6 leading-relaxed text-sm">
                    Herramientas DeWalt de{" "}
                    <span className="text-yellow-200 font-bold bg-yellow-900/30 px-2 py-1 rounded">
                      calidad profesional
                    </span>{" "}
                    con descuentos especiales
                  </p>

                  <Button
                    variant="outline"
                    className="relative w-full bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-400/50 text-yellow-300 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 hover:text-black font-bold py-3 rounded-xl transition-all duration-300 overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-wide">
                      COMPRA AHORA
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-yellow-400/30 group-hover:border-yellow-400/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-yellow-400/30 group-hover:border-yellow-400/70 transition-colors duration-500"></div>
              </div>
            </div>

            {/* Makita Card - Cinematic */}
            <div
              className="group cursor-pointer perspective-1000"
              style={{ animationDelay: "300ms" }}
            >
              <div className="relative h-full overflow-hidden bg-gradient-to-br from-teal-900/20 via-black/80 to-teal-800/20 border border-teal-500/20 backdrop-blur-xl hover:border-teal-400/60 transition-all duration-700 transform-gpu rounded-2xl hover:scale-105 hover:rotate-y-5 hover:shadow-[0_50px_100px_-20px_rgba(20,184,166,0.4)]">
                {/* Holographic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900/30 via-black/50 to-teal-700/30"></div>

                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(45deg,#14b8a6_25%,transparent_25%),linear-gradient(-45deg,#14b8a6_25%,transparent_25%)] bg-[length:15px_15px] group-hover:animate-pulse"></div>

                {/* Product Image Background with holographic effects */}
                <div className="relative h-40 lg:h-48 overflow-hidden">
                  <img
                    src={makitaLxtProduct}
                    alt="Makita LXT Tools"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-900/90 via-teal-800/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  {/* Brand logo with holographic effect */}
                  <div className="absolute top-4 left-4 transform group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white font-black text-lg drop-shadow-2xl bg-teal-900/30 px-3 py-1 rounded-lg backdrop-blur-sm border border-teal-400/30">
                      MAKITA
                    </div>
                  </div>

                  {/* LXT Technology badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-white via-teal-50 to-white text-teal-600 px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border-2 border-teal-600/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-transparent rounded-2xl"></div>
                    <span className="relative z-10 animate-pulse">LXT 18V</span>
                  </div>

                  {/* Scanning line effect */}
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-70 animate-[scan_2s_ease-in-out_infinite_1s]"
                    style={{ top: "50%" }}
                  ></div>
                </div>

                <div className="relative p-6 z-10">
                  {/* Glowing top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 shadow-lg shadow-teal-500/50"></div>

                  {/* Title with glow effect */}
                  <h3 className="text-2xl font-black mb-4 relative text-teal-300 group-hover:text-teal-200 transition-colors duration-500">
                    <span className="relative z-10">SERIE LXT MAKITA</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-teal-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </h3>

                  <p className="text-teal-100/90 mb-6 leading-relaxed text-sm">
                    Herramientas inalámbricas de 18V con{" "}
                    <span className="text-teal-200 font-bold bg-teal-900/30 px-2 py-1 rounded">
                      tecnología LXT
                    </span>{" "}
                    de Makita
                  </p>

                  <Button
                    variant="outline"
                    className="relative w-full bg-gradient-to-r from-teal-500/10 to-teal-600/10 border-2 border-teal-400/50 text-teal-300 hover:bg-gradient-to-r hover:from-teal-500 hover:to-teal-600 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-wide">
                      COMPRA AHORA
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-teal-400/30 group-hover:border-teal-400/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-teal-400/30 group-hover:border-teal-400/70 transition-colors duration-500"></div>
              </div>
            </div>

            {/* Metabo HPT Card - Cinematic */}
            <div
              className="group cursor-pointer perspective-1000"
              style={{ animationDelay: "400ms" }}
            >
              <div className="relative h-full overflow-hidden bg-gradient-to-br from-green-900/20 via-black/80 to-green-800/20 border border-green-500/20 backdrop-blur-xl hover:border-green-400/60 transition-all duration-700 transform-gpu rounded-2xl hover:scale-105 hover:rotate-y-5 hover:shadow-[0_50px_100px_-20px_rgba(34,197,94,0.4)]">
                {/* Holographic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black/50 to-green-700/30"></div>

                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(45deg,#22c55e_25%,transparent_25%),linear-gradient(-45deg,#22c55e_25%,transparent_25%)] bg-[length:15px_15px] group-hover:animate-pulse"></div>

                {/* Product Image Background with holographic effects */}
                <div className="relative h-40 lg:h-48 overflow-hidden">
                  <img
                    src={metaboHptPd}
                    alt="Metabo HPT Tools"
                    className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-800/40 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                  {/* Brand badges with holographic effect */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-white via-green-50 to-white text-green-600 px-3 py-1 rounded-2xl text-xs font-black shadow-2xl border border-green-600/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent rounded-2xl"></div>
                    <span className="relative z-10 animate-pulse">METABO HPT</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-gradient-to-r from-white via-green-50 to-white text-green-600 px-3 py-1 rounded-2xl text-xs font-black shadow-2xl border border-green-600/50 backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent rounded-2xl"></div>
                    <span className="relative z-10 animate-pulse">ALEMÁN</span>
                  </div>

                  {/* Scanning line effect */}
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-70 animate-[scan_2s_ease-in-out_infinite_1.5s]"
                    style={{ top: "50%" }}
                  ></div>
                </div>

                <div className="relative p-6 z-10">
                  {/* Glowing top border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/50"></div>

                  {/* Title with glow effect */}
                  <h3 className="text-2xl font-black mb-4 relative text-green-300 group-hover:text-green-200 transition-colors duration-500">
                    <span className="relative z-10">POTENCIA ALEMANA</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </h3>

                  <p className="text-green-100/90 mb-6 leading-relaxed text-sm">
                    Herramientas Metabo HPT con{" "}
                    <span className="text-green-200 font-bold bg-green-900/30 px-2 py-1 rounded">
                      ingeniería alemana
                    </span>{" "}
                    y rendimiento superior
                  </p>

                  <Button
                    variant="outline"
                    className="relative w-full bg-gradient-to-r from-green-500/10 to-green-600/10 border-2 border-green-400/50 text-green-300 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 overflow-hidden group/btn"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-wide">
                      DESCUBRIR
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-green-400/30 group-hover:border-green-400/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-green-400/30 group-hover:border-green-400/70 transition-colors duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
