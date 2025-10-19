import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { X, Cookie, Shield, BarChart3, Target, Settings, ChevronDown, ChevronUp, Info, CheckCircle2 } from "lucide-react";

// Tipos de cookies y sus configuraciones
interface CookieCategory {
  id: string;
  name: string;
  description: string;
  essential: boolean;
  enabled: boolean;
  icon: typeof Shield;
  examples: string[];
}

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Configuraciones de cookies por categoría
  const [cookieCategories, setCookieCategories] = useState<CookieCategory[]>([
    {
      id: "necessary",
      name: "Cookies Necesarias",
      description: "Esenciales para el funcionamiento del sitio web. No se pueden desactivar.",
      essential: true,
      enabled: true,
      icon: Shield,
      examples: ["Sesión de usuario", "Preferencias de idioma", "Carrito de compras"]
    },
    {
      id: "analytics",
      name: "Cookies Analíticas",
      description: "Nos ayudan a entender cómo interactúas con nuestro sitio web.",
      essential: false,
      enabled: false,
      icon: BarChart3,
      examples: ["Google Analytics", "Métricas de rendimiento", "Análisis de comportamiento"]
    },
    {
      id: "marketing",
      name: "Cookies de Marketing",
      description: "Utilizadas para mostrar publicidad relevante y personalizada.",
      essential: false,
      enabled: false,
      icon: Target,
      examples: ["Publicidad personalizada", "Remarketing", "Seguimiento de conversiones"]
    },
    {
      id: "functional",
      name: "Cookies Funcionales",
      description: "Mejoran la funcionalidad y personalización del sitio.",
      essential: false,
      enabled: false,
      icon: Settings,
      examples: ["Preferencias de usuario", "Chat en vivo", "Reproducción de videos"]
    }
  ]);

  useEffect(() => {
    // Comprobar si el usuario ya ha dado su consentimiento
    const hasConsent = localStorage.getItem("cookieConsent");
    const consentData = localStorage.getItem("cookieConsentData");
    
    if (!hasConsent) {
      // Mostrar el aviso después de un breve retraso para mejorar UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (consentData) {
      // Cargar las preferencias guardadas
      try {
        const savedPreferences = JSON.parse(consentData);
        setCookieCategories(prev => 
          prev.map(category => ({
            ...category,
            enabled: category.essential || savedPreferences[category.id] || false
          }))
        );
      } catch (error) {
        console.error("Error loading cookie preferences:", error);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled = cookieCategories.reduce((acc, category) => {
      acc[category.id] = true;
      return acc;
    }, {} as Record<string, boolean>);

    localStorage.setItem("cookieConsent", "all");
    localStorage.setItem("cookieConsentData", JSON.stringify(allEnabled));
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    
    setCookieCategories(prev => prev.map(cat => ({ ...cat, enabled: true })));
    closeConsent();
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly = cookieCategories.reduce((acc, category) => {
      acc[category.id] = category.essential;
      return acc;
    }, {} as Record<string, boolean>);

    localStorage.setItem("cookieConsent", "necessary");
    localStorage.setItem("cookieConsentData", JSON.stringify(necessaryOnly));
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    
    setCookieCategories(prev => 
      prev.map(cat => ({ ...cat, enabled: cat.essential }))
    );
    closeConsent();
  };

  const handleSavePreferences = () => {
    const preferences = cookieCategories.reduce((acc, category) => {
      acc[category.id] = category.enabled;
      return acc;
    }, {} as Record<string, boolean>);

    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookieConsentData", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    
    closeConsent();
  };

  const toggleCookieCategory = (categoryId: string) => {
    setCookieCategories(prev =>
      prev.map(cat => 
        cat.id === categoryId && !cat.essential 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
  };

  const closeConsent = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ 
          y: isClosing ? "100%" : 0, 
          opacity: isClosing ? 0 : 1 
        }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.3
        }}
      >
        <Card className="max-w-7xl mx-auto bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-[#4FC08D]/20 shadow-2xl shadow-[#4FC08D]/10 overflow-hidden">
          <div className="relative">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-[#4FC08D] to-[#42B883] rounded-full blur-3xl" />
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-[#42B883] to-[#4FC08D] rounded-full blur-2xl" />
            </div>

            <CardContent className="relative p-6 md:p-8">
              {/* Botón de cierre */}
              <motion.button
                onClick={closeConsent}
                className="absolute top-4 right-4 w-8 h-8 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 backdrop-blur-sm border border-slate-700/50 hover:border-[#4FC08D]/50"
                aria-label="Cerrar aviso de cookies"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} />
              </motion.button>

              {/* Encabezado */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-[#42B883] to-[#4FC08D] rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Cookie className="w-5 h-5 text-black" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
                      <span className="bg-gradient-to-r from-[#4FC08D] to-[#42B883] text-transparent bg-clip-text">
                        Gestión de Cookies
                      </span>
                    </h2>
                    <p className="text-sm text-slate-400">Personaliza tu experiencia de navegación</p>
                  </div>
                </div>
              </motion.div>

              {/* Contenido principal */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#4FC08D] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Utilizamos cookies para mejorar tu experiencia, personalizar contenido y analizar el uso de nuestro sitio web. 
                    Puedes gestionar tus preferencias o aceptar todas las cookies para una experiencia completa.
                  </p>
                </div>

                {/* Botones de toggle */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleDetails}
                    className="border-slate-600 text-slate-300 hover:border-[#4FC08D] hover:text-[#4FC08D] transition-all duration-200"
                  >
                    {showDetails ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                    {showDetails ? "Ocultar" : "Ver"} Detalles
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePreferences}
                    className="border-slate-600 text-slate-300 hover:border-[#4FC08D] hover:text-[#4FC08D] transition-all duration-200"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Personalizar
                  </Button>
                </div>

                {/* Detalles expandibles */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {cookieCategories.map((category, index) => {
                            const IconComponent = category.icon;
                            return (
                              <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="space-y-2"
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className="w-4 h-4 text-[#4FC08D]" />
                                  <h3 className="font-medium text-white text-sm">{category.name}</h3>
                                  <Badge 
                                    variant={category.essential ? "default" : "secondary"}
                                    className={category.essential ? "bg-[#4FC08D] text-black" : ""}
                                  >
                                    {category.essential ? "Esencial" : "Opcional"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {category.description}
                                </p>
                                <div className="text-xs text-slate-500">
                                  <span className="font-medium">Ejemplos:</span> {category.examples.join(", ")}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Panel de preferencias */}
                <AnimatePresence>
                  {showPreferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/50 space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Settings className="w-5 h-5 text-[#4FC08D]" />
                          Configurar Preferencias
                        </h3>
                        
                        <div className="space-y-4">
                          {cookieCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                              <div 
                                key={category.id} 
                                className="flex items-center justify-between p-3 bg-slate-900/40 rounded-lg border border-slate-700/30"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <IconComponent className="w-5 h-5 text-[#4FC08D]" />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium text-white text-sm">{category.name}</h4>
                                      {category.essential && (
                                        <Badge className="bg-[#4FC08D] text-black text-xs">
                                          Requerido
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{category.description}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  {category.essential ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#4FC08D]" />
                                  ) : (
                                    <button
                                      onClick={() => toggleCookieCategory(category.id)}
                                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                                        category.enabled 
                                          ? 'bg-[#4FC08D]' 
                                          : 'bg-slate-600'
                                      }`}
                                      aria-label={`Toggle ${category.name}`}
                                    >
                                      <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                                          category.enabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Botones de acción */}
              <motion.div 
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  variant="outline" 
                  onClick={handleAcceptNecessary} 
                  className="sm:order-1 border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                >
                  Solo Necesarias
                </Button>
                
                {showPreferences && (
                  <Button 
                    variant="outline"
                    onClick={handleSavePreferences}
                    className="sm:order-2 border-[#4FC08D] text-[#4FC08D] hover:bg-[#4FC08D] hover:text-black transition-all duration-200"
                  >
                    Guardar Preferencias
                  </Button>
                )}
                
                <Button
                  onClick={handleAcceptAll}
                  className="sm:order-3 bg-gradient-to-r from-[#42B883] to-[#4FC08D] hover:from-[#42B883]/90 hover:to-[#4FC08D]/90 text-black font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#4FC08D]/25"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Aceptar Todo
                </Button>
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
