// Ejemplo de integración del AboutCinematic en una página
import React from 'react';
import AboutCinematic from '@/components/AboutCinematic';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <>
      {/* SEO optimizado para la página About */}
      <Helmet>
        <title>Acerca de Glastor - Distribuidores Profesionales de Herramientas Makita</title>
        <meta 
          name="description" 
          content="Conoce la historia de Glastor, más de 10 años distribuyendo herramientas profesionales Makita. Calidad, innovación y excelencia en el servicio desde 2014."
        />
        <meta name="keywords" content="Glastor, historia, herramientas Makita, distribuidores, profesionales, calidad" />
        <meta property="og:title" content="Acerca de Glastor - Nuestra Historia" />
        <meta property="og:description" content="Descubre cómo Glastor se convirtió en el distribuidor líder de herramientas profesionales Makita en la región." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://glastor.com/acerca-de" />
      </Helmet>

      {/* Componente About Cinematográfico */}
      <AboutCinematic />
    </>
  );
};

export default AboutPage;