import React from "react";

const ServicesSection_Debug: React.FC = () => {
  return (
    <section id="servicios" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Servicios - Versión Debug</h2>
          <p className="text-slate-300">
            Esta es una versión simplificada para verificar que funciona.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">Desarrollo Web</h3>
            <p className="text-slate-300">Aplicaciones web modernas y responsivas.</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">Inteligencia Artificial</h3>
            <p className="text-slate-300">Soluciones de IA personalizadas.</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-2">E-commerce</h3>
            <p className="text-slate-300">Tiendas online optimizadas.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection_Debug;
