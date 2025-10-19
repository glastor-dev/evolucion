import React from "react";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const WarrantyPolicy: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <SEO
        title="Política de Garantías"
        description="Conoce el alcance de la garantía oficial del fabricante y las condiciones aplicables."
        url="/politicas/garantias"
        type="article"
      />

      <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Políticas" }, { label: "Garantías" }]} />

      <section className="mt-4 rounded-lg border bg-card p-6">
        <h1 className="text-2xl font-bold">Política de Garantías</h1>
        <p className="mt-3 text-muted-foreground">
          La garantía aplica para defectos de fabricación por el período indicado en la ficha de cada producto.
          No cubre desgaste normal, mal uso, daño por golpes, humedad o instalación incorrecta.
        </p>
        <ul className="mt-4 list-disc pl-6 text-muted-foreground space-y-2">
          <li>Presentar factura o comprobante de compra.</li>
          <li>Producto completo, sin modificaciones y con número de serie legible.</li>
          <li>Evaluación técnica previa por parte del servicio autorizado.</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Para gestionar una garantía, contáctanos en <a className="underline" href="mailto:glastor.info@gmail.com">glastor.info@gmail.com</a> indicando tu número de pedido y una breve descripción del caso.
        </p>
      </section>
    </main>
  );
};

export default WarrantyPolicy;
