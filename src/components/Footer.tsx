import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  Award,
  Clock,
  Cpu,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShoppingCart,
  Sparkles,
  Twitter,
  Users,
  Zap,
  Youtube,
  LifeBuoy,
} from "lucide-react";

import logoImage from "../assets/LOGO-1080-RGB.png";
import datawebImg from "../assets/DATAWEB.jpg";
import gplv3Img from "../assets/gplv3-127x51.png";
import "./footer-cinema.css";

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer
        ref={footerRef}
        id="footer"
        className="relative bg-black text-white overflow-hidden footer-cinema"
      >
        {/* Fondo cinematográfico con partículas */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-900/50 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vue-primary/10 via-transparent to-transparent" />

          {/* Partículas animadas */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-vue-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Grid tecnológico */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(79, 192, 141, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(79, 192, 141, 0.1) 1px, transparent 1px)`,
                backgroundSize: "50px 50px",
              }}
            />
          </div>
        </div>

        <div className="container mx-auto relative z-10 px-6">
          {/* Sección principal */}
          <motion.div
            className="pt-20 pb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              {/* Logo y descripción */}
              <motion.div
                className="lg:col-span-2 space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <motion.a
                  href="/"
                  className="inline-block group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={logoImage}
                    alt="Glastor - Desarrollo Full Stack y Distribución Ecommerce"
                    className="h-16 w-auto object-contain filter brightness-110 group-hover:brightness-125 transition-all duration-300"
                  />
                </motion.a>

                <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                  Transformamos ideas en realidades digitales con
                  <span className="text-vue-primary font-semibold"> tecnología de vanguardia</span> y
                  <span className="text-vue-secondary font-semibold"> excelencia técnica</span>.
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-vue-primary" />
                    <span className="text-sm text-slate-400">10+ años de experiencia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-vue-secondary" />
                    <span className="text-sm text-slate-400">500+ proyectos</span>
                  </div>
                </div>

                {/* Redes sociales cinematográficas */}
                <div className="flex space-x-4 pt-6">
                  {[
                    { Icon: Facebook, href: "#", name: "Facebook", color: "hover:text-blue-400" },
                    { Icon: Twitter, href: "#", name: "Twitter", color: "hover:text-sky-400" },
                    { Icon: Instagram, href: "#", name: "Instagram", color: "hover:text-pink-400" },
                    { Icon: Linkedin, href: "#", name: "LinkedIn", color: "hover:text-blue-500" },
                    { Icon: Youtube, href: "#", name: "YouTube", color: "hover:text-red-500" },
                  ].map(({ Icon, href, name, color }, index) => (
                    <motion.a
                      key={name}
                      href={href}
                      aria-label={name}
                      title={name}
                      className={`p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-400 ${color} transition-all duration-300 hover:border-vue-primary/50 hover:bg-slate-800/50 backdrop-blur-sm group`}
                      whileHover={{ y: -5, scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Servicios */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-vue-primary" />
                  <h3 className="text-xl font-bold text-white">Servicios</h3>
                </div>

                {[
                  { label: "Desarrollo Web", icon: Globe, href: "#desarrollo" },
                  { label: "Inteligencia Artificial", icon: Cpu, href: "#ai" },
                  { label: "E-commerce", icon: ShoppingCart, href: "#ecommerce" },
                  { label: "Cloud & DevOps", icon: Shield, href: "#cloud" },
                ].map(({ label, icon: ItemIcon, href }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 text-slate-300 hover:text-vue-primary transition-all duration-300 group"
                    whileHover={{ x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <ItemIcon className="w-4 h-4 group-hover:text-vue-secondary transition-colors" />
                    <span className="relative">
                      {label}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vue-secondary to-vue-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </motion.a>
                ))}
              </motion.div>

              {/* Productos */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-vue-secondary" />
                  <h3 className="text-xl font-bold text-white">Productos</h3>
                </div>

                {[
                  { label: "Automatización", href: "#automatizacion" },
                  { label: "Herramientas Eléctricas", href: "#herramientas" },
                  { label: "Ferretería Industrial", href: "#ferreteria" },
                  { label: "Plataformas Web", href: "#plataformas" },
                ].map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="block text-slate-300 hover:text-vue-primary transition-all duration-300 group"
                    whileHover={{ x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <span className="relative">
                      {item.label}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vue-secondary to-vue-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </motion.a>
                ))}
              </motion.div>

              {/* Atención al cliente */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <LifeBuoy className="w-6 h-6 text-vue-primary" />
                  <h3 className="text-xl font-bold text-white">Clientes</h3>
                </div>

                {[
                  { label: "Centro de ayuda", href: "/ayuda/login" },
                  { label: "Contacto", href: "mailto:glastor.info@gmail.com" },
                  { label: "Garantías", href: "/politicas/garantias" },
                  { label: "Envíos", href: "/politicas/envios" },
                ].map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="block text-slate-300 hover:text-vue-primary transition-all duration-300 group"
                    whileHover={{ x: 10 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  >
                    <span className="relative">
                      {item.label}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vue-secondary to-vue-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Información de contacto cinematográfica */}
          <motion.div
            className="border-t border-slate-700/50 py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Contacto */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-vue-primary" />
                  <h4 className="text-lg font-semibold text-white">Contacto</h4>
                </div>

                <motion.div
                  className="flex items-center gap-3 text-slate-300 hover:text-vue-primary transition-colors duration-300 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">glastor.info@gmail.com</span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3 text-slate-300 hover:text-vue-primary transition-colors duration-300 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">+5491132578591</span>
                </motion.div>

                <motion.div
                  className="flex items-start gap-3 text-slate-300 hover:text-vue-primary transition-colors duration-300 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="h-4 w-4 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm leading-relaxed">
                    Calle 123 #45-67
                    <br />
                    Bogotá, Colombia
                  </span>
                </motion.div>

                <motion.div
                  className="flex items-center gap-3 text-slate-300 hover:text-vue-primary transition-colors duration-300 group"
                  whileHover={{ x: 5 }}
                >
                  <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Lun - Vie: 8:00 - 18:00</span>
                </motion.div>
              </div>

              {/* Información fiscal */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-vue-secondary" />
                  <h4 className="text-lg font-semibold text-white">Info Fiscal</h4>
                </div>

                <div className="text-slate-300 space-y-2 text-sm">
                  <p>
                    <span className="text-vue-primary font-medium">NIT:</span> 900.123.456-7
                  </p>
                  <p>
                    <span className="text-vue-primary font-medium">Régimen:</span> Común
                  </p>
                  <p>
                    <span className="text-vue-primary font-medium">Actividad:</span> 4759
                  </p>
                  <p>
                    <span className="text-vue-primary font-medium">Ubicación:</span> Girona, España
                  </p>
                </div>
              </div>

              {/* Enlaces legales */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-vue-primary" />
                  <h4 className="text-lg font-semibold text-white">Legal</h4>
                </div>

                {[
                  { label: "Política de Privacidad", href: "#privacidad" },
                  { label: "Términos y Condiciones", href: "./terminos.html" },
                  { label: "Política de Cookies", href: "#cookies" },
                  { label: "Política de Garantías", href: "/politicas/garantias" },
                  { label: "Política de Envíos", href: "/politicas/envios" },
                ].map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="block text-slate-300 hover:text-vue-primary transition-all duration-300 group text-sm"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <span className="relative">
                      {item.label}
                      <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vue-secondary to-vue-primary group-hover:w-full transition-all duration-300" />
                    </span>
                  </motion.a>
                ))}
              </div>

              {/* Certificaciones */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-vue-secondary" />
                  <h4 className="text-lg font-semibold text-white">Certificaciones</h4>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.img
                    src={datawebImg}
                    alt="DATAWEB"
                    className="h-10 w-auto object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                  />
                  <motion.img
                    src="https://www.usemotion.com/cdn-cgi/image/onerror=redirect,width=350,height=350,format=webp/_astro/gdpr-badge.BL8csaHf.png"
                    alt="GDPR Compliant"
                    className="h-10 w-auto object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                  />
                  <motion.img
                    src={gplv3Img}
                    alt="GPL v3 License"
                    className="h-10 w-auto object-contain filter brightness-90 hover:brightness-110 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copyright cinematográfico */}
          <motion.div
            className="border-t border-slate-700/50 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                <p className="text-slate-400 text-sm">
                  © {currentYear} <span className="text-vue-primary font-semibold">GLASTOR</span>.
                  Todos los derechos reservados.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Hecho con</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                  </motion.div>
                  <span className="text-slate-400 text-sm">en Colombia y España</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Powered by</span>
                <span className="text-vue-primary font-semibold text-sm">React</span>
                <span className="text-slate-400">•</span>
                <span className="text-vue-secondary font-semibold text-sm">TypeScript</span>
                <span className="text-slate-400">•</span>
                <span className="text-vue-primary font-semibold text-sm">Tailwind</span>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Botón scroll to top cinematográfico */}
      {showScrollTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-vue-secondary to-vue-primary text-black rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-50 group"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-vue-secondary to-vue-primary opacity-0 group-hover:opacity-20 animate-ping" />
        </motion.button>
      )}
    </>
  );
};
