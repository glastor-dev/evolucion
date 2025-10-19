import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Award,
  Brain,
  ChevronRight,
  Cloud,
  Code,
  Cpu,
  Database,
  Eye,
  Globe,
  Layers,
  Play,
  Rocket,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  features: string[];
  technologies: string[];
  bgGradient: string;
  iconGradient: string;
  badgeGradient: string;
  badge: string;
}

const ServicesSection: React.FC = () => {
  const [activeService, setActiveService] = useState<string | null>("ai");
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; opacity: number }>
  >([]);

  // Generar partículas para efectos cinematográficos
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, [activeService]);

  const services: ServiceCategory[] = [
    {
      id: "development",
      title: "Desarrollo de Software",
      description:
        "Forjamos el futuro digital con arquitecturas revolucionarias que trascienden los límites de la tecnología convencional.",
      icon: Code,
      color: "#00d4ff",
      features: [
        "Arquitecturas Cuánticas",
        "Apps Neuroadaptativas",
        "Realidad Mixta XR",
        "APIs Inteligentes",
        "Microservicios Autónomos",
        "DevOps Cognitivo",
      ],
      technologies: [
        "React",
        "Next.js",
        "Node.js",
        "Python",
        "Docker",
        "AWS",
        "Kubernetes",
        "GraphQL",
      ],
      bgGradient: "from-vue-dark/30 via-vue-secondary/30 to-vue-primary/30",
      iconGradient: "from-vue-primary to-vue-secondary",
      badgeGradient: "from-vue-primary to-vue-secondary",
      badge: "GLASTOR",
    },
    {
      id: "ai",
      title: "Inteligencia Artificial",
      description:
        "Desatamos el poder de la superinteligencia para crear soluciones que aprenden, evolucionan y transforman industrias enteras.",
      icon: Brain,
      color: "#ff006e",
      features: [
        "Deep Learning Avanzado",
        "Redes Neuronales Recursivas",
        "Procesamiento Cuántico",
        "Visión Artificial 360°",
        "Predicción Temporal",
        "IA Conversacional",
      ],
      technologies: [
        "TensorFlow",
        "PyTorch",
        "OpenAI",
        "Hugging Face",
        "MLflow",
        "Azure AI",
        "CUDA",
        "JAX",
      ],
      bgGradient: "from-vue-dark/30 via-vue-secondary/30 to-vue-primary/30",
      iconGradient: "from-vue-primary to-vue-secondary",
      badgeGradient: "from-vue-primary to-vue-secondary",
      badge: "GLASTOR",
    },
    {
      id: "ecommerce",
      title: "E-commerce Evolutivo",
      description:
        "Revolucionamos el comercio digital con plataformas que predicen deseos y crean experiencias de compra inmersivas.",
      icon: ShoppingCart,
      color: "#00ff87",
      features: [
        "Commerce Inmersivo",
        "IA de Recomendación",
        "Pagos Biométricos",
        "Analytics Predictivo",
        "Marketing Neurológico",
        "Experiencias Holográficas",
      ],
      technologies: [
        "Shopify Plus",
        "WooCommerce",
        "Stripe",
        "PayPal",
        "Analytics",
        "AR/VR",
        "Blockchain",
      ],
      bgGradient: "from-vue-dark/30 via-vue-secondary/30 to-vue-primary/30",
      iconGradient: "from-vue-primary to-vue-secondary",
      badgeGradient: "from-vue-primary to-vue-secondary",
      badge: "GLASTOR",
    },
    {
      id: "security",
      title: "Ciberseguridad Cuántica",
      description:
        "Blindaje digital impenetrable con tecnologías de encriptación cuántica y sistemas de defensa autoadaptativos.",
      icon: Shield,
      color: "#ff3f00",
      features: [
        "Encriptación Cuántica",
        "IA de Amenazas",
        "Biometría Molecular",
        "Defensa Autónoma",
        "Honeypots Inteligentes",
        "Forensia Digital",
      ],
      technologies: [
        "Quantum Encryption",
        "Zero Trust",
        "AI Security",
        "Blockchain",
        "Biometrics",
        "SIEM",
      ],
      bgGradient: "from-vue-dark/30 via-vue-secondary/30 to-vue-primary/30",
      iconGradient: "from-vue-primary to-vue-secondary",
      badgeGradient: "from-vue-primary to-vue-secondary",
      badge: "GLASTOR",
    },
  ];

  // Nuestros Números - datos y lógica de contador
  const stats = [
    {
      id: "s1",
      value: "10+",
      label: "Años de Trayectoria",
      description: "Crecimiento e innovación constante",
    },
    {
      id: "s2",
      value: "5000+",
      label: "Clientes Satisfechos",
      description: "Relaciones confiables a largo plazo",
    },
    {
      id: "s3",
      value: "800+",
      label: "Productos Especializados",
      description: "Soluciones adaptadas a cada necesidad",
    },
  ];

  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    if (isStatsInView) {
      stats.forEach((stat, index) => {
        const targetValue = parseInt(stat.value.replace(/\D/g, "")) || 0;
        let currentValue = 0;
        const increment = targetValue / 60; // ~1s

        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }

          setCounters((prev) => {
            const next = [...prev];
            next[index] = Math.floor(currentValue);
            return next;
          });
        }, 16);
      });
    }
  }, [isStatsInView]);

  const formatCounterValue = useMemo(
    () => (value: number, originalValue: string) => {
      if (originalValue.includes("+")) return `${value}+`;
      return value.toString();
    },
    []
  );

  return (
    <section id="servicios" className="relative py-32 overflow-hidden">
      {/* Fondo cinematográfico con gradientes complejos */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-vue-dark/20 via-vue-secondary/20 to-vue-primary/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-vue-dark/30 via-accent/50 to-black"></div>
      </div>

      {/* Partículas flotantes cinematográficas */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-vue-primary rounded-full"
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
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--vue-primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--vue-primary)/0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

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
              <span className="absolute inset-0 bg-gradient-to-r from-vue-secondary via-vue-primary to-vue-light bg-clip-text text-transparent animate-pulse">
                SERVICIOS
              </span>
              <span className="relative bg-gradient-to-r from-white via-vue-light to-vue-secondary/60 bg-clip-text text-transparent">
                SERVICIOS
              </span>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-vue-primary/20 via-vue-secondary/20 to-vue-light/20 blur-3xl animate-pulse"></div>
            </h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-vue-light to-vue-primary bg-clip-text text-transparent"
            >
              DEL FUTURO
            </motion.h3>
            <p className="text-xl md:text-2xl text-vue-light/80 max-w-4xl mx-auto leading-relaxed mt-6">
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
                boxShadow: "0 0 80px hsla(var(--vue-primary) / 0.6)",
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(true)}
              className="group relative inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-vue-secondary via-vue-primary to-vue-light text-white rounded-2xl font-bold text-xl shadow-2xl border border-vue-primary/30 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-vue-secondary/20 via-vue-primary/20 to-vue-light/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <Play className="w-8 h-8 relative z-10" />
              <span className="relative z-10">INICIAR EXPERIENCIA</span>
              {/* Orbiting elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border border-vue-primary/20 rounded-2xl"
              ></motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Services Grid Cinematográfico */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
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
              <Card className="relative h-full overflow-hidden bg-black/80 border border-vue-primary/20 backdrop-blur-xl hover:border-vue-primary/60 transition-all duration-700 transform-gpu">
                {/* Holographic background */}
                <div className="absolute inset-0 bg-gradient-to-br from-vue-dark/10 via-vue-secondary/10 to-vue-primary/10"></div>

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
                  className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--vue-primary))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--vue-primary))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
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
                      className="absolute inset-0 w-20 h-20 border-2 border-dashed border-vue-primary/30 rounded-full"
                    ></motion.div>
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 w-16 h-16 border border-solid border-vue-primary/20 rounded-full"
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
                    className="relative text-3xl font-black text-white mb-6 group-hover:text-vue-primary transition-colors duration-500"
                  >
                    <span className="relative z-10">{service.title}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-vue-primary/20 to-vue-secondary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.h3>

                  {/* Description */}
                  <p className="text-vue-light/80 mb-8 leading-relaxed text-lg">
                    {service.description}
                  </p>

                  {/* Features with stagger animation */}
                  <div className="space-y-4 mb-8">
                    {service.features.map((feature, idx) => (
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
                        className="flex items-center gap-4 group/feature"
                      >
                        <motion.div
                          whileHover={{ rotate: 180, scale: 1.2 }}
                          className={`w-3 h-3 bg-gradient-to-r ${service.iconGradient} rounded-full shadow-lg group-hover/feature:shadow-vue-primary/50`}
                        ></motion.div>
                        <span className="text-vue-light/90 font-medium">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Futuristic Badge */}
                  <motion.div whileHover={{ scale: 1.1, rotateX: 15 }} className="relative">
                    <Badge
                      variant="secondary"
                      className={`relative bg-gradient-to-r ${service.badgeGradient} text-white border-none px-4 py-2 text-sm font-bold tracking-wider shadow-xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded"></div>
                      <span className="relative z-10">{service.badge}</span>
                    </Badge>
                  </motion.div>
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
                  className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vue-primary to-transparent opacity-30 group-hover:opacity-70"
                ></motion.div>

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Nuestros Números - Cinemático */}
        <div ref={statsRef} className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
              Nuestros Números
            </h2>
            <p className="text-xl text-vue-light/80 max-w-2xl mx-auto">
              Cifras que respaldan nuestro compromiso con la excelencia
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="relative overflow-hidden rounded-2xl border border-vue-primary/30 bg-black/70 backdrop-blur-xl p-8">
                  {/* Holographic overlay */}
                  <motion.div
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute inset-0 opacity-10 bg-[linear-gradient(45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(-45deg,hsl(var(--vue-primary))_25%,transparent_25%),linear-gradient(45deg,transparent_75%,hsl(var(--vue-primary))_75%),linear-gradient(-45deg,transparent_75%,hsl(var(--vue-primary))_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                  />

                  {/* Decorative ring */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[conic-gradient(from_180deg,transparent,hsla(var(--vue-primary)/0.4),transparent)] blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>

                  {/* Number */}
                  <div className="text-5xl md:text-6xl font-black mb-2 bg-gradient-to-r from-white via-vue-light to-vue-primary bg-clip-text text-transparent">
                    {formatCounterValue(counters[index], stat.value)}
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-vue-primary mb-1">{stat.label}</h3>

                  {/* Description */}
                  <p className="text-vue-light/80 text-sm">{stat.description}</p>

                  {/* Radial spotlight on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute -inset-24 bg-[radial-gradient(ellipse_at_center,hsla(var(--vue-primary)/0.2),transparent_60%)]"></div>
                  </div>

                  {/* Scanning line */}
                  <motion.div
                    animate={{ y: ["-100%", "100%", "-100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.4 }}
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-vue-primary to-transparent opacity-20 group-hover:opacity-60"
                  ></motion.div>

                  {/* Corner accents */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-vue-primary/30 group-hover:border-vue-primary/70 transition-colors duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
