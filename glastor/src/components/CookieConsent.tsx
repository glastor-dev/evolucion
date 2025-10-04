import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Comprobar si el usuario ya ha dado su consentimiento
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      // Mostrar el aviso después de un breve retraso para mejorar UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'all');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookieConsent', 'necessary');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setIsVisible(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
      <div className="max-w-7xl mx-auto bg-background rounded-lg shadow-lg border border-border/40 overflow-hidden">
        <div className="relative p-6">
          {/* Botón de cierre */}
          <button 
            onClick={handleRejectAll} 
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar aviso de cookies"
          >
            <X size={20} />
          </button>

          {/* Encabezado */}
          <div className="mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <span className="bg-gradient-to-r from-primary/80 to-primary text-transparent bg-clip-text">
                Aviso de Cookies
              </span>
            </h2>
          </div>

          {/* Contenido principal */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Utilizamos cookies propias y de terceros para mejorar nuestros servicios, elaborar información estadística y analizar sus hábitos de navegación. Esto nos permite personalizar el contenido que ofrecemos y mostrarle publicidad relacionada con sus preferencias.
            </p>

            {/* Detalles expandibles */}
            <div>
              <button 
                onClick={toggleDetails}
                className="text-sm text-primary hover:underline focus:outline-none"
              >
                {showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}
              </button>

              {showDetails && (
                <div className="mt-4 p-4 bg-muted/30 rounded-md text-sm space-y-3">
                  <div>
                    <h3 className="font-medium mb-1">Cookies técnicas (necesarias)</h3>
                    <p className="text-muted-foreground text-xs">
                      Son esenciales para que pueda navegar por el sitio web y utilizar sus funciones, como acceder a áreas seguras.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Cookies analíticas</h3>
                    <p className="text-muted-foreground text-xs">
                      Nos permiten reconocer y contar el número de visitantes y ver cómo se mueven por nuestro sitio web.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Cookies de marketing</h3>
                    <p className="text-muted-foreground text-xs">
                      Se utilizan para rastrear a los visitantes en los sitios web y mostrar anuncios relevantes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={handleRejectAll}
              className="sm:order-1"
            >
              Rechazar todo
            </Button>
            <Button 
              variant="outline" 
              onClick={handleAcceptNecessary}
              className="sm:order-2"
            >
              Solo necesarias
            </Button>
            <Button 
              onClick={handleAcceptAll}
              className="sm:order-3 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90"
            >
              Aceptar todo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};