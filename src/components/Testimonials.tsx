import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Pause, Play, Quote, Star, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/cinema-system.css";

interface TestimonialProps {
  image: string;
  name: string;
  company: string;
  role: string;
  comment: string;
  rating: number;
  service: "desarrollo" | "ecommerce";
}

const testimonials: TestimonialProps[] = [
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos&backgroundColor=b6e3f4",
    name: "Carlos Mendoza",
    company: "TechStart Barcelona",
    role: "CTO",
    comment:
      "Glastor desarrolló nuestra plataforma e-commerce completa en tiempo récord. Su expertise en Python y Django nos permitió lanzar al mercado 3 meses antes de lo previsto.",
    rating: 5,
    service: "desarrollo",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=maria&backgroundColor=c084fc",
    name: "María García",
    company: "Construcciones García SL",
    role: "Gerente",
    comment:
      "Llevamos 2 años comprando herramientas Makita y Bosch a través de Glastor. Precios competitivos, entrega rápida y asesoramiento profesional.",
    rating: 5,
    service: "ecommerce",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=jordi&backgroundColor=fbbf24",
    name: "Jordi Puig",
    company: "Innovatech Solutions",
    role: "Director de Proyectos",
    comment:
      "El equipo de Glastor migró nuestra aplicación legacy a una arquitectura moderna con microservicios. Su conocimiento técnico fue clave para el éxito.",
    rating: 5,
    service: "desarrollo",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=ana&backgroundColor=fb7185",
    name: "Ana Rodríguez",
    company: "Carpintería Moderna",
    role: "Propietaria",
    comment:
      "Excelente servicio de distribución. Las herramientas Bosch llegaron al día siguiente. El equipo me asesoró perfectamente sobre qué modelos necesitaba.",
    rating: 5,
    service: "ecommerce",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=david&backgroundColor=34d399",
    name: "David López",
    company: "StartupHub Girona",
    role: "CEO",
    comment:
      "Glastor desarrolló nuestra MVP en tiempo récord. Su enfoque en Python y tecnologías modernas nos dio la escalabilidad que necesitábamos.",
    rating: 5,
    service: "desarrollo",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=laura&backgroundColor=a78bfa",
    name: "Laura Martín",
    company: "Reformas Integrales LM",
    role: "Directora Comercial",
    comment:
      "La relación calidad-precio de las herramientas Makita que distribuye Glastor es insuperable. Su servicio postventa nos da total tranquilidad.",
    rating: 5,
    service: "ecommerce",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=roberto&backgroundColor=60a5fa",
    name: "Roberto Silva",
    company: "Arquitectura Moderna",
    role: "Arquitecto Senior",
    comment:
      "La plataforma que desarrolló Glastor para gestionar nuestros proyectos arquitectónicos ha revolucionado nuestro flujo de trabajo.",
    rating: 5,
    service: "desarrollo",
  },
  {
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=carmen&backgroundColor=f472b6",
    name: "Carmen Vega",
    company: "Construcciones Vega",
    role: "Directora",
    comment:
      "Las herramientas Makita que compramos a través de Glastor han mejorado significativamente la productividad de nuestros equipos.",
    rating: 5,
    service: "ecommerce",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: TestimonialProps }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl min-w-[350px] mx-4">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-vue-primary/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Quote icon */}
      <div className="absolute top-2 left-2 w-8 h-8 bg-vue-primary rounded-full flex items-center justify-center shadow-lg">
        <Quote className="w-4 h-4 text-white" />
      </div>

      <div className="relative z-10">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4 mt-6">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Comment */}
        <p className="text-gray-300 mb-6 leading-relaxed text-sm">"{testimonial.comment}"</p>

        {/* User info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 ring-2 ring-vue-primary/20">
            <AvatarImage src={testimonial.image} alt={testimonial.name} />
            <AvatarFallback className="bg-vue-primary/20 text-vue-primary">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h4 className="font-semibold text-white">{testimonial.name}</h4>
            <p className="text-gray-400 text-sm">{testimonial.role}</p>
            <p className="text-gray-500 text-xs">{testimonial.company}</p>
          </div>

          <Badge
            variant="outline"
            className={`text-xs ${
              testimonial.service === "desarrollo"
                ? "border-blue-500/50 text-blue-400"
                : "border-green-500/50 text-green-400"
            }`}
          >
            {testimonial.service === "desarrollo" ? "Desarrollo" : "E-commerce"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export const Testimonials = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  // Duplicamos los testimonios para crear el efecto infinito
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    if (!isPlaying) return;

    const animate = () => {
      setCurrentTranslate((prev) => {
        const cardWidth = 382; // 350px + 32px margin
        const maxTranslate = testimonials.length * cardWidth;

        if (prev >= maxTranslate) {
          return 0;
        }
        return prev + 0.5; // Velocidad del slider
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, testimonials.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-vue-primary/10 border border-vue-primary/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-vue-primary" />
            <span className="text-vue-primary font-medium">Loved by Developers</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Lo Que Dicen Nuestros
            <br />
            <span className="bg-gradient-to-r from-vue-primary to-vue-secondary bg-clip-text text-transparent">
              Clientes
            </span>
          </h2>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Glastor es popular entre desarrolladores y empresas de todo el mundo.
            <br className="hidden md:block" />
            Descubre por qué confían en nosotros para sus proyectos más importantes.
          </p>
        </div>

        {/* Infinite Slider */}
        <div className="relative mb-16">
          {/* Play/Pause Control */}
          <div className="flex justify-center mb-8">
            <button
              onClick={togglePlayPause}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 transition-all duration-300 text-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm font-medium">Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm font-medium">Reproducir</span>
                </>
              )}
            </button>
          </div>

          {/* Slider Container */}
          <div className="relative overflow-hidden">
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <div
              ref={sliderRef}
              className="flex transition-none"
              style={{
                transform: `translateX(-${currentTranslate}px)`,
                width: `${duplicatedTestimonials.length * 382}px`,
              }}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.name}-${testimonial.company}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </div>
     </div>
    </section>
  );
};
