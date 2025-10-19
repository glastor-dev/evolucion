import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Play, Star } from "lucide-react";
import "./hero-animations.css";

interface StoryBeat {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metric: { value: string; label: string };
  cta: string;
}

interface FeaturedProduct {
  id: string;
  name: string;
  tagline: string;
  image: string;
  video: string;
  features: string[];
  price: string;
}

export const Slider = () => {
  // Simplified state management for cinematic hero
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentStory, setCurrentStory] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  // Story-driven content
  const storyBeats: StoryBeat[] = useMemo(
    () => [
      {
        id: "innovation",
        title: "INNOVACIÓN",
        subtitle: "QUE TRANSFORMA",
        description: "Descubre herramientas que revolucionan la industria",
        metric: { value: "50+", label: "Años de experiencia" },
        cta: "Conoce la historia",
      },
      {
        id: "precision",
        title: "PRECISIÓN",
        subtitle: "SIN LÍMITES",
        description: "Tecnología japonesa para resultados perfectos",
        metric: { value: "99.9%", label: "Precisión garantizada" },
        cta: "Ver tecnología",
      },
      {
        id: "power",
        title: "POTENCIA",
        subtitle: "PROFESIONAL",
        description: "Herramientas diseñadas para los más exigentes",
        metric: { value: "2M+", label: "Profesionales confían en nosotros" },
        cta: "Explorar productos",
      },
    ],
    []
  );

  // Featured products for showcase
  const featuredProducts: FeaturedProduct[] = useMemo(
    () => [
      {
        id: "maktrak-system",
        name: "MAKTRAK™",
        tagline: "Sistema modular revolucionario",
        image: "https://cdn.makitatools.com/apps/wms/home/images/product/maktrak-3-storage.jpg",
  video: "https://www.makita.es/data/pam/public/News-Pages/Maktrak/video_corto.mp4", // Video Makita proporcionado por el usuario
        features: ["Modular", "Resistente", "Inteligente"],
        price: "Desde $299",
      },
    ],
    []
  );

  // Cinematic effects
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Story progression
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % storyBeats.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isVisible, storyBeats.length]);

  // Parallax scroll effect (future use)
  useEffect(() => {
    const handleScroll = () => {
      // Future parallax implementation
      const scrollPosition = window.scrollY;
      console.log("Scroll position:", scrollPosition);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
        >
          <source src={featuredProducts[0].video} type="video/mp4" />
        </video>
        {/* Cinematic overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center space-y-8">
            {/* Cinematic Brand Logo */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <img
                src="https://cdn.makitatools.com/apps/wms/home/images/product/maktrak-logo.png"
                alt="MAKTRAK Logo"
                className="h-16 sm:h-20 lg:h-24 w-auto mx-auto drop-shadow-2xl"
              />
            </div>

            {/* Story-driven Headlines */}
            <div
              className={`space-y-4 transition-all duration-1000 delay-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black leading-tight">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white">
                  {storyBeats[currentStory].title}
                </span>
                <span className="block text-white/90 text-3xl sm:text-4xl lg:text-6xl font-light">
                  {storyBeats[currentStory].subtitle}
                </span>
              </h1>

              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                {storyBeats[currentStory].description}
              </p>
            </div>

            {/* Animated Metrics */}
            <div
              className={`transition-all duration-1000 delay-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <div className="inline-flex items-center gap-8 bg-white/5 backdrop-blur-xl rounded-2xl px-8 py-6 border border-white/10">
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-primary">
                    {storyBeats[currentStory].metric.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {storyBeats[currentStory].metric.label}
                  </div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-black text-white">4.9</div>
                  <div className="text-sm text-gray-400 font-medium flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    Rating
                  </div>
                </div>
              </div>
            </div>

            {/* Cinematic CTA */}
            <div
              className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-900 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <button className="group relative overflow-hidden bg-primary text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-primary/30 hover:shadow-primary/50">
                <span className="relative z-10 flex items-center gap-3">
                  {storyBeats[currentStory].cta}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="group flex items-center gap-3 text-white hover:text-primary transition-colors duration-300">
                <div className="w-16 h-16 rounded-full border-2 border-white/30 group-hover:border-primary flex items-center justify-center transition-colors duration-300">
                  <Play className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-semibold">Ver demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
          {storyBeats.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStory(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentStory === index
                  ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
          <div className="ml-4 text-xs text-white/60 font-mono">
            {String(currentStory + 1).padStart(2, "0")}/{String(storyBeats.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-30">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs font-medium rotate-90 origin-center">SCROLL</span>
          <div className="w-px h-8 bg-white/30 animate-pulse"></div>
        </div>
      </div>

      {/* Product Showcase Section */}
      <div className="py-32 bg-gradient-to-b from-transparent to-black/50 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Productos <span className="text-primary">Destacados</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre nuestra línea premium de herramientas profesionales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`group cursor-pointer transition-all duration-700 delay-${index * 200} ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <div className="relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-gray-400 mb-4">{product.tagline}</p>
                    <div className="flex justify-center gap-2 mb-4">
                      {product.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-4">{product.price}</div>
                    <button className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-300">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
