import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Grid3X3,
  List,
  Play,
  Search,
  Share2,
  Star,
  Target,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import "./videos-cinema.css";

// Interfaces para el tipado fuerte
interface VideoProduct {
  id: number;
  title: string;
  subtitle: string;
  duration: string;
  views: string;
  type: "video" | "product" | "showcase";
  category: string;
  badge: string;
  thumbnail: string;
  description: string;
  youtubeId?: string;
  featured?: boolean;
  rating?: number;
  date?: string;
  tags?: string[];
}

interface VideoModalProps {
  video: VideoProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

// Modal de video cinematográfico
const VideoModal: React.FC<VideoModalProps> = ({ video, isOpen, onClose }) => {
  if (!isOpen || !video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header del modal */}
          <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge className={`px-3 py-1 ${getBadgeColor(video.badge)}`}>{video.badge}</Badge>
                <div className="text-sm text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {video.duration}
                  <span className="text-slate-600">•</span>
                  <Eye className="w-4 h-4" />
                  {video.views}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Contenido del video */}
          <div className="aspect-video relative">
            {video.youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&playsinline=1`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-[#4FC08D] mx-auto mb-4" />
                  <p className="text-slate-300">Video no disponible</p>
                </div>
              </div>
            )}
          </div>

          {/* Información del video */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
              <p className="text-lg text-slate-300 mb-4">{video.subtitle}</p>
              <p className="text-slate-400 leading-relaxed">{video.description}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-300 border-slate-600 hover:bg-slate-800"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-slate-300 border-slate-600 hover:bg-slate-800"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir
                </Button>
              </div>
              <Button className="bg-gradient-to-r from-[#42B883] to-[#4FC08D] hover:from-[#4FC08D] hover:to-[#42B883] text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en YouTube
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Datos de videos y productos mejorados
const featuredProducts: VideoProduct[] = [
  {
    id: 1,
    title: "Pistola de Calor Inalámbrica HG001G",
    subtitle: "Makita XGT Series",
    date: "Nuevo Producto",
    duration: "2:29",
    views: "45K",
    type: "video",
    category: "MAKITA",
    badge: "NUEVO",
    thumbnail:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop&crop=center",
    description:
      "Descubre la nueva pistola de calor inalámbrica con tecnología XGT de 40V para trabajos profesionales",
    youtubeId: "UUT81Brz1gU",
    featured: true,
    rating: 4.8,
    tags: ["XGT", "40V", "Inalámbrica", "Profesional"],
  },
  {
    id: 2,
    title: "Amoladora Inalámbrica GD001G/GD002G",
    subtitle: "Makita Cordless Die Grinder",
    duration: "1:45",
    views: "32K",
    type: "video",
    category: "MAKITA",
    badge: "DESTACADO",
    thumbnail:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=450&fit=crop&crop=center",
    description:
      "Amoladoras inalámbricas de precisión para trabajos detallados y acabados profesionales",
    youtubeId: "_S1nzGSWFe8",
    rating: 4.6,
    tags: ["Precisión", "Inalámbrica", "Acabados"],
  },
  {
    id: 3,
    title: "Serie XGT 40V - Tecnología Avanzada",
    subtitle: "Makita Li-ion 40V max XGT",
    duration: "6:07",
    views: "128K",
    type: "video",
    category: "MAKITA",
    badge: "TECNOLOGÍA",
    thumbnail:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop&crop=center",
    description:
      "Conoce el mecanismo y la tecnología detrás de la revolucionaria serie XGT de 40V máximo",
    youtubeId: "iRyrOcGuWZk",
    featured: true,
    rating: 4.9,
    tags: ["XGT", "Tecnología", "Li-ion", "40V"],
  },
  {
    id: 4,
    title: "Llave de Impacto Inalámbrica TW010G",
    subtitle: "Makita Cordless Impact Wrench",
    duration: "2:46",
    views: "67K",
    type: "video",
    category: "MAKITA",
    badge: "POTENCIA",
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop&crop=center",
    description:
      "Llave de impacto inalámbrica de alta potencia para trabajos industriales y automotrices",
    youtubeId: "UpvvGoLv7KM",
    rating: 4.7,
    tags: ["Impacto", "Industrial", "Automotriz"],
  },
  {
    id: 5,
    title: "Soluciones Automotrices Makita",
    subtitle: "Herramientas Especializadas para Talleres",
    duration: "Explorar",
    views: "45K",
    type: "showcase",
    category: "AUTOMOTRIZ",
    badge: "ESPECIALIZADO",
    thumbnail: "https://cdn.makitatools.com/apps/wms/Home/images/explore/solutions/automotive.jpg",
    description:
      "Equipamiento profesional diseñado específicamente para la industria automotriz. Herramientas de precisión para diagnóstico, reparación y mantenimiento vehicular.",
    rating: 4.5,
    tags: ["Automotriz", "Talleres", "Diagnóstico"],
  },
  {
    id: 6,
    title: "Equipos de Limpieza Industrial",
    subtitle: "Soluciones de Mantenimiento Profesional",
    duration: "Ver más",
    views: "32K",
    type: "product",
    category: "LIMPIEZA",
    badge: "PROFESIONAL",
    thumbnail: "https://cdn.makitatools.com/apps/wms/Home/images/explore/solutions/janitorial.jpg",
    description:
      "Sistemas avanzados de limpieza y mantenimiento para espacios comerciales e industriales. Eficiencia y durabilidad garantizada.",
    rating: 4.4,
    tags: ["Limpieza", "Industrial", "Mantenimiento"],
  },
  {
    id: 7,
    title: "Sistemas de Control de Polvo",
    subtitle: "Tecnología de Extracción Avanzada",
    duration: "Descubrir",
    views: "28K",
    type: "product",
    category: "EXTRACCIÓN",
    badge: "INNOVACIÓN",
    thumbnail:
      "https://cdn.makitatools.com/apps/wms/Home/images/explore/solutions/dust-solutions.jpg",
    description:
      "Soluciones inteligentes para el control y extracción de polvo. Protege tu salud y mantén un ambiente de trabajo limpio y seguro.",
    rating: 4.8,
    tags: ["Control", "Polvo", "Salud", "Seguridad"],
  },
  {
    id: 8,
    title: "Herramientas para Silvicultura",
    subtitle: "Equipos Forestales de Alto Rendimiento",
    duration: "Explorar",
    views: "41K",
    type: "product",
    category: "FORESTAL",
    badge: "POTENTE",
    thumbnail: "https://makita.com.ar/wp-content/uploads/2023/12/institucional-linea-bosque.jpg",
    description:
      "Maquinaria robusta y especializada para trabajos forestales. Motosierras, desbrozadoras y equipos diseñados para el manejo sostenible del bosque.",
    rating: 4.6,
    tags: ["Forestal", "Motosierras", "Sostenible"],
  },
];

// Función auxiliar para obtener colores de badges
const getBadgeColor = (badge: string): string => {
  const colors = {
    NUEVO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    DESTACADO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    POPULAR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    TRENDING: "bg-red-500/20 text-red-400 border-red-500/30",
    INNOVACIÓN: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    PROFESIONAL: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    SMART: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    POTENTE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    TECNOLOGÍA: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    POTENCIA: "bg-red-600/20 text-red-400 border-red-600/30",
    ESPECIALIZADO: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    EXTRACCIÓN: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    FORESTAL: "bg-green-600/20 text-green-400 border-green-600/30",
  };
  return colors[badge as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
};

const Videos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFeatured, setShowFeatured] = useState(true);

  const sectionRef = useRef<HTMLDivElement>(null);

  // Filtros únicos de categorías
  const categories = useMemo(() => {
    const uniqueCategories = [
      "TODOS",
      ...Array.from(new Set(featuredProducts.map((p) => p.category))),
    ];
    return uniqueCategories;
  }, []);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    let filtered = featuredProducts;

    if (activeFilter !== "TODOS") {
      filtered = filtered.filter((product) => product.category === activeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [activeFilter, searchTerm]);

  // Manejo del modal de video
  const openVideoModal = useCallback((video: VideoProduct) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  }, []);

  // Sistema de partículas para el fondo
  useEffect(() => {
    const particles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "1";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 192, 141, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      document.body.removeChild(canvas);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredProducts]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Fondo con efectos avanzados */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#4FC08D]/10 via-transparent to-transparent opacity-50" />

      {/* Hero cinematográfico */}
      <section className="relative z-10 pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 bg-gradient-to-r from-[#4FC08D] via-white to-[#42B883] bg-clip-text text-transparent leading-tight"
              initial={{ opacity: 0, scale: 0.8, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            >
              CINEMA
              <br />
              <span className="text-[#4FC08D] block">MAKITA</span>
            </motion.h1>

            <motion.div
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="h-px bg-gradient-to-r from-transparent via-[#4FC08D] to-transparent w-32" />
              <Zap className="w-6 h-6 text-[#4FC08D]" />
              <div className="h-px bg-gradient-to-r from-transparent via-[#4FC08D] to-transparent w-32" />
            </motion.div>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Explora el universo de herramientas profesionales a través de contenido
              cinematográfico.
              <br className="hidden md:block" />
              Tecnología XGT, demostraciones exclusivas y la innovación que define el futuro.
            </motion.p>
          </motion.div>

          {/* Barra de controles avanzada */}
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Buscar videos, productos o tecnologías..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-slate-800/50 border-slate-600 focus:border-[#4FC08D] text-white placeholder-slate-400 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800/50 rounded-xl p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg ${viewMode === "grid" ? "bg-[#4FC08D] text-black" : "text-slate-300 hover:text-white"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg ${viewMode === "list" ? "bg-[#4FC08D] text-black" : "text-slate-300 hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeatured(!showFeatured)}
                className={`px-4 py-2 rounded-xl border-slate-600 ${showFeatured ? "bg-[#4FC08D]/20 border-[#4FC08D] text-[#4FC08D]" : "text-slate-300 hover:text-white"}`}
              >
                <Star className="w-4 h-4 mr-2" />
                Destacados
              </Button>
            </div>
          </motion.div>

          {/* Filtros de categorías */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transform transition-all duration-300 ${
                  activeFilter === category
                    ? "bg-gradient-to-r from-[#42B883] to-[#4FC08D] text-white shadow-lg shadow-[#4FC08D]/25 scale-105"
                    : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-600 hover:border-slate-500"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid de videos mejorado */}
      <section ref={sectionRef} className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${searchTerm}-${viewMode}`}
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 lg:grid-cols-2"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group relative animate-on-scroll"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => product.youtubeId && openVideoModal(product)}
                >
                  <Card
                    className={`
                    bg-slate-900/60 backdrop-blur-xl border-slate-700/30 hover:border-[#4FC08D]/60 
                    transition-all duration-700 overflow-hidden h-full group-hover:shadow-2xl 
                    group-hover:shadow-[#4FC08D]/20 relative cursor-pointer
                    ${viewMode === "list" ? "flex flex-row" : ""}
                  `}
                  >
                    <div
                      className={`relative overflow-hidden ${viewMode === "list" ? "w-80 flex-shrink-0" : "aspect-video"}`}
                    >
                      {/* Imagen/Video thumbnail */}
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/30 to-transparent" />

                      {/* Badge superior */}
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={`text-xs px-3 py-1.5 rounded-full border font-bold backdrop-blur-sm ${getBadgeColor(product.badge)}`}
                        >
                          {product.badge}
                        </Badge>
                      </div>

                      {/* Rating */}
                      {product.rating && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-white font-semibold">{product.rating}</span>
                        </div>
                      )}

                      {/* Play button para videos */}
                      {product.type === "video" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="bg-gradient-to-r from-[#42B883] to-[#4FC08D] backdrop-blur-sm rounded-full p-6 text-white shadow-2xl shadow-[#4FC08D]/30">
                            <Play className="w-8 h-8 ml-1" fill="currentColor" />
                          </div>
                        </motion.div>
                      )}

                      {/* Metadata de video */}
                      {product.type === "video" && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-xs text-slate-200">
                            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium">{product.duration}</span>
                              </div>
                              <div className="w-px h-3 bg-slate-400/50" />
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{product.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Featured indicator */}
                      {product.featured && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            DESTACADO
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent
                      className={`p-6 space-y-4 relative z-10 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      {/* Header con categoría */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#4FC08D] uppercase tracking-wider bg-[#4FC08D]/15 px-3 py-1.5 rounded-full border border-[#4FC08D]/30">
                          {product.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {product.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Título y subtítulo */}
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl text-white leading-tight group-hover:text-[#4FC08D] transition-colors duration-300">
                          {product.title}
                        </h3>
                        <p className="text-slate-400 text-base font-medium">{product.subtitle}</p>
                      </div>

                      {/* Fecha */}
                      {product.date && (
                        <div className="flex items-center text-slate-500 text-sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          {product.date}
                        </div>
                      )}

                      {/* Descripción */}
                      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                        {product.description}
                      </p>

                      {/* Botones de acción */}
                      <div className="flex items-center justify-between pt-4">
                        {product.type !== "video" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 font-semibold border-[#4FC08D]/50 text-[#4FC08D] hover:bg-[#4FC08D]/10 hover:border-[#42B883] transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle product exploration
                            }}
                          >
                            Explorar
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 flex-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-[#4FC08D]"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle bookmark
                              }}
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-[#4FC08D]"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle share
                              }}
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4FC08D]/8 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* CTAs finales */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mt-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              className="font-bold bg-gradient-to-r from-[#42B883] to-[#4FC08D] hover:from-[#4FC08D] hover:to-[#42B883] text-white border-0 px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl shadow-[#4FC08D]/25 transition-all duration-300 text-lg flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="h-6 w-6" />
              Canal de YouTube
            </motion.button>
            <motion.button
              className="font-bold border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-[#4FC08D] hover:text-[#4FC08D] px-10 py-4 rounded-2xl transition-all duration-300 text-lg flex items-center justify-center gap-3 bg-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Target className="h-6 w-6" />
              Catálogo Completo
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Modal de video */}
      <VideoModal video={selectedVideo} isOpen={isModalOpen} onClose={closeVideoModal} />
    </div>
  );
};

export { Videos };
