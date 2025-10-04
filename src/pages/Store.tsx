import React from "react";
import { DynamicProductGrid } from "@/components/DynamicProductGrid";
import { SEO } from "@/components/SEO";

const StorePage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Tienda | Glastor"
        description="Explora nuestro catálogo de productos y encuentra las mejores herramientas y equipos."
        keywords="tienda, productos, catálogo, herramientas, glastor"
        type="website"
      />

      <section className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Tienda</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Descubre productos destacados, filtra por categorías y busca lo que necesitas.
          </p>
        </header>

        <DynamicProductGrid pageSize={12} />
      </section>
    </main>
  );
};

export default StorePage;