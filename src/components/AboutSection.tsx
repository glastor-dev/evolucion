import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import "../styles/about-cinema.css";
import {
  Calendar,
  ChevronRight,
  Globe,
  Lightbulb,
  Mail,
  Play,
  Quote,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";

// Interfaces para el diseño
interface StatItem {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  image?: string;
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  image: string;
  skills: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
  };
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
  rating: number;
}

// Datos mock
const stats: StatItem[] = [
  {
    id: "1",
    label: "Años de Experiencia",
    value: "10+",
    description: "Distribuyendo herramientas profesionales",
    icon: Calendar,
  },
  {
    id: "2",
    label: "Clientes Satisfechos",
    value: "5000+",
    description: "Profesionales confían en nosotros",
    icon: Users,
  },
  {
    id: "3",
    label: "Productos en Catálogo",
    value: "800+",
    description: "Herramientas y accesorios Makita",
    icon: Shield,
  },
  {
    id: "4",
    label: "Satisfacción del Cliente",
    value: "98%",
    description: "Calificación promedio de nuestros clientes",
    icon: Star,
  },
];

const timeline: TimelineItem[] = [
  {
    id: "1",
    year: "2014",
    title: "Fundación de Glastor",
    description:
      "Iniciamos como distribuidores especializados en herramientas profesionales Makita",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    image: "/src/assets/brands/makita-drill.jpg",
  },
  {
    id: "2",
    year: "2017",
    title: "Expansión Nacional",
    description:
      "Ampliamos nuestra cobertura a nivel nacional con centros de distribución estratégicos",
    icon: Globe,
    color: "from-green-500 to-emerald-500",
    image: "/src/assets/brands/makita-lxt-product.webp",
  },
  {
    id: "3",
    year: "2020",
    title: "Plataforma Digital",
    description: "Lanzamos nuestra plataforma de e-commerce para llegar a más profesionales",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
    image: "/src/assets/brands/hero-august-gwt11z.webp",
  },
  {
    id: "4",
    year: "2024",
    title: "Innovación Continua",
    description: "Integramos tecnologías avanzadas para mejorar la experiencia del cliente",
    icon: Lightbulb,
    color: "from-orange-500 to-red-500",
    image: "/src/assets/brands/makita-saw.jpg",
  },
];

const team: TeamMember[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    position: "Director General",
    description:
      "Líder visionario con más de 15 años de experiencia en el sector de herramientas profesionales",
    image: "/api/placeholder/300/300",
    skills: ["Liderazgo", "Estrategia", "Desarrollo de Negocio"],
    social: {
      linkedin: "#",
      email: "carlos@glastor.com",
    },
  },
  {
    id: "2",
    name: "Ana Patricia Ruiz",
    position: "Directora Comercial",
    description: "Experta en ventas B2B y desarrollo de canales de distribución especializados",
    image: "/api/placeholder/300/300",
    skills: ["Ventas", "Marketing", "Relaciones Comerciales"],
    social: {
      linkedin: "#",
      email: "ana@glastor.com",
    },
  },
  {
    id: "3",
    name: "Miguel Ángel Torres",
    position: "Jefe Técnico",
    description:
      "Ingeniero especializado en herramientas eléctricas y asesoramiento técnico profesional",
    image: "/api/placeholder/300/300",
    skills: ["Ingeniería", "Soporte Técnico", "Capacitación"],
    social: {
      linkedin: "#",
      email: "miguel@glastor.com",
    },
  },
];

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Isabella García",
    role: "Arquitecta",
    company: "Constructora Innovar",
    content:
      "Las herramientas Makita que distribuye Glastor han sido fundamentales para nuestros proyectos. La calidad y durabilidad son excepcionales.",
    image: "/api/placeholder/150/150",
    rating: 5,
  },
  {
    id: "2",
    name: "Roberto Silva",
    role: "Carpintero",
    company: "Silva Maderas",
    content:
      "Glastor no solo ofrece las mejores herramientas, sino también un servicio técnico incomparable. Son verdaderos profesionales.",
    image: "/api/placeholder/150/150",
    rating: 5,
  },
  {
    id: "3",
    name: "Ana Martínez",
    role: "Electricista",
    company: "Instalaciones Martínez",
    content:
      "La garantía y soporte de Glastor me dan la tranquilidad de trabajar con herramientas confiables todos los días.",
    image: "/api/placeholder/150/150",
    rating: 5,
  },
];

