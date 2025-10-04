import { useState, useEffect, useRef } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Clock, ArrowUp, Heart } from 'lucide-react';
import { LogoIcon } from "./Icons";
import Logo from "./Logo";
import datawebImg from "../assets/DATAWEB.jpg";
import gplv3Img from "../assets/gplv3-127x51.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  
  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <>
      <footer 
        ref={footerRef}
        id="footer" 
        role="contentinfo"
        aria-label="Pie de página"
        className="relative bg-gradient-to-b from-background via-muted/20 to-muted/40 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>

        <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
          <div className={`pt-8 sm:pt-12 lg:pt-16 pb-6 sm:pb-8 border-b border-border/40 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8">
              {/* Logo y descripción */}
              <div className="col-span-1 sm:col-span-2 xl:col-span-2 space-y-4 sm:space-y-6 group" style={{animationDelay: '100ms'}}>
                <a
                  rel="noreferrer noopener"
                  href="/"
                  className="font-bold text-xl sm:text-2xl flex items-center group-hover:scale-105 transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                >
                  <Logo 
                    title="Glastor - Desarrollo Full Stack y Distribución Ecommerce" 
                    className="h-[clamp(48px,9vw,84px)] w-auto object-contain transition-none"
                  />
                </a>
                <p className="text-muted-foreground text-sm sm:text-base mt-3 sm:mt-4 max-w-md leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                  Soluciones innovadoras para transformar tu negocio digital. Comprometidos con la 
                  <span className="text-primary font-semibold"> excelencia y la calidad</span> en cada proyecto.
                </p>
                
                {/* Social Media Icons */}
                <div className="flex space-x-3 sm:space-x-4 pt-3 sm:pt-4">
                  {[
                    { Icon: Facebook, href: "#", color: "hover:text-blue-500", label: "Facebook" },
                    { Icon: Twitter, href: "#", color: "hover:text-sky-400", label: "Twitter" },
                    { Icon: Instagram, href: "#", color: "hover:text-pink-500", label: "Instagram" },
                    { Icon: Linkedin, href: "#", color: "hover:text-blue-600", label: "LinkedIn" }
                  ].map(({ Icon, href, color, label }, index) => (
                    <a
                      key={index}
                      href={href}
                      aria-label={label}
                      className={`p-1.5 sm:p-2 rounded-full bg-muted/50 text-muted-foreground ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-background`}
                      style={{animationDelay: `${200 + index * 100}ms`}}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Enlaces rápidos - Productos */}
              <div className={`flex flex-col gap-2 sm:gap-3 transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{animationDelay: '200ms'}}>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-foreground group-hover:text-primary transition-colors">
                  Productos
                </h3>
                {[
                  "Automatización",
                  "Herramientas Eléctricas", 
                  "Ferretería Industrial"
                ].map((item, index) => (
                  <a
                    key={index}
                    rel="noreferrer noopener"
                    href="#"
                    className="text-muted-foreground text-sm sm:text-base hover:text-primary transition-all duration-300 hover:translate-x-1 sm:hover:translate-x-2 hover:font-medium relative group"
                  >
                    <span className="relative z-10">{item}</span>
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
                  </a>
                ))}
              </div>

              {/* Enlaces rápidos - Plataformas */}
              <div className={`flex flex-col gap-2 sm:gap-3 transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{animationDelay: '300ms'}}>
                <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Plataformas</h3>
                {["Web", "Mobile", "Servidores"].map((item, index) => (
                  <a
                    key={index}
                    rel="noreferrer noopener"
                    href="#"
                    className="text-muted-foreground text-sm sm:text-base hover:text-primary transition-all duration-300 hover:translate-x-1 sm:hover:translate-x-2 hover:font-medium relative group"
                  >
                    <span className="relative z-10">{item}</span>
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
                  </a>
                ))}
              </div>

              {/* Enlaces rápidos - Empresa */}
              <div className={`flex flex-col gap-2 sm:gap-3 transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{animationDelay: '400ms'}}>
                <h3 className="font-bold font-heading text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Empresa</h3>
                {["Servicios", "Precios", "Nosotros", "Contacto"].map((item, index) => (
                  <a
                    key={index}
                    rel="noreferrer noopener"
                    href="#"
                    className="text-muted-foreground text-sm sm:text-base font-body hover:text-primary transition-all duration-300 hover:translate-x-1 sm:hover:translate-x-2 hover:font-medium relative group"
                  >
                    <span className="relative z-10">{item}</span>
                    <div className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></div>
                  </a>
                ))}
              </div>

              {/* Información de contacto */}
              <div className={`flex flex-col gap-3 sm:gap-4 transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{animationDelay: '500ms'}}>
                <h3 className="font-bold font-heading text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Contacto</h3>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group cursor-pointer">
                    <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="font-body text-xs sm:text-sm break-all">glastor.info@gmail.com</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group cursor-pointer">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="font-body text-xs sm:text-sm">+5491132578591</span>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group cursor-pointer">
                    <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="font-body text-xs sm:text-sm leading-relaxed">Calle 123 #45-67<br />Bogotá, Colombia</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 text-muted-foreground hover:text-primary transition-colors duration-300 group">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                    <span className="font-body text-xs sm:text-sm">Lun - Vie: 8:00 - 18:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección inferior */}
          <div className={`py-4 sm:py-6 lg:py-8 transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 sm:gap-8 items-start">
              {/* Información Fiscal */}
              <div className="col-span-1">
                <div className="text-xs sm:text-sm text-muted-foreground space-y-0.5 sm:space-y-1">
                  <p className="font-semibold text-foreground text-sm sm:text-base">Información Fiscal</p>
                  <p>NIT: 900.123.456-7</p>
                  <p>Régimen Común</p>
                  <p className="hidden sm:block">Actividad Económica: 4759</p>
                </div>
              </div>

              {/* Medios de pago preferidos alineado con columna de Productos */}
              <div className="col-span-1 lg:col-start-3 xl:col-start-3">
                <div className="flex flex-col items-start gap-3">
                  <span id="payment-methods-label" className="font-semibold text-foreground text-sm sm:text-base">Medios de pago preferidos</span>
                  <div className="mt-1 flex items-center gap-2 sm:gap-3 flex-wrap" aria-label="Medios de pago" aria-labelledby="payment-methods-label">
                    <img
                      src="https://www.acmetools.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw6be1024d/site/footer/mastercard.svg"
                      alt="Mastercard"
                      title="Mastercard"
                      loading="lazy" decoding="async"
                      className="h-6 sm:h-7 lg:h-8 object-contain"
                    />
                    <img
                      src="https://www.acmetools.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dwbc02239f/site/footer/visa.svg"
                      alt="Visa"
                      title="Visa"
                      loading="lazy" decoding="async"
                      className="h-6 sm:h-7 lg:h-8 object-contain"
                    />
                    <img
                      src="https://www.acmetools.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw2b0c3d49/site/footer/paypal.svg"
                      alt="PayPal"
                      title="PayPal"
                      loading="lazy" decoding="async"
                      className="h-6 sm:h-7 lg:h-8 object-contain"
                    />
                    <img
                      src="https://www.acmetools.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dw260fa4c7/site/footer/amex.svg"
                      alt="American Express"
                      title="American Express"
                      loading="lazy" decoding="async"
                      className="h-6 sm:h-7 lg:h-8 object-contain"
                    />
                    <img
                      src="https://www.acmetools.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dwabae01df/site/footer/discover.svg"
                      alt="Discover"
                      title="Discover"
                      loading="lazy" decoding="async"
                      className="h-6 sm:h-7 lg:h-8 object-contain"
                    />
                    <img
                      src="https://www.acmetools.com/on/demandware.static/-/Library-Sites-RefArchSharedLibrary/default/dwc7526232/site/footer/apple-pay.svg"
                      alt="Apple Pay"
                      title="Apple Pay"
                      loading="lazy" decoding="async"
                      className="h-6 sm:h-7 lg:h-8 object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className={`border-t border-border/40 py-4 sm:py-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  © {currentYear} GLASTOR. Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs text-muted-foreground">Hecho con</span>
                  <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-red-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">en Colombia</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <img 
                  src={datawebImg} 
                  alt="DATAWEB" 
                  loading="lazy" decoding="async"
                  className="h-7 sm:h-8 lg:h-9 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
                <img 
                  src="https://www.usemotion.com/cdn-cgi/image/onerror=redirect,width=350,height=350,format=webp/_astro/gdpr-badge.BL8csaHf.png" 
                  alt="GDPR Compliant" 
                  loading="lazy" decoding="async"
                  className="h-7 sm:h-8 lg:h-9 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
                <img 
                  src={gplv3Img} 
                  alt="GPL v3 License" 
                  loading="lazy" decoding="async"
                  className="h-6 sm:h-7 lg:h-8 object-contain hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              </div>
            </div>
          </div>

              {/* Enlaces Legales y RGPD */}
              <div className={`border-t border-border/40 py-3 sm:py-4 transition-all duration-1000 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                      Declaración de privacidad
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                      Todas las políticas y directrices
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                      Accesibilidad digital
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                      Preferencias para cookies
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300 hover:underline">
                      RGPG
                    </a>
                  </div>
                </div>
              </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 p-2 sm:p-2.5 lg:p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 animate-bounce"
        >
          <ArrowUp className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5" />
        </button>
      )}
    </>
  );
};
