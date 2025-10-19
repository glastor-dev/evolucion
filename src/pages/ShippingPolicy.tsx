import React from "react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const ShippingPolicy: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <SEO
        title="Política de Envíos"
        description="Tiempos estimados, cobertura y condiciones de envío."
        url="/politicas/envios"
        type="article"
      />

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Políticas" }, { label: "Envíos" }]} />

      <section className="mt-4 rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold">Política de Envíos</h1>
        <p className="mt-3 text-muted-foreground">
          Realizamos envíos a nivel nacional. El tiempo estimado de entrega puede variar según la ciudad y disponibilidad de stock.
        </p>
        <ul className="mt-4 list-disc pl-6 text-muted-foreground space-y-2">
          <li>Ciudades principales: 24–72 horas.</li>
          <li>Zonas alejadas: 3–5 días hábiles.</li>
          <li>Pedidos con productos en reposición: sujetos a confirmación de fecha.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Para consultas sobre tu envío, escríbenos a <a className="underline" href="mailto:glastor.info@gmail.com">glastor.info@gmail.com</a> indicando tu número de pedido.
        </p>
      </section>
    </main>
  );
};

export default ShippingPolicy;
