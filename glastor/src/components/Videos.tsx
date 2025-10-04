import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, Eye, Clock, Calendar } from 'lucide-react';

const PlayIcon = () => (
  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const Videos: React.FC = () => {
   const sectionRef = useRef<HTMLDivElement>(null);

  const featuredProducts = [
    {
      id: 1,
      title: "Pistola de Calor Inalámbrica HG001G",
      subtitle: "Makita XGT Series",
      date: "Nuevo Producto",
      duration: "2:29 min",
      views: "45K",
      type: "video",
      category: "MAKITA",
      badge: "NUEVO",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop&crop=center",
      description: "Descubre la nueva pistola de calor inalámbrica con tecnología XGT de 40V para trabajos profesionales",
      youtubeId: "UUT81Brz1gU"
    },
    {
      id: 2,
      title: "Amoladora Inalámbrica GD001G/GD002G",
      subtitle: "Makita Cordless Die Grinder",
      duration: "1:45 min",
      views: "32K",
      type: "video",
      category: "MAKITA",
      badge: "DESTACADO",
      thumbnail: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=450&fit=crop&crop=center",
      description: "Amoladoras inalámbricas de precisión para trabajos detallados y acabados profesionales",
      youtubeId: "_S1nzGSWFe8"
    },
    {
      id: 3,
      title: "Serie XGT 40V - Tecnología Avanzada",
      subtitle: "Makita Li-ion 40V max XGT",
      duration: "6:07 min",
      views: "128K",
      type: "video",
      category: "MAKITA",
      badge: "TECNOLOGÍA",
      thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=450&fit=crop&crop=center",
      description: "Conoce el mecanismo y la tecnología detrás de la revolucionaria serie XGT de 40V máximo",
      youtubeId: "iRyrOcGuWZk"
    },
    {
      id: 4,
      title: "Llave de Impacto Inalámbrica TW010G",
      subtitle: "Makita Cordless Impact Wrench",
      duration: "2:46 min",
      views: "67K",
      type: "video",
      category: "MAKITA",
      badge: "POTENCIA",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop&crop=center",
      description: "Llave de impacto inalámbrica de alta potencia para trabajos industriales y automotrices",
      youtubeId: "UpvvGoLv7KM"
    },
    {
      id: 5,
      title: "Soluciones Automotrices Makita",
      subtitle: "Herramientas Especializadas para Talleres",
      duration: "Explorar",
      views: "45K",
      type: "product",
      category: "AUTOMOTRIZ",
      badge: "ESPECIALIZADO",
      thumbnail: "https://cdn.makitatools.com/apps/wms/Home/images/explore/solutions/automotive.jpg",
      description: "Equipamiento profesional diseñado específicamente para la industria automotriz. Herramientas de precisión para diagnóstico, reparación y mantenimiento vehicular."
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
      description: "Sistemas avanzados de limpieza y mantenimiento para espacios comerciales e industriales. Eficiencia y durabilidad garantizada."
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
      thumbnail: "https://cdn.makitatools.com/apps/wms/Home/images/explore/solutions/dust-solutions.jpg",
      description: "Soluciones inteligentes para el control y extracción de polvo. Protege tu salud y mantén un ambiente de trabajo limpio y seguro."
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
      description: "Maquinaria robusta y especializada para trabajos forestales. Motosierras, desbrozadoras y equipos diseñados para el manejo sostenible del bosque."
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getBadgeColor = (badge: string) => {
    const colors = {
      'NUEVO': 'bg-green-500/20 text-green-400 border-green-500/30',
      'DESTACADO': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'POPULAR': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'TRENDING': 'bg-red-500/20 text-red-400 border-red-500/30',
      'INNOVACIÓN': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'PROFESIONAL': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'SMART': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'POTENTE': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'TECNOLOGÍA': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'POTENCIA': 'bg-red-600/20 text-red-400 border-red-600/30',
      'ESPECIALIZADO': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'EXTRACCIÓN': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      'FORESTAL': 'bg-green-600/20 text-green-400 border-green-600/30'
    };
    return colors[badge as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };







  return (
    <div className="min-h-screen bg-black relative overflow-hidden">

      <section ref={sectionRef} className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#4FC08D] via-[#42B883] to-[#4FC08D] bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              HERRAMIENTAS MAKITA
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Descubre la tecnología XGT de 40V y las herramientas inalámbricas más avanzadas de Makita. Videos demostrativos de productos profesionales
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card 
                  className={`bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-[#4FC08D]/50 transition-all duration-500 overflow-hidden h-full group-hover:shadow-2xl group-hover:shadow-[#4FC08D]/20 relative`}
                >
                  <div className="relative overflow-hidden aspect-video">
                    {product.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${product.youtubeId}?controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&playsinline=1`}
                        title={product.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    ) : (
                      <>
                        <img 
                          src={product.thumbnail} 
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
                        
                        <div className="absolute top-4 left-4">
                          <Badge 
                            className={`text-xs px-3 py-1 rounded-full border font-semibold ${getBadgeColor(product.badge)}`}
                          >
                            {product.badge}
                          </Badge>
                        </div>

                        {product.type === 'video' && (
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ scale: 1.1 }}
                          >
                            <div className="bg-[#42B883]/90 backdrop-blur-sm rounded-full p-4 text-white shadow-2xl">
                              <PlayIcon />
                            </div>
                          </motion.div>
                        )}

                        {product.type === 'video' && (
                          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                            <div className="flex items-center space-x-3 text-xs text-slate-300">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{product.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{product.views}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <CardContent className="p-6 space-y-4 relative z-10">
                    {/* Header con categoría y metadata */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#4FC08D]/80 uppercase tracking-wider bg-[#4FC08D]/10 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      {product.youtubeId && (
                        <div className="flex items-center gap-2 text-xs text-slate-400/80">
                          <Play className="h-3 w-3" />
                          <span className="font-medium">{product.duration}</span>
                          <span className="text-slate-400/50">•</span>
                          <span>{product.views}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Título principal */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white leading-tight group-hover:text-[#4FC08D] transition-colors duration-300 line-clamp-2">
                        {product.title}
                      </h3>
                      
                      <p className="text-slate-400/90 text-sm font-medium">
                        {product.subtitle}
                      </p>
                    </div>
                    
                    {/* Fecha */}
                    {product.date && (
                      <div className="flex items-center text-slate-500/70 text-xs font-medium">
                        <Calendar className="w-3 h-3 mr-1" />
                        {product.date}
                      </div>
                    )}
                    
                    {/* Descripción */}
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6">
                      {product.description}
                    </p>

                    {product.type === 'product' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full font-semibold border-[#4FC08D]/50 !text-[#4FC08D] hover:!text-[#4FC08D] focus:!text-[#4FC08D] hover:bg-[#4FC08D]/10 hover:border-[#42B883] transition-all duration-300 group relative z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Explorar
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    )}


                  </CardContent>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4FC08D]/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                  </div>

                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button 
              size="lg"
              className="font-semibold bg-gradient-to-r from-[#42B883] to-[#4FC08D] hover:from-[#4FC08D] hover:to-[#42B883] text-white border-0 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Ver Todos los Videos
              <Play className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="font-semibold border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 px-8 py-4 rounded-xl transition-all duration-300"
            >
              Explorar Productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { Videos };