const AboutSection: React.FC = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isTimelineInView = useInView(timelineRef, { once: true, margin: "-100px" });
  const isTeamInView = useInView(teamRef, { once: true, margin: "-100px" });

  // Animación de contador para las estadísticas
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    if (isStatsInView) {
      stats.forEach((stat, index) => {
        const targetValue = parseInt(stat.value.replace(/\D/g, "")) || 0;
        let currentValue = 0;
        const increment = targetValue / 60; // 60 frames para 1 segundo

        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }

          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(currentValue);
            return newCounters;
          });
        }, 16); // ~60fps

        return () => clearInterval(timer);
      });
    }
  }, [isStatsInView]);

  // Formatear valores de contador
  const formatCounterValue = useMemo(
    () => (value: number, originalValue: string) => {
      if (originalValue.includes("%")) return `${value}%`;
      if (originalValue.includes("+")) return `${value}+`;
      return value.toString();
    },
    []
  );

  return (
    <section
      id="acerca-de"
      className="about-cinema relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
      {/* Fondo con partículas animadas */}
      <div className="particle-field">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/LOGO-1080-RGB.png" 
            alt="Glastor Logo Background"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 object-contain opacity-5 animate-pulse"
            style={{ animationDuration: '4s' }}
          />
          
          {/* Herramientas flotantes */}
          <div className="absolute inset-0 overflow-hidden">
            {[
              { src: "/src/assets/brands/makita-drill.jpg", top: "10%", left: "5%", size: "w-20 h-20", delay: "0s" },
              { src: "/src/assets/brands/makita-saw.jpg", top: "20%", right: "10%", size: "w-16 h-16", delay: "1s" },
              { src: "/src/assets/brands/makita-lxt-product.webp", bottom: "15%", left: "8%", size: "w-24 h-24", delay: "2s" },
              { src: "/src/assets/brands/hero-august-gwt11z.webp", bottom: "25%", right: "5%", size: "w-18 h-18", delay: "1.5s" }
            ].map((tool, index) => (
              <motion.img
                key={index}
                src={tool.src}
                alt={`Tool ${index + 1}`}
                className={`absolute ${tool.size} object-cover rounded-lg opacity-10 blur-sm`}
                style={{
                  top: tool.top,
                  bottom: tool.bottom,
                  left: tool.left,
                  right: tool.right,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: parseFloat(tool.delay),
                }}
              />
            ))}
          </div>
          
          {/* Gradient overlay para asegurar legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80" />
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Sparkles className="w-8 h-8 text-vue-primary" />
              <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-r from-white via-vue-primary to-white bg-clip-text text-transparent leading-tight">
                GLASTOR
              </h1>
              <Sparkles className="w-8 h-8 text-vue-primary" />
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-vue-primary to-transparent w-32" />
              <span className="text-vue-primary font-semibold tracking-wider uppercase">
                Herramientas • Profesionales • Calidad
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-vue-primary to-transparent w-32" />
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Más de una década distribuyendo herramientas profesionales Makita,
              <br className="hidden md:block" />
              <span className="text-vue-primary font-medium">
                comprometidos con la calidad, innovación y excelencia en el servicio.
              </span>
            </motion.p>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-vue-primary">2014</div>
                <div className="text-sm text-slate-400">Fundación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-vue-primary">10+</div>
                <div className="text-sm text-slate-400">Años</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-vue-primary">5000+</div>
                <div className="text-sm text-slate-400">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-vue-primary">800+</div>
                <div className="text-sm text-slate-400">Productos</div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-vue-secondary to-vue-primary text-black font-bold rounded-full hover:shadow-lg hover:shadow-vue-primary/25 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Ver catálogo
              </motion.button>
              <motion.a
                href="#estadisticas"
                className="px-8 py-4 border-2 border-slate-600 text-white font-bold rounded-full hover:border-vue-primary hover:text-vue-primary transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp className="w-5 h-5" />
                Conoce más
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronRight className="w-6 h-6 text-vue-primary rotate-90" />
        </motion.div>
      </motion.div>

      {/* Statistics Section */}
      <motion.div ref={statsRef} className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
              Nuestros Números
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Cifras que respaldan nuestro compromiso con la excelencia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 h-full group-hover:border-vue-primary/50 transition-all duration-500 relative overflow-hidden">
                  {/* Icono */}
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-vue-secondary/20 to-vue-primary/20 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-vue-primary" />
                  </div>

                  {/* Valor animado */}
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    {formatCounterValue(counters[index], stat.value)}
                  </div>

                  {/* Etiqueta */}
                  <h3 className="text-lg font-semibold text-vue-primary mb-2">{stat.label}</h3>

                  {/* Descripción */}
                  <p className="text-slate-400 text-sm mb-4">{stat.description}</p>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-vue-primary/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div ref={timelineRef} className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
              Nuestra Historia
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Un recorrido de crecimiento, innovación y compromiso constante
            </p>
          </motion.div>

          <div className="relative">
            {/* Línea central del timeline */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-vue-primary to-vue-secondary rounded-full" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <motion.div className="w-5/12 group cursor-pointer perspective-1000" whileHover={{ y: -20, scale: 1.05, rotateY: 5, boxShadow: "0 50px 100px -20px rgba(79, 192, 141, 0.4)" }}>
                    <Card className="relative h-full overflow-hidden bg-black/80 border border-vue-primary/20 backdrop-blur-xl hover:border-vue-primary/60 transition-all duration-700 transform-gpu">
                      {/* Fondo holográfico y patrón animado */}
                      <div className="absolute inset-0 bg-gradient-to-br from-vue-dark/10 via-vue-secondary/10 to-vue-primary/10"></div>
                      <motion.div
                        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--vue-primary))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--vue-primary))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                      ></motion.div>
                      <div className="absolute inset-0 bg-gradient-to-br from-vue-primary/20 to-vue-secondary/20 opacity-0 group-hover:opacity-30 transition-all duration-700 blur-xl"></div>
                      <div className="aspect-video relative bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        {item.image ? (
                          <>
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                          </>
                        ) : (
                          <>
                            <item.icon className="w-16 h-16 text-slate-500 group-hover:text-vue-primary transition-colors duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                          </>
                        )}

                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-vue-secondary to-vue-primary text-black font-bold z-10">
                          {item.year}
                        </Badge>

                        {/* Icono superpuesto en la esquina inferior derecha */}
                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
                          <item.icon className="w-5 h-5 text-vue-primary" />
                        </div>
                      </div>

                      <CardContent className="p-6 relative z-10">
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-vue-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-slate-300 mb-4 leading-relaxed">{item.description}</p>
                      </CardContent>
                      {/* Línea de escaneo */}
                      <motion.div
                        animate={{ y: ["-100%", "100%", "-100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vue-primary to-transparent opacity-30 group-hover:opacity-70"
                      ></motion.div>
                      {/* Acentos en esquinas */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                    </Card>
                  </motion.div>

                  <div className="w-2/12 flex justify-center">
                    <motion.div
                      className="w-6 h-6 bg-gradient-to-r from-vue-secondary to-vue-primary rounded-full border-4 border-black shadow-lg"
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(79, 192, 141, 0.5)",
                          "0 0 20px rgba(79, 192, 141, 0.8)",
                          "0 0 10px rgba(79, 192, 141, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gallery Section - Productos Históricos */}
      <motion.div className="relative py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
              Nuestros Productos a través del Tiempo
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Herramientas profesionales que han acompañado a miles de trabajadores en sus proyectos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                image: "/src/assets/brands/makita-drill.jpg",
                title: "Taladros Profesionales",
                description: "Potencia y precisión en cada proyecto",
                category: "Perforación"
              },
              {
                image: "/src/assets/brands/makita-saw.jpg",
                title: "Sierras Especializadas",
                description: "Cortes perfectos para trabajos exigentes",
                category: "Corte"
              },
              {
                image: "/src/assets/brands/makita-lxt-product.webp",
                title: "Serie LXT",
                description: "Tecnología inalámbrica avanzada",
                category: "Inalámbrico"
              },
              {
                image: "/src/assets/LOGO-1080-RGB.png",
                title: "Soporte Técnico",
                description: "Asesoría especializada y garantía",
                category: "Servicio"
              },
              {
                image: "/src/assets/brands/hero-august-gwt11z.webp",
                title: "Herramientas de Jardín",
                description: "Para espacios verdes profesionales",
                category: "Jardín"
              },
              {
                image: "/src/assets/DATAWEB.jpg",
                title: "Catálogo Digital",
                description: "Toda nuestra gama al alcance de un clic",
                category: "Digital"
              }
            ].map((product, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer perspective-1000"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -20, scale: 1.05, rotateY: 5, boxShadow: "0 50px 100px -20px rgba(79, 192, 141, 0.4)" }}
              >
                <Card className="relative h-full overflow-hidden bg-black/80 border border-vue-primary/20 backdrop-blur-xl hover:border-vue-primary/60 transition-all duration-700 transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-vue-dark/10 via-vue-secondary/10 to-vue-primary/10"></div>
                  <motion.div
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--vue-primary))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--vue-primary))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                  ></motion.div>
                  <div className="absolute inset-0 bg-gradient-to-br from-vue-primary/20 to-vue-secondary/20 opacity-0 group-hover:opacity-30 transition-all duration-700 blur-xl"></div>
                  <div className="aspect-square relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                    
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-vue-secondary/90 to-vue-primary/90 text-white font-bold backdrop-blur-sm">
                      {product.category}
                    </Badge>

                    {/* Overlay con efecto hover */}
                    <div className="absolute inset-0 bg-vue-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-vue-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">{product.description}</p>
                  </CardContent>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-vue-primary/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                  {/* Línea de escaneo y acentos */}
                  <motion.div
                    animate={{ y: ["-100%", "100%", "-100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vue-primary to-transparent opacity-30 group-hover:opacity-70"
                  ></motion.div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Estadísticas adicionales */}
          <motion.div 
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { number: "800+", label: "Modelos", subtitle: "En catálogo" },
              { number: "10+", label: "Categorías", subtitle: "De herramientas" },
              { number: "24/7", label: "Soporte", subtitle: "Técnico disponible" },
              { number: "98%", label: "Satisfacción", subtitle: "Del cliente" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-vue-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-white font-semibold mb-1">{stat.label}</div>
                <div className="text-slate-400 text-sm">{stat.subtitle}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div ref={teamRef} className="relative py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Profesionales apasionados que hacen la diferencia cada día
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                className="relative group cursor-pointer perspective-1000"
                initial={{ opacity: 0, y: 50 }}
                animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -20, scale: 1.05, rotateY: 5, boxShadow: "0 50px 100px -20px rgba(79, 192, 141, 0.4)" }}
              >
                <Card className="relative h-full overflow-hidden bg-black/80 border border-vue-primary/20 backdrop-blur-xl hover:border-vue-primary/60 transition-all duration-700 transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-vue-dark/10 via-vue-secondary/10 to-vue-primary/10"></div>
                  <motion.div
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--vue-primary))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--vue-primary))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                  ></motion.div>
                  <div className="absolute inset-0 bg-gradient-to-br from-vue-primary/20 to-vue-secondary/20 opacity-0 group-hover:opacity-30 transition-all duration-700 blur-xl"></div>
                  <div className="aspect-square relative">
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                      <Users className="w-20 h-20 text-slate-500 group-hover:text-vue-primary transition-colors duration-300" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-vue-primary transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-vue-primary font-semibold mb-4">{member.position}</p>
                    <p className="text-slate-300 mb-6 leading-relaxed">{member.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.skills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          className="bg-slate-800/50 text-slate-300 hover:bg-vue-primary/20 hover:text-vue-primary transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="text-slate-400 hover:text-vue-primary transition-colors"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-vue-primary/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                  <motion.div
                    animate={{ y: ["-100%", "100%", "-100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vue-primary to-transparent opacity-30 group-hover:opacity-70"
                  ></motion.div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Testimonios */}
      <motion.div className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black relative">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-vue-primary to-white bg-clip-text text-transparent">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              La satisfacción de nuestros clientes es nuestro mayor logro
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="relative group cursor-pointer perspective-1000"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -20, scale: 1.05, rotateY: 5, boxShadow: "0 50px 100px -20px rgba(79, 192, 141, 0.4)" }}
              >
                <Card className="relative h-full overflow-hidden bg-black/70 border border-vue-primary/20 backdrop-blur-xl hover:border-vue-primary/60 transition-all duration-700 transform-gpu">
                  <div className="absolute inset-0 bg-gradient-to-br from-vue-dark/10 via-vue-secondary/10 to-vue-primary/10"></div>
                  <motion.div
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--vue-primary))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--vue-primary))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                  ></motion.div>
                  <div className="absolute inset-0 bg-gradient-to-br from-vue-primary/20 to-vue-secondary/20 opacity-0 group-hover:opacity-30 transition-all duration-700 blur-xl"></div>
                  <CardContent className="p-8">
                    <Quote className="w-8 h-8 text-vue-primary mb-4" />

                    <p className="text-slate-300 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-slate-400">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>

                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-vue-primary/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>
                  <motion.div
                    animate={{ y: ["-100%", "100%", "-100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.5 }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vue-primary to-transparent opacity-30 group-hover:opacity-70"
                  ></motion.div>
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Final */}
      <motion.div className="py-20 px-4 bg-black relative">
        <div className="container mx-auto text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#4FC08D] via-white to-[#42B883] bg-clip-text text-transparent">
              ¿Listo para Equiparte?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Únete a miles de profesionales que confían en nuestras herramientas Makita.
              <br />
              Tu próximo proyecto comienza con las mejores herramientas.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => setIsVideoPlaying(true)}
                className="px-10 py-4 bg-gradient-to-r from-[#42B883] to-[#4FC08D] text-black font-bold rounded-full hover:shadow-xl hover:shadow-[#4FC08D]/25 transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-5 h-5" />
                Ver Catálogo
              </motion.button>

              <motion.a
                href="mailto:glastor.info@gmail.com"
                className="px-10 py-4 border-2 border-slate-600 text-white font-bold rounded-full hover:border-[#4FC08D] hover:text-[#4FC08D] transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                Contáctanos
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal de video */}
      <AnimatePresence>
        {isVideoPlaying && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoPlaying(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl aspect-video bg-slate-900 rounded-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-20 h-20 text-[#4FC08D] mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold text-white mb-2">Catálogo Digital</h3>
                  <p className="text-slate-300">Próximamente disponible</p>
                </div>
              </div>

              <button
                onClick={() => setIsVideoPlaying(false)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AboutSection;
