import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, PanInfo } from "framer-motion";
import { Brain, Code, Play, Shield, ShoppingCart, Target, Layers, Rocket, Award, Pause, PlayCircle, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tooltip } from "./ui/Tooltip";

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  bgGradient: string;
  iconGradient: string;
  badgeGradient: string;
  badge: string;
}

const ServicesSection: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>("development");
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number }>
  >([]);
  // Control de experiencia del proceso
  const [experienceStarted, setExperienceStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const processRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [speed, setSpeed] = useState<number>(() => {
    const saved = sessionStorage.getItem("process-speed");
    return saved ? Number(saved) || 1 : 1;
  });

  // Función unificada para cambiar pasos
  const changeStep = (newStep: number) => {
    if (newStep >= 0 && newStep < steps.length) {
      setActiveStep(newStep);
      updateURLStep(newStep);
    }
  };

  // Manejo de gestos táctiles para móviles
  const handlePan = (event: any, info: PanInfo) => {
    const threshold = 50; // Umbral mínimo para activar el swipe
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && activeStep > 0) {
        // Swipe derecha - paso anterior
        changeStep(activeStep - 1);
      } else if (info.offset.x < 0 && activeStep < steps.length - 1) {
        // Swipe izquierda - paso siguiente
        changeStep(activeStep + 1);
      }
    }
  };
  


  const steps = [
    {
      id: "descubrimiento",
      title: "Descubrimiento",
      description: "Analizamos objetivos, contexto y éxito deseado para definir el alcance real.",
      icon: Target,
      duration: "1-2 semanas",
      details: {
        activities: ["Análisis de requerimientos", "Definición de objetivos", "Estudio de viabilidad", "Planificación inicial"],
        deliverables: ["Documento de requerimientos", "Propuesta técnica", "Cronograma del proyecto"],
        team: ["Product Manager", "Arquitecto de Software", "UX Designer"]
      }
    },
    {
      id: "diseno",
      title: "Diseño & Arquitectura",
      description: "Creamos prototipos y una arquitectura sólida, escalable y segura.",
      icon: Layers,
      duration: "2-3 semanas",
      details: {
        activities: ["Diseño de UI/UX", "Arquitectura del sistema", "Prototipado", "Revisión técnica"],
        deliverables: ["Mockups y prototipos", "Diagrama de arquitectura", "Especificaciones técnicas"],
        team: ["UX/UI Designer", "Arquitecto de Software", "Tech Lead"]
      }
    },
    {
      id: "desarrollo",
      title: "Desarrollo",
      description: "Implementación ágil, revisiones continuas y CI/CD para iterar con calidad.",
      icon: Code,
      duration: "4-12 semanas",
      details: {
        activities: ["Desarrollo frontend", "Desarrollo backend", "Integración de APIs", "Code reviews"],
        deliverables: ["Código fuente", "Documentación técnica", "Tests automatizados"],
        team: ["Frontend Developers", "Backend Developers", "DevOps Engineer"]
      }
    },
    {
      id: "qa",
      title: "QA & Seguridad",
      description: "Pruebas funcionales, de rendimiento y seguridad para garantizar confianza.",
      icon: Shield,
      duration: "1-2 semanas",
      details: {
        activities: ["Testing funcional", "Testing de rendimiento", "Auditoría de seguridad", "Testing de usabilidad"],
        deliverables: ["Reporte de testing", "Plan de correcciones", "Certificación de seguridad"],
        team: ["QA Engineer", "Security Specialist", "Performance Tester"]
      }
    },
    {
      id: "despliegue",
      title: "Despliegue",
      description: "Release estable con observabilidad, métricas y plan de rollback.",
      icon: Rocket,
      duration: "1 semana",
      details: {
        activities: ["Configuración de producción", "Despliegue gradual", "Monitoreo en vivo", "Plan de rollback"],
        deliverables: ["Aplicación en producción", "Dashboard de monitoreo", "Documentación de operaciones"],
        team: ["DevOps Engineer", "SRE", "Tech Lead"]
      }
    },
    {
      id: "evolucion",
      title: "Evolución Continua",
      description: "Monitoreo, mejoras y roadmap vivo en colaboración con el negocio.",
      icon: Award,
      duration: "Ongoing",
      details: {
        activities: ["Monitoreo continuo", "Análisis de métricas", "Mejoras iterativas", "Planificación de roadmap"],
        deliverables: ["Reportes de performance", "Roadmap actualizado", "Nuevas funcionalidades"],
        team: ["Product Manager", "Data Analyst", "Development Team"]
      }
    },
  ] as const;

  // Auto-avance de pasos cuando está en reproducción
  useEffect(() => {
    if (!experienceStarted || !isPlaying) return;
    const interval = 2600 / Math.max(0.5, speed);
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          // Parar en el último paso
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [experienceStarted, isPlaying, steps.length, speed]);

  // Actualizar query param cuando cambia el paso
  useEffect(() => {
    if (!experienceStarted) return;
    // Evitar actualizar si la sincronización está deshabilitada (navegación a otra ruta)
    try {
      if (sessionStorage.getItem("disable-process-url-sync") === "1") return;
    } catch {}
    // Sólo actualizar la URL cuando estamos en Home (hashPath raíz)
    const hashPath = (window.location.hash || "#/").split("?")[0];
    const isHome = hashPath === "#/" || hashPath === "#" || hashPath === "";
    if (isHome) updateURLStep(activeStep);
  }, [activeStep, experienceStarted]);

  // Persistencia en sessionStorage
  useEffect(() => {
    if (!experienceStarted) return;
    const payload = {
      started: experienceStarted,
      playing: isPlaying,
      step: activeStep,
      speed,
    };
    sessionStorage.setItem("process-experience", JSON.stringify(payload));
  }, [experienceStarted, isPlaying, activeStep, speed]);

  // Cargar estado desde URL (?step=) en el hash (HashRouter) o sessionStorage
  useEffect(() => {
    // Preferir leer el parámetro desde el hash (HashRouter): http://host/#/ruta?step=6
    const { hash } = window.location;
    let stepFromSearch: number | null = null;
    if (hash.includes("?")) {
      const hashQuery = hash.split("?")[1] || "";
      const params = new URLSearchParams(hashQuery);
      const v = Number(params.get("step"));
      stepFromSearch = Number.isNaN(v) ? null : v;
    }
    // Backward-compat: si vino en la query global antes del hash (?step=6#/ruta), leerlo y normalizarlo al hash.
    if (stepFromSearch == null) {
      const url = new URL(window.location.href);
      const v = Number(url.searchParams.get("step"));
      stepFromSearch = Number.isNaN(v) ? null : v;
      if (stepFromSearch != null) {
        // Migrar a hash inmediatamente para no dejar ?step= antes del hash
        const idx = Math.min(steps.length - 1, Math.max(0, stepFromSearch - 1));
        replaceHashStep(idx, true);
      }
    }
    const fromStorage = sessionStorage.getItem("process-experience");
    if (stepFromSearch != null && stepFromSearch > 0) {
      const idx = Math.min(steps.length - 1, Math.max(0, stepFromSearch - 1));
      setExperienceStarted(true);
      setActiveStep(idx);
      setIsPlaying(false);
      return;
    }
    if (fromStorage) {
      try {
        const saved = JSON.parse(fromStorage);
        if (saved?.started) {
          setExperienceStarted(true);
          setActiveStep(Math.min(steps.length - 1, Number(saved.step) || 0));
          setIsPlaying(Boolean(saved.playing));
          if (saved.speed) setSpeed(Number(saved.speed));
        }
      } catch {}
    }
  }, []);

  // Guardar velocidad preferida
  useEffect(() => {
    sessionStorage.setItem("process-speed", String(speed));
  }, [speed]);

  // Reemplazar el parámetro step dentro del hash para funcionar con HashRouter: #/ruta?step=6
  const replaceHashStep = (idx: number, force: boolean = false) => {
    const { origin, pathname, hash } = window.location;
    const [hashPath, hashQuery = ""] = (hash && hash.length ? hash : "#/" ).split("?");
    // Evitar sobrescribir la ruta (por ejemplo, /tienda) si no estamos en Home, salvo migraciones forzadas
    const isHome = hashPath === "#/" || hashPath === "#" || hashPath === "";
    if (!force && !isHome) return;
    const params = new URLSearchParams(hashQuery);
    params.set("step", String(idx + 1));
    const newHash = `${hashPath}?${params.toString()}`;
    window.history.replaceState(null, "", `${origin}${pathname}${newHash}`);
  };

  const updateURLStep = (idx: number) => {
    replaceHashStep(idx);
  };

  const handleStartExperience = () => {
    console.log("🚀 Botón INICIAR EXPERIENCIA clickeado");
    setExperienceStarted(true);
    setIsPlaying(true);
    setActiveStep(0);
    console.log("✅ Estados actualizados: experienceStarted=true, isPlaying=true, activeStep=0");
    
    // Scroll suave a la sección del proceso
    setTimeout(() => {
      const el = processRef.current || document.getElementById("proceso-trabajo");
      console.log("🎯 Elemento encontrado para scroll:", el);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        console.log("📜 Scroll ejecutado hacia proceso-trabajo");
      } else {
        console.warn("⚠️ No se encontró el elemento proceso-trabajo");
      }
    }, 50);
    updateURLStep(0);
    console.log("🔗 URL actualizada con step=1");
  };

  // Funciones para manejar el modal de detalles
  const handleServiceClick = (serviceId: string) => {
    console.log("🎯 Servicio clickeado:", serviceId);
    // Funcionalidad del click removida - modal eliminado
  };

  // Generar partículas para efectos cinematográficos
  useEffect(() => {
    const generateParticles = () => {
      const count = reducedMotion ? 0 : 50;
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, [activeService, reducedMotion]);

  const services: ServiceCategory[] = [
    {
      id: "desarrollo-software",
      title: "Desarrollo de Software",
      description:
        "Forjamos el futuro digital con arquitecturas revolucionarias que trascienden los límites de la tecnología convencional.",
      icon: Code,
  color: "#4FC08D",
      features: [
        "Arquitecturas Cuánticas",
        "Apps Neuroadaptativas",
        "Realidad Mixta XR",
        "APIs Inteligentes",
        "Microservicios Autónomos",
        "DevOps Cognitivo",
      ],
  bgGradient: "from-emerald-900/30 via-slate-900/30 to-emerald-900/30",
  iconGradient: "from-emerald-400 to-green-500",
  badgeGradient: "from-emerald-500 to-green-600",
      badge: "QUANTUM TECH",
    },
    {
      id: "inteligencia-artificial",
      title: "Inteligencia Artificial",
      description:
        "Desatamos el poder de la superinteligencia para crear soluciones que aprenden, evolucionan y transforman industrias enteras.",
      icon: Brain,
  color: "#42B883",
      features: [
        "Deep Learning Avanzado",
        "Redes Neuronales Recursivas",
        "Procesamiento Cuántico",
        "Visión Artificial 360°",
        "Predicción Temporal",
        "IA Conversacional",
      ],
  bgGradient: "from-teal-900/30 via-slate-900/30 to-emerald-900/30",
  iconGradient: "from-teal-400 to-emerald-500",
  badgeGradient: "from-teal-500 to-emerald-600",
      badge: "SUPER AI",
    },
    {
      id: "ecommerce-evolutivo",
      title: "E-commerce Evolutivo",
      description:
        "Revolucionamos el comercio digital con plataformas que predicen deseos y crean experiencias de compra inmersivas.",
      icon: ShoppingCart,
  color: "#4FC08D",
      features: [
        "Comercio Cuántico",
        "Realidad Aumentada Comercial",
        "IA Predictiva de Ventas",
        "Blockchain Payments",
        "Experiencias Inmersivas",
        "Logística Inteligente",
      ],
  bgGradient: "from-emerald-900/30 via-slate-900/30 to-green-900/30",
  iconGradient: "from-emerald-400 to-green-500",
  badgeGradient: "from-emerald-500 to-green-600",
      badge: "QUANTUM COMMERCE",
    },
    {
      id: "ciberseguridad-cuantica",
      title: "Ciberseguridad Cuántica",
      description:
        "Blindaje digital impenetrable con tecnologías de encriptación cuántica y sistemas de defensa autoadaptativos.",
      icon: Shield,
  color: "#42B883",
      features: [
        "Encriptación Cuántica",
        "Defensa Autoadaptativa",
        "Análisis de Amenazas IA",
        "Zero Trust Architecture",
        "Blockchain Security",
        "Biometría Avanzada",
      ],
  bgGradient: "from-slate-900/30 via-emerald-900/30 to-slate-900/30",
  iconGradient: "from-green-400 to-emerald-500",
  badgeGradient: "from-green-500 to-emerald-600",
      badge: "QUANTUM SHIELD",
    },
  ];

  return (
  <section id="servicios" className="relative py-32 overflow-hidden">
      {/* Fondo cinematográfico con gradientes complejos */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-green-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-900/50 to-black"></div>
      </div>

      {/* Partículas flotantes cinematográficas */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-emerald-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(particle.id) * 50, 0],
              opacity: [particle.opacity, 0, particle.opacity],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        {/* Hero Section Cinematográfico */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          {/* Glitch effect title */}
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.8 }}
            whileInView={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-8 relative"
          >
            <h2 className="text-6xl md:text-8xl font-black mb-6 relative">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent animate-pulse">
                SERVICIOS
              </span>
              <span className="relative bg-gradient-to-r from-white via-emerald-200 to-green-300 bg-clip-text text-transparent">
                SERVICIOS
              </span>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 blur-3xl animate-pulse"></div>
            </h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
            >
              DEL FUTURO
            </motion.h3>
            <p className="text-xl md:text-2xl text-emerald-100/80 max-w-4xl mx-auto leading-relaxed mt-6">
              Forjamos realidades digitales que desafían los límites de la imaginación
            </p>
          </motion.div>

          {/* Holographic Play Button */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            whileInView={{ scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.button
              whileHover={{
                scale: 1.2,
                rotateY: 15,
                boxShadow: "0 0 80px rgba(6, 182, 212, 0.6)",
              }}
              whileTap={{ scale: 0.9 }}
              className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white rounded-2xl font-bold text-xl shadow-2xl border border-emerald-400/30 backdrop-blur-sm"
              onClick={handleStartExperience}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-teal-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Play className="w-8 h-8 relative z-10" />
              <span className="relative z-10">INICIAR EXPERIENCIA</span>
              {/* Orbiting elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border border-emerald-400/20 rounded-2xl"
              ></motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Services Grid Cinematográfico */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 60, rotateX: 45 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 1,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              viewport={{ once: true }}
              whileHover={{
                y: -20,
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 50px 100px -20px rgba(6, 182, 212, 0.4)",
              }}
              className="group cursor-pointer perspective-1000"
              onHoverStart={() => setActiveService(service.id)}
              onHoverEnd={() => setActiveService(null)}
            >
              <Card className="relative h-full overflow-hidden bg-black/80 border border-emerald-500/20 backdrop-blur-xl hover:border-emerald-400/60 transition-all duration-700 transform-gpu">
                {/* Holographic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-slate-900/10 to-green-900/10"></div>

                {/* Animated background pattern */}
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#10b981_25%,transparent_25%),linear-gradient(-45deg,#10b981_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#10b981_75%),linear-gradient(-45deg,transparent_75%,#10b981_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                ></motion.div>

                {/* Glow effect on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-30 transition-all duration-700 blur-xl`}
                ></div>

                {/* Content */}
                <div className="relative p-8 z-10">
                  {/* Icon with holographic effect */}
                  <motion.div
                    whileHover={{
                      rotateY: 360,
                      scale: 1.3,
                      rotateX: 15,
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative mb-8"
                  >
                    {/* Icon glow rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-0 w-20 h-20 border-2 border-dashed border-emerald-400/30 rounded-full`}
                    ></motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-2 w-16 h-16 border border-solid border-emerald-400/20 rounded-full`}
                    ></motion.div>

                    <div
                      className={`relative w-20 h-20 bg-gradient-to-r ${service.iconGradient} rounded-2xl flex items-center justify-center text-white shadow-2xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                      <service.icon className="w-10 h-10 relative z-10" />
                    </div>
                  </motion.div>

                  {/* Title with glitch effect */}
                  <motion.h3
                    whileHover={{ scale: 1.05 }}
                    className="relative text-2xl font-black text-white mb-6 group-hover:text-emerald-300 transition-colors duration-500"
                  >
                    <span className="relative z-10">{service.title}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.h3>

                  {/* Description */}
                  <p className="text-emerald-100/80 mb-8 leading-relaxed text-sm">
                    {service.description}
                  </p>

                  {/* Features with stagger animation */}
                  <div className="space-y-3 mb-8">
                    {service.features.slice(0, 4).map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.1 + idx * 0.15,
                          duration: 0.6,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                        whileHover={{ x: 10, scale: 1.05 }}
                        className="flex items-center gap-3 group/feature"
                      >
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.2 }}
                          className={`w-2 h-2 bg-gradient-to-r ${service.iconGradient} rounded-full shadow-lg group-hover/feature:shadow-emerald-400/50`}
                        ></motion.div>
                        <span className="text-emerald-200/90 font-medium text-xs">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Futuristic Badge and Details Button */}
                  <div className="flex items-center justify-between">
                    <motion.div whileHover={{ scale: 1.1, rotateX: 15 }} className="relative">
                      <Badge
                        variant="secondary"
                        className={`relative bg-gradient-to-r ${service.badgeGradient} text-white border-none px-3 py-1 text-xs font-bold tracking-wider shadow-xl`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded"></div>
                        <span className="relative z-10">{service.badge}</span>
                      </Badge>
                    </motion.div>


                  </div>
                </div>

                {/* Scanning line effect */}
                <motion.div
                  animate={{
                    y: ["-100%", "100%", "-100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30 group-hover:opacity-70"
                ></motion.div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-emerald-400/30 group-hover:border-emerald-400/70 transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-emerald-400/30 group-hover:border-emerald-400/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-emerald-400/30 group-hover:border-emerald-400/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-emerald-400/30 group-hover:border-emerald-400/70 transition-colors duration-500"></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Nuestro Proceso de Trabajo */}
        {experienceStarted && (
          <section
            id="proceso-trabajo"
            ref={processRef}
            className="relative mt-28 mb-4"
            role="region"
            aria-labelledby="titulo-proceso-trabajo"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                changeStep(activeStep - 1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                changeStep(activeStep + 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                changeStep(0);
              } else if (e.key === "End") {
                e.preventDefault();
                changeStep(steps.length - 1);
              } else if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                setIsPlaying((p) => !p);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setIsPlaying(false);
              } else if (e.key >= "1" && e.key <= "6") {
                e.preventDefault();
                const stepIndex = parseInt(e.key) - 1;
                if (stepIndex < steps.length) {
                  changeStep(stepIndex);
                }
              }
            }}
          >
            {/* Fondo sutil */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-slate-900/60 via-black/40 to-slate-900/60 border border-emerald-500/10" />

            <div className="relative px-6 py-12 md:px-10 md:py-16">
              {/* Encabezado */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-10"
              >
                <h3 id="titulo-proceso-trabajo" className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-white to-green-300 bg-clip-text text-transparent">
                  Nuestro Proceso de Trabajo
                </h3>
                <p className="text-emerald-100/80 mt-3 max-w-3xl mx-auto">
                  Una experiencia guiada paso a paso para entender cómo convertimos ideas en productos reales.
                </p>

                {/* Ayuda de teclado */}
                <div id="keyboard-help" className="mt-4 text-xs text-emerald-200/60 max-w-4xl mx-auto">
                  <details className="group">
                    <summary className="cursor-pointer hover:text-emerald-200/80 transition-colors list-none">
                      <span className="inline-flex items-center gap-1">
                        ⌨️ Atajos de teclado disponibles
                        <span className="group-open:rotate-180 transition-transform">▼</span>
                      </span>
                    </summary>
                    <div className="mt-2 p-3 bg-slate-800/50 rounded-lg border border-emerald-500/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                        <div><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">←→</kbd> Navegar pasos</div>
                        <div><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">1-6</kbd> Ir a paso específico</div>
                        <div><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Espacio</kbd> Pausar/Reanudar</div>
                        <div><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Escape</kbd> Pausar</div>
                        <div><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Home</kbd> Primer paso</div>
                        <div><kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">End</kbd> Último paso</div>
                      </div>
                    </div>
                  </details>
                </div>

                {/* Paso X de N y región aria-live */}
                <div className="mt-2 text-sm text-emerald-200/80">
                  Paso {activeStep + 1} de {steps.length}
                </div>
                <div className="sr-only" role="status" aria-live="polite">
                  Paso {activeStep + 1} de {steps.length}: {steps[activeStep].title}. 
                  {steps[activeStep].description}. 
                  Duración estimada: {steps[activeStep].duration}. 
                  {isPlaying ? "Reproducción automática activada" : "Reproducción pausada"}.
                </div>
                
                {/* Instrucciones adicionales para lectores de pantalla */}
                <div className="sr-only">
                  Usa las flechas izquierda y derecha para navegar entre pasos, 
                  la barra espaciadora para pausar o reanudar, 
                  o los números del 1 al 6 para ir directamente a un paso específico.
                </div>

                {/* Controles */}
                <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
                  {/* Botón anterior - mejorado para móviles */}
                  <button
                    onClick={() => {
                      changeStep(activeStep - 1);
                      setIsPlaying(false);
                    }}
                    disabled={activeStep === 0}
                    className="inline-flex items-center gap-2 px-5 py-3 md:py-2 rounded-xl border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/10 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] md:min-h-auto"
                    aria-label={`Ir al paso anterior: ${activeStep > 0 ? steps[activeStep - 1].title : 'No disponible'}`}
                    aria-describedby="keyboard-help"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </button>
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/10 transition-colors"
                    aria-pressed={isPlaying}
                    aria-label={isPlaying ? "Pausar reproducción automática" : "Reanudar reproducción automática"}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" /> Pausar
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" /> Reanudar
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setActiveStep(0);
                      setIsPlaying(true);
                      updateURLStep(0);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/10 transition-colors"
                    aria-label="Reiniciar proceso desde el primer paso: Descubrimiento"
                  >
                    <RotateCcw className="w-4 h-4" /> Reiniciar
                  </button>
                  {/* Botón siguiente - mejorado para móviles */}
                  <button
                    onClick={() => {
                      changeStep(activeStep + 1);
                      setIsPlaying(false);
                    }}
                    disabled={activeStep === steps.length - 1}
                    className="inline-flex items-center gap-2 px-5 py-3 md:py-2 rounded-xl border border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/10 transition-colors disabled:opacity-50 touch-manipulation min-h-[44px] md:min-h-auto"
                    aria-label={`Ir al paso siguiente: ${activeStep < steps.length - 1 ? steps[activeStep + 1].title : 'No disponible'}`}
                    aria-describedby="keyboard-help"
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Velocidad */}
                  <div className="inline-flex items-center gap-1 ml-2 border border-emerald-400/30 rounded-xl overflow-hidden">
                    {[1, 1.5].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSpeed(v)}
                        className={`px-3 py-2 text-sm ${
                          speed === v ? "bg-emerald-500/15 text-emerald-200" : "text-emerald-200/80 hover:bg-emerald-500/10"
                        }`}
                        aria-pressed={speed === v}
                      >
                        {v}x
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Indicadores de progreso mejorados */}
              <div className="relative max-w-5xl mx-auto mb-10">
                {/* Indicador circular de progreso */}
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-24 h-24">
                    {/* Círculo de fondo */}
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(30 41 59 / 0.8)"
                        strokeWidth="8"
                        fill="none"
                        className="drop-shadow-sm"
                      />
                      {/* Círculo de progreso */}
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 45 * (1 - (activeStep + 1) / steps.length)
                        }}
                        transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
                        className="drop-shadow-lg"
                      />
                    </svg>
                    {/* Gradiente para el círculo */}
                    <svg className="absolute inset-0 w-0 h-0">
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="50%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#6ee7b7" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Texto central */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-200">
                          {activeStep + 1}
                        </div>
                        <div className="text-xs text-emerald-200/60">
                          de {steps.length}
                        </div>
                        <div className="text-xs text-emerald-300/80 mt-1 font-medium">
                          {steps[activeStep].duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso lineal mejorada */}
                <div className="relative h-3 rounded-full bg-slate-800/80 border border-slate-700/60 overflow-hidden mb-4">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
                  >
                    {/* Efecto de brillo */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatDelay: 1 
                      }}
                    />
                  </motion.div>
                  {/* Marcadores de pasos */}
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`absolute top-0 w-0.5 h-full transition-colors duration-300 ${
                        i <= activeStep ? "bg-emerald-200/40" : "bg-slate-600/60"
                      }`}
                      style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Panel de métricas de tiempo */}
                <motion.div 
                  className="mb-6 p-4 bg-slate-800/30 rounded-xl border border-emerald-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-xs text-emerald-200/60">Paso Actual</div>
                      <div className="text-lg font-bold text-emerald-200">{steps[activeStep].duration}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-emerald-200/60">Tiempo Total</div>
                      <div className="text-lg font-bold text-emerald-200">
                        {(() => {
                          const totalWeeks = steps.reduce((acc, step) => {
                            const match = step.duration.match(/(\d+)-?(\d+)?/);
                            if (match) {
                              const min = parseInt(match[1]);
                              const max = match[2] ? parseInt(match[2]) : min;
                              return acc + (min + max) / 2;
                            }
                            return acc;
                          }, 0);
                          return `${Math.round(totalWeeks)} semanas`;
                        })()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-emerald-200/60">Progreso</div>
                      <div className="text-lg font-bold text-emerald-200">
                        {Math.round(((activeStep + 1) / steps.length) * 100)}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-emerald-200/60">Equipo</div>
                      <div className="text-lg font-bold text-emerald-200">
                        {steps[activeStep].details.team.length} personas
                      </div>
                    </div>
                  </div>
                  
                  {/* Estimación de tiempo restante */}
                  <div className="mt-4 pt-4 border-t border-emerald-500/20">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-emerald-200/70">Tiempo restante estimado:</span>
                      <span className="text-emerald-200 font-medium">
                        {(() => {
                          const remainingSteps = steps.slice(activeStep + 1);
                          const remainingWeeks = remainingSteps.reduce((acc, step) => {
                            const match = step.duration.match(/(\d+)-?(\d+)?/);
                            if (match) {
                              const min = parseInt(match[1]);
                              const max = match[2] ? parseInt(match[2]) : min;
                              return acc + (min + max) / 2;
                            }
                            return acc;
                          }, 0);
                          return remainingWeeks > 0 ? `${Math.round(remainingWeeks)} semanas` : 'Completado';
                        })()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Navegación por pasos mejorada */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  {steps.map((s, i) => (
                    <motion.button
                      key={s.id}
                      onClick={() => changeStep(i)}
                      className={`relative px-3 py-2 rounded-lg transition-all duration-300 touch-manipulation min-h-[40px] ${
                        i === activeStep 
                          ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40" 
                          : "text-emerald-200/70 hover:bg-emerald-500/10 hover:text-emerald-200"
                      }`}
                      aria-current={i === activeStep}
                      aria-label={`Ir al paso ${i + 1}: ${s.title}`}
                      title={`Paso ${i + 1} • Duración: ${s.duration || "-"}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Indicador de estado */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
                        i < activeStep 
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
                          : i === activeStep 
                            ? "bg-emerald-300 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]" 
                            : "bg-slate-600/60"
                      }`} />
                      <span className="relative z-10">{s.title}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Grid de pasos */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
                onPan={handlePan}
                onPanEnd={handlePan}
              >
                {steps.map((step, i) => {
                  const Icon = step.icon as any;
                  const isActive = i === activeStep;
                  
                  const tooltipContent = (
                    <div className="space-y-3 max-w-sm">
                      <div>
                        <h5 className="font-semibold text-emerald-200 mb-1">Actividades principales:</h5>
                        <ul className="text-xs space-y-1">
                          {step.details.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-emerald-200 mb-1">Entregables:</h5>
                        <ul className="text-xs space-y-1">
                          {step.details.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-emerald-400 mt-1">•</span>
                              <span>{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-emerald-200 mb-1">Equipo involucrado:</h5>
                        <div className="flex flex-wrap gap-1">
                          {step.details.team.map((member, idx) => (
                            <span key={idx} className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded">
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-600">
                        <span className="text-xs text-emerald-300 font-medium">
                          Duración estimada: {step.duration}
                        </span>
                      </div>
                    </div>
                  );

                  return (
                    <Tooltip key={step.id} content={tooltipContent} position="top" delay={300}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.08 }}
                        onClick={() => {
                          setActiveStep(i);
                          setIsPlaying(false);
                          updateURLStep(i);
                        }}
                        className={`relative cursor-pointer group ${isActive ? "" : "opacity-80"}`}
                      >
                        <Card className={`relative h-full overflow-hidden bg-black/70 border ${
                          isActive ? "border-emerald-400/60" : "border-emerald-400/20"
                        } backdrop-blur-xl transition-all duration-500`}>
                        {/* Glow */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-slate-900/10 to-green-900/20 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                        } transition-opacity duration-500`} />

                        {/* Línea de escaneo */}
                        {!reducedMotion && (
                          <motion.div
                            animate={{ y: ["-100%", "100%", "-100%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-30 group-hover:opacity-70"
                          />
                        )}

                        <div className="relative p-6 z-10">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center ${
                              isActive ? "shadow-[0_0_40px_rgba(16,185,129,0.35)]" : ""
                            }`}>
                              <Icon className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <h4 className={`text-lg font-extrabold ${isActive ? "text-emerald-200" : "text-white"}`}>
                                {i + 1}. {step.title}
                              </h4>
                              <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mt-1 opacity-60" />
                            </div>
                          </div>
                          <p className="text-emerald-100/80 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </Card>
                      </motion.div>
                    </Tooltip>
                  );
                })}
              </motion.div>
            </div>
          </section>
        )}


      </div>
    </section>
  );
};

export default ServicesSection;
