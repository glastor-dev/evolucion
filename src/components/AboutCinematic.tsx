import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, Users, Shield, Rocket, Heart, Sparkles } from "lucide-react";
import "../styles/about-cinematic.css";

const glastorStats = [
  { label: "Años de Trayectoria", value: "10+", icon: Calendar },
  { label: "Clientes Satisfechos", value: "5000+", icon: Users },
  { label: "Productos Especializados", value: "800+", icon: Shield },
  { label: "Índice de Satisfacción", value: "98%", icon: Award },
];

const glastorValues = [
  { title: "Calidad sin Compromiso", desc: "Productos que cumplen estándares internacionales de rendimiento y durabilidad.", icon: Award },
  { title: "Innovación Constante", desc: "Tecnología y procesos que mejoran la experiencia y eficiencia.", icon: Rocket },
  { title: "Servicio Personalizado", desc: "Soluciones a medida para cada cliente.", icon: Heart },
  { title: "Compromiso Social", desc: "Apoyo a iniciativas sostenibles y sociales.", icon: Sparkles },
];

const glastorTimeline = [
  { year: "2014", title: "Fundación", desc: "Nace Glastor con la misión de democratizar el acceso a herramientas profesionales de calidad mundial." },
  { year: "2017", title: "Expansión Nacional", desc: "Apertura de centros de distribución y red de distribuidores autorizados." },
  { year: "2020", title: "Transformación Digital", desc: "Lanzamiento de plataforma digital y app móvil para profesionales." },
  { year: "2024", title: "Innovación y Futuro", desc: "Integración de IA, sostenibilidad y centro de innovación." },
];

export default function AboutCinematic() {
  return (
    <section className="about-cinematic min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero / Introducción */}
      <div className="container mx-auto py-20 px-4 text-center">
        <motion.h1 initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-[#4FC08D] via-white to-[#42B883] bg-clip-text text-transparent">
          Somos Glastor
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-8">
          El puente entre la tecnología japonesa de vanguardia y los profesionales latinoamericanos que construyen el futuro.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="flex flex-wrap justify-center gap-8 mt-8">
          {glastorStats.map((stat, idx) => (
            <div key={idx} className="glass-card-advanced w-56 h-40 flex flex-col items-center justify-center gap-2 shadow-xl">
              <stat.icon className="w-10 h-10 text-[#4FC08D] mb-2" />
              <div className="text-3xl font-bold text-[#4FC08D]">{stat.value}</div>
              <div className="text-base text-slate-300">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Valores y cultura */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl md:text-5xl font-black mb-10 text-center bg-gradient-to-r from-[#4FC08D] via-white to-[#42B883] bg-clip-text text-transparent">Nuestros Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {glastorValues.map((val, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: idx * 0.2 }} className="glass-card-advanced p-8 flex flex-col items-center text-center shadow-lg">
              <val.icon className="w-10 h-10 text-[#4FC08D] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{val.title}</h3>
              <p className="text-slate-300">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Línea de tiempo horizontal/carrusel */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl md:text-5xl font-black mb-10 text-center bg-gradient-to-r from-[#4FC08D] via-white to-[#42B883] bg-clip-text text-transparent">Nuestra Evolución</h2>
        <div className="flex flex-row overflow-x-auto space-x-8 pb-4 hide-scrollbar">
          {glastorTimeline.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: idx * 0.2 }} className="glass-card-advanced min-w-[300px] max-w-[90vw] flex-shrink-0 p-8 shadow-lg">
              <div className="text-[#4FC08D] font-bold text-lg mb-2">{item.year}</div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonios y equipo (placeholder) */}
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-4xl md:text-5xl font-black mb-10 text-center bg-gradient-to-r from-[#4FC08D] via-white to-[#42B883] bg-clip-text text-transparent">Testimonios y Equipo</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="glass-card-advanced w-80 p-8 text-center shadow-lg">
            <div className="text-lg text-[#4FC08D] font-bold mb-2">Juan Pérez</div>
            <div className="text-slate-300 mb-2">Gerente de Operaciones</div>
            <p className="text-slate-400">“Glastor nos ha permitido crecer y confiar en la calidad de cada herramienta. El servicio es insuperable.”</p>
          </div>
          <div className="glass-card-advanced w-80 p-8 text-center shadow-lg">
            <div className="text-lg text-[#4FC08D] font-bold mb-2">María Gómez</div>
            <div className="text-slate-300 mb-2">Directora Comercial</div>
            <p className="text-slate-400">“La innovación y el trato personalizado de Glastor marcan la diferencia en el sector.”</p>
          </div>
        </div>
      </div>
    </section>
  );
}