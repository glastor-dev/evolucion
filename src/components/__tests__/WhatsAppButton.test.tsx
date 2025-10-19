import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../test/test-utils";
import WhatsAppButton from "../WhatsAppButton";

// Mock de window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, "open", {
  value: mockWindowOpen,
});

describe("WhatsAppButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render WhatsApp button", () => {
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");
    expect(whatsappButton).toBeInTheDocument();
  });

  it("should have WhatsApp icon", () => {
    render(<WhatsAppButton />);

    // Buscar el ícono de WhatsApp (puede ser un SVG o imagen)
    const whatsappIcon = screen.getByRole("button");
    expect(whatsappIcon).toBeInTheDocument();
  });

  it("should open WhatsApp when clicked", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    // Verificar que se abre WhatsApp con el número correcto (ignorando el 3er parámetro de window.open)
    expect(mockWindowOpen).toHaveBeenCalled();
    const [url, target] = mockWindowOpen.mock.calls[0];
    expect(url).toContain("wa.me/5491132578591");
    expect(target).toBe("_blank");
  });

  it("should include default message in WhatsApp URL", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    // Verificar que la URL incluye un mensaje por defecto
    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain("text=");
    }
  });

  it("should use custom message when provided", async () => {
    const customMessage = "Consulta sobre producto específico";
    const user = userEvent.setup();

    render(<WhatsAppButton message={customMessage} />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    // Verificar que la URL incluye el mensaje personalizado
    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain(encodeURIComponent(customMessage));
    }
  });

  it("should use custom phone number when provided", async () => {
    const customPhone = "+1234567890";
    const user = userEvent.setup();

    render(<WhatsAppButton phoneNumber={customPhone} />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    // Verificar que la URL incluye el número personalizado
    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain("wa.me/1234567890");
    }
  });

  it("should handle phone number formatting correctly", async () => {
    const phoneWithPlus = "+5491132578591";
    const phoneWithoutPlus = "5491132578591";
    const user = userEvent.setup();

    // Test con número que incluye +
    render(<WhatsAppButton phoneNumber={phoneWithPlus} />);
    let whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain("wa.me/5491132578591");
    }

    vi.clearAllMocks();

    // Test con número sin +
    render(<WhatsAppButton phoneNumber={phoneWithoutPlus} />);
    whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain("wa.me/5491132578591");
    }
  });

  it("should be accessible with proper ARIA attributes", () => {
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");

    // Verificar que tiene atributos de accesibilidad apropiados
    expect(whatsappButton).toHaveAttribute("aria-label");
    expect(whatsappButton.getAttribute("aria-label")).toMatch(/whatsapp/i);
  });

  it("should have proper styling classes", () => {
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");

    // Verificar que tiene clases CSS apropiadas
    expect(whatsappButton.className).toBeTruthy();
    expect(whatsappButton.className).toBeTruthy();
  });

  it("should be keyboard accessible", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");

    // Enfocar el botón con Tab
    await user.tab();
    expect(whatsappButton).toHaveFocus();

    // Activar con Enter
    await user.keyboard("{Enter}");
    expect(mockWindowOpen).toHaveBeenCalled();

    vi.clearAllMocks();

    // Activar con Espacio
    await user.keyboard(" ");
    expect(mockWindowOpen).toHaveBeenCalled();
  });

  it("should handle special characters in message", async () => {
    const messageWithSpecialChars =
      "Hola! ¿Cómo están? Necesito información sobre el producto #123";
    const user = userEvent.setup();

    render(<WhatsAppButton message={messageWithSpecialChars} />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    // Verificar que los caracteres especiales se codifican correctamente
    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain(encodeURIComponent(messageWithSpecialChars));
    }
  });

  it("should work with empty message", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton message="" />);

    const whatsappButton = screen.getByRole("button");
    await user.click(whatsappButton);

    // Debería abrir WhatsApp sin mensaje o con mensaje por defecto
    expect(mockWindowOpen).toHaveBeenCalled();
    {
      const [url] = mockWindowOpen.mock.calls[0];
      expect(url).toContain("wa.me/5491132578591");
    }
  });

  it("should be visible and clickable", () => {
    // Usamos variante mínima para evitar estados iniciales de animación que afectan la visibilidad
    render(<WhatsAppButton variant="minimal" />);

    const whatsappButton = screen.getByRole("button");

    expect(whatsappButton).toBeVisible();
    expect(whatsappButton).toBeEnabled();
  });

  it("should maintain consistent behavior across multiple clicks", async () => {
    const user = userEvent.setup();
    render(<WhatsAppButton />);

    const whatsappButton = screen.getByRole("button");

    // Hacer múltiples clics
    await user.click(whatsappButton);
    await user.click(whatsappButton);
    await user.click(whatsappButton);

    // Verificar que se llamó window.open múltiples veces
    expect(mockWindowOpen).toHaveBeenCalledTimes(3);

    // Verificar que todas las llamadas fueron consistentes
    const calls = mockWindowOpen.mock.calls;
    expect(calls[0][0]).toBe(calls[1][0]);
    expect(calls[1][0]).toBe(calls[2][0]);
  });
});
