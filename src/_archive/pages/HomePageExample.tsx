// Ejemplo de página completa con navegación integrada
import React from 'react';
import { Navbar } from '@/components/Navbar';
import AboutCinematic from '@/components/AboutCinematic';
import { Helmet } from 'react-helmet-async';

const HomePage: React.FC = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Glastor - Distribuidores Profesionales de Herramientas Makita</title>
        <meta 
          name="description" 
          content="Más de 10 años distribuyendo herramientas profesionales Makita. Calidad, innovación y excelencia en el servicio. 5000+ clientes satisfechos."
        />
        <meta name="keywords" content="Glastor, herramientas Makita, distribuidores, profesionales, construcción, carpintería" />
        <meta property="og:title" content="Glastor - Herramientas Profesionales Makita" />
        <meta property="og:description" content="Distribuidor líder de herramientas profesionales Makita con más de 10 años de experiencia." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://glastor.com" />
      </Helmet>

      {/* Navegación con enlace a "Nuestros Números" */}
      <Navbar />

      {/* Sección Hero (opcional) */}
      <section id="hero" className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        {/* Contenido del hero aquí */}
      </section>

      {/* Componente About Cinematográfico */}
      <AboutCinematic />

      {/* Otras secciones */}
      <section id="features" className="py-20">
        {/* Features content */}
      </section>

      <section id="testimonials" className="py-20">
        {/* Testimonials content */}
      </section>

      <section id="servicios" className="py-20">
        {/* Services content */}
      </section>
    </>
  );
};

export default HomePage;