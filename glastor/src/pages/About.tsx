import React from "react";
import { SEO } from "@/components/SEO";
import { Zap, Code, Shield, Globe } from "lucide-react";
import { getSEOConfig } from "@/config/seoConfig";
import { useLocation } from "react-router-dom";

const AboutPage: React.FC = () => {
  const location = useLocation();
  const seo = getSEOConfig("about");
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        image={seo.image}
        type={seo.type || "website"}
        url={location.pathname}
        noIndex={seo.noindex}
      />

      {/* Hero / Encabezado principal */}
      <section className="container mx-auto px-4 py-12">
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Acerca de Glastor</h1>
          <p className="mt-3 text-muted-foreground">
            Glastor® es una marca registrada fundada en 2014, que nació con la visión de impulsar el desarrollo tecnológico y la eficiencia en el ámbito industrial y digital. Tras su consolidación, la empresa emigró a Girona, España, donde continúa expandiendo su alcance a nivel global.
          </p>
        </header>
      </section>

      {/* Sección: Tecnología abierta y enfoque */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-semibold">Tecnología abierta diseñada para el cambio</h2>
            <p className="mt-3 text-muted-foreground">
              Creemos en la adopción de tecnologías abiertas y estándares interoperables para construir soluciones flexibles que evolucionan con las necesidades del negocio. Desde aplicaciones en la nube hasta sistemas locales, en Glastor priorizamos arquitecturas que protegen la inversión y facilitan la integración.
            </p>
            <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Calidad, seguridad y confiabilidad como pilares de cada implementación.</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Presencia y alcance</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              Con base en Girona, España, expandimos operaciones y colaboraciones en mercados internacionales, ofreciendo soporte técnico, consultoría y soluciones a medida.
            </p>
          </div>
        </div>
      </section>

      {/* Sección: Divisiones estratégicas */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold">Divisiones estratégicas</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Hoy, Glastor se distingue por combinar innovación, calidad y experiencia a través de dos divisiones estratégicas que marcan la diferencia en cada proyecto:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* División de Materiales Eléctricos */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-semibold">División de Materiales Eléctricos</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              Con más de una década de experiencia, proveemos soluciones eléctricas de alto rendimiento para instalaciones residenciales, comerciales e industriales. Nuestra oferta abarca desde cables, tableros y sistemas de automatización, hasta componentes de control avanzado.
            </p>
            <p className="mt-2 text-muted-foreground">
              Nos mueve un compromiso sólido con la seguridad, eficiencia y confiabilidad, garantizando entregas puntuales y un acompañamiento técnico de excelencia.
            </p>
          </div>

          {/* División de Programación */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <Code className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold">División de Programación</h3>
            </div>
            <p className="mt-3 text-muted-foreground">
              La transformación digital es parte de nuestro ADN. Nuestro equipo de desarrolladores diseña software a medida, creando aplicaciones web, móviles y sistemas empresariales que optimizan procesos y potencian la competitividad de nuestros clientes.
            </p>
            <p className="mt-2 text-muted-foreground">
              Integramos tecnología de vanguardia con un enfoque humano, ofreciendo experiencias digitales que impulsan el crecimiento sostenible en un mundo conectado.
            </p>
          </div>
        </div>
      </section>

      {/* Sección: Misión y visión */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold">Nuestra misión</h3>
            <p className="mt-2 text-muted-foreground">
              Impulsar el desarrollo tecnológico y la eficiencia a través de soluciones confiables, escalables y accesibles, integrando buenas prácticas, rendimiento y una experiencia de usuario cuidada.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Nuestra visión</h3>
            <p className="mt-2 text-muted-foreground">
              Ser un referente en soluciones industriales y digitales, optimizando cada detalle para ofrecer productos y experiencias superiores con impacto sostenible.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;