import { useState, useEffect, useRef } from "react";
import { ChevronRight, Play, Zap, Shield, Settings, ArrowRight, Star, Award } from "lucide-react";
import demoVideoEs from "../assets/videos/scrolling-video-spanish.mp4";

export const Slider = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [heroImage, setHeroImage] = useState("https://cdn.makitatools.com/apps/wms/home/images/product/maktrak-3-storage.jpg");
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [demoPlaying, setDemoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("ORGANIZACIÓN");
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const sliderRef = useRef<HTMLElement>(null);

  const tabs = ["TRANSPORTE", "ACCESO", "ALMACENAMIENTO", "ORGANIZACIÓN"];

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sliderRef.current) {
      observer.observe(sliderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-rotate products (pausado durante demo)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!demoPlaying) {
        setActiveProduct((prev) => (prev + 1) % maktrakProducts.length);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [demoPlaying]);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "TRANSPORTE":
        return "Eficiente carga y descarga";
      case "ACCESO":
        return "Acceso rápido y fácil";
      case "ALMACENAMIENTO":
        return "Máximo espacio de almacenamiento";
      case "ORGANIZACIÓN":
        return "Personalice su propia configuración";
      default:
        return "Personalice su propia configuración";
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "TRANSPORTE":
        return <ChevronRight className="h-4 w-4" />;
      case "ACCESO":
        return <Zap className="h-4 w-4" />;
      case "ALMACENAMIENTO":
        return <Shield className="h-4 w-4" />;
      case "ORGANIZACIÓN":
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };
  
  const maktrakProducts = [
    {
      id: "maktrak-system",
      title: "MAKTRAK™",
      description: "Espacio para herramientas y accesorios más grandes",
      image: "https://cdn.makitatools.com/apps/wms/home/images/product/maktrak-3-storage.jpg",
      features: ["Modular", "Resistente", "Organizado"],
      rating: 4.9,
      reviews: 1247
    },
    {
      id: "demolition-hammer",
      title: "MARTILLO DE DEMOLICIÓN",
      description: "Para trabajos de demolición pesada",
      image: "https://cdn.makitatools.com/apps/wms/home/images/product/gmh04-1.jpg",
      features: ["Alta potencia", "Ergonómico", "Duradero"],
      rating: 4.8,
      reviews: 892
    },
    {
      id: "industrial-cutter",
      title: "CORTADORA INDUSTRIAL",
      description: "Cortes precisos en materiales diversos",
      image: "https://cdn.makitatools.com/apps/wms/home/images/product/gec03t-1.jpg",
      features: ["Precisión", "Versatil", "Potente"],
      rating: 4.7,
      reviews: 634
    },
    {
      id: "maktrak-video",
      title: "MAKTRAK – Video",
      description: "Presentación en español",
      image: "https://cdn.makitatools.com/apps/wms/home/images/product/maktrak-3-storage.jpg",
      // Video oficial proporcionado
      video: "https://cdn.makitatools.com/apps/wms/products/maktrak/scrolling-video-spanish.mp4",
      features: ["Presentación", "Oficial", "Español"],
      rating: 5.0,
      reviews: 1520
    }
  ];

  const handleProductClick = (index: number) => {
    if (index === activeProduct) return;
    
    setIsTransitioning(true);
    setImageLoaded(false);
    setImageError(false);
    setDemoPlaying(false);
    
    setTimeout(() => {
      setActiveProduct(index);
      setHeroImage(maktrakProducts[index].image);
      // Si el producto tiene video, úsalo en el hero
      setHeroVideo((maktrakProducts as any)[index].video ? (maktrakProducts as any)[index].video : null);
      setIsTransitioning(false);
    }, 300);
  };

  // Función para manejar errores de imagen
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  // Función para manejar carga exitosa de imagen
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Mantener imagen/video sincronizados cuando cambie el producto activo (auto-rotación)
  useEffect(() => {
    if (demoPlaying) return; // no sobrescribir mientras se reproduce demo
    const current: any = maktrakProducts[activeProduct];
    setHeroImage(current.image);
    setHeroVideo(current.video ? current.video : null);
  }, [activeProduct, demoPlaying]);

  // Acción del botón VER DEMO
  const handleDemoClick = () => {
    setIsTransitioning(true);
    setDemoPlaying(true);
    setHeroVideo(demoVideoEs);
    setTimeout(() => setIsTransitioning(false), 200);
  };

  return (
    <section ref={sliderRef} className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:50px_50px] animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image with Smooth Transitions */}
        <div 
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            isTransitioning ? 'scale-110 blur-sm' : 'scale-105 blur-0'
          }`}
        >
          {/* Media principal: video si disponible, si no imagen */}
          {heroVideo ? (
            <video
              src={heroVideo}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="none"
              aria-label={maktrakProducts[activeProduct]?.title || "Producto Makita"}
              onError={() => {
                setHeroVideo(null);
                setImageError(true);
              }}
            />
          ) : (
            !imageError && (
              <img
                src={heroImage}
                alt={maktrakProducts[activeProduct]?.title || "Producto Makita"}
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? 'block' : 'none' }}
              />
            )
          )}
          
          {/* Imagen de respaldo con gradiente */}
          {(imageError || !imageLoaded) && !heroVideo && (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
              {/* Patrón de fondo */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
              </div>
              
              {/* Logo Makita centrado */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white/20 mb-4">MAKITA</div>
                  <div className="text-2xl text-primary font-semibold">{maktrakProducts[activeProduct]?.title}</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Overlays de gradiente */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </div>
        
        {/* Navigation Tabs - Enhanced */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex backdrop-blur-sm bg-black/20 rounded-b-lg">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`group relative px-6 py-4 font-accent font-bold text-sm tracking-wider transition-all duration-500 flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-white hover:bg-white/10 hover:text-primary'
                  } ${index === 0 ? 'rounded-bl-lg' : ''} ${
                    index === tabs.length - 1 ? 'rounded-br-lg' : ''
                  }`}
                >
                  <span className={`transition-transform duration-300 ${
                    activeTab === tab ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {getTabIcon(tab)}
                  </span>
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-foreground rounded-t-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className={`max-w-2xl transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}>
              <div className="mb-8">
                <div className="mb-6 group">
                  <img 
                    src="https://cdn.makitatools.com/apps/wms/home/images/product/maktrak-logo.png" 
                    alt="MAKTRAK Logo" 
                    className="h-16 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  />
                </div>
              </div>
              
              <h1 className={`text-5xl md:text-6xl font-display font-bold mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-primary transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
                {getTabTitle(activeTab)}
              </h1>
              
              <p className={`text-xl text-gray-300 mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
                Descubre la nueva generación de herramientas profesionales diseñadas para maximizar tu productividad.
              </p>

              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
                <button className="group bg-primary text-primary-foreground px-8 py-4 font-accent font-bold hover:bg-primary/90 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2">
                  CONOZCA MÁS
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button onClick={handleDemoClick} className="group bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-4 font-accent font-bold hover:bg-white/20 transition-all duration-300 rounded-lg flex items-center gap-2" aria-label="Reproducir demo en el slider">
                  <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  VER DEMO
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-3">
            {maktrakProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => handleProductClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeProduct === index 
                    ? 'bg-primary scale-125 shadow-lg shadow-primary/50' 
                    : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid - Enhanced */}
      <div className="py-20 bg-gradient-to-b from-gray-900 to-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-700 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {maktrakProducts.map((product, index) => (
              <div
                key={index}
                className="group rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                style={{ animationDelay: `${index * 200}ms` }}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${product.title}`}
                aria-pressed={activeProduct === index}
                onClick={() => handleProductClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleProductClick(index);
                  }
                }}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-500 ${
                    activeProduct === index
                      ? 'ring-2 ring-primary/70 scale-[1.02] shadow-2xl shadow-primary/30'
                      : 'hover:scale-[1.01] hover:shadow-xl hover:shadow-black/30'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {('video' in product && (product as any).video) ? (
                      <video
                        src={(product as any).video}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        aria-label={product.title}
                      />
                    ) : (
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-bold text-white">{product.rating}</span>
                    </div>
                    {activeProduct === index && (
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold animate-pulse">ACTIVO</div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-white/90 font-semibold truncate">{product.title}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {(product.features?.slice(0, 2) || []).map((feature, idx) => (
                            <span key={idx} className="px-2 py-0.5 text-[11px] rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-sm">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-md hover:shadow-primary/25 transition-all group-hover:translate-x-0.5">
                        VER DETALLES
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{product.reviews} reseñas</span>
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action - Enhanced */}
      <div className="py-20 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h3 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
              Descubre la Revolución MAKTRAK
            </h3>
            <p className="text-xl font-body mb-10 opacity-90 text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Únete a miles de profesionales que ya confían en la innovación de Makita pra transformar su trabajo
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group bg-white text-black px-8 py-4 rounded-lg font-accent font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                SOLICITAR INFORMACIÓN
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-lg font-accent font-bold hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                <Play className="h-4 w-4 group-hover:scale-110 transition-transform" />
                VER CATÁLOGO
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};