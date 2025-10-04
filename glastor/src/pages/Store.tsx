import React from "react";
import { ProductCatalog } from "@/components/ProductCatalog";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getSEOConfig } from "@/config/seoConfig";
import { useLocation } from "react-router-dom";

const StorePage: React.FC = () => {
  const location = useLocation();
  const seo = getSEOConfig("catalog");
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

      <section className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Tienda" }]} />
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tienda</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Descubre productos destacados, filtra por categorías y busca lo que necesitas.
          </p>
        </header>

        <ProductCatalog />
      </section>
    </main>
  );
};

export default StorePage;