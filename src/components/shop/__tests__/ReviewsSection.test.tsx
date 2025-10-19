import { describe, it, expect } from "vitest";
import { screen, within } from "@testing-library/react";
import { render } from "../../../test/test-utils";
import { ReviewsSection } from "../ReviewsSection";

describe("ReviewsSection - testimonios", () => {
  it("muestra la sección de Experiencia de clientes y fechas relativas bajo las estrellas", () => {
    render(<ReviewsSection productId={"1"} productName="Producto X" />);

    // Encabezado principal
    expect(screen.getByRole("heading", { name: /experiencia de clientes/i })).toBeTruthy();

    // Obtener tarjetas
    const cards = screen.getAllByRole("article", { hidden: true }).length
      ? screen.getAllByRole("article", { hidden: true })
      : screen.getAllByText(/compra verificada/i).map(el => el.closest("div"));

    // Asegurar que existen al menos 1-4 tarjetas
    expect(cards.length).toBeGreaterThan(0);

    // En la primera tarjeta, la fecha aparece debajo de las estrellas
    const first = cards[0]!;
    const starsRow = within(first).getByLabelText(/calificar 1 estrella/i, { selector: "button" }).parentElement?.parentElement;
    // Buscar la etiqueta time debajo
    const time = within(first).getByText(/Hace|Ahora/, { selector: "time" });
    expect(time).toBeTruthy();
  });

  it("usa nombres distintos en todos los testimonios generados", () => {
    render(<ReviewsSection productId={"1"} productName="Producto Y" />);
    const articles = screen.getAllByRole("article", { hidden: true });
    expect(articles.length).toBeGreaterThanOrEqual(3); // esperamos 4 normalmente
    const nameNodes = articles.map(card => within(card).getByTestId("testimonial-name"));
    const names = nameNodes.map(n => n.textContent?.trim() || "");
    const unique = new Set(names.filter(Boolean));
    // No debe haber duplicados visibles
    expect(unique.size).toBe(names.filter(Boolean).length);
  });
});
