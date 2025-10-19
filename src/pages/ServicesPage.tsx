import React from 'react';
import ServicesSection from '../components/ServicesSection_Cinematic';
import { SEO } from '../components/SEO';

const ServicesPage: React.FC = () => {
  return (
    <>
      <SEO
        title="Nuestros Servicios | Glastor"
        description="Descubre nuestros servicios profesionales de desarrollo web, diseño y soluciones tecnológicas."
        keywords="servicios, desarrollo web, diseño, tecnología"
      />
      <div className="min-h-screen">
        <ServicesSection />
      </div>
    </>
  );
};

export default ServicesPage;
