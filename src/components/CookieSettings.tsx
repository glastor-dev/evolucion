import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { 
  Settings, 
  Cookie, 
  X, 
  Shield, 
  BarChart3, 
  Target, 
  CheckCircle2,
  RotateCcw,
  Save
} from "lucide-react";

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  essential: boolean;
  enabled: boolean;
  icon: typeof Shield;
  examples: string[];
}

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookieSettingsModal = ({ isOpen, onClose }: CookieSettingsProps) => {
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

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Cargar las preferencias actuales
      const consentData = localStorage.getItem("cookieConsentData");
      if (consentData) {
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
      setHasChanges(false);
    }
  }, [isOpen]);

  const toggleCookieCategory = (categoryId: string) => {
    setCookieCategories(prev =>
      prev.map(cat => 
        cat.id === categoryId && !cat.essential 
          ? { ...cat, enabled: !cat.enabled }
          : cat
      )
    );
    setHasChanges(true);
  };

  const handleSavePreferences = () => {
    const preferences = cookieCategories.reduce((acc, category) => {
      acc[category.id] = category.enabled;
      return acc;
    }, {} as Record<string, boolean>);

    localStorage.setItem("cookieConsent", "custom");
    localStorage.setItem("cookieConsentData", JSON.stringify(preferences));
    localStorage.setItem("cookieConsentTimestamp", new Date().toISOString());
    
    setHasChanges(false);
    onClose();
    
    // Mostrar notificación de éxito
    console.log("Preferencias de cookies guardadas");
  };

  const handleResetToDefaults = () => {
    setCookieCategories(prev => 
      prev.map(cat => ({ ...cat, enabled: cat.essential }))
    );
    setHasChanges(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-[#4FC08D]/20 shadow-2xl shadow-[#4FC08D]/10">
            <CardContent className="p-0">
              {/* Header */}
              <div className="relative p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-br from-[#42B883] to-[#4FC08D] rounded-full flex items-center justify-center"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Cookie className="w-5 h-5 text-black" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      <span className="bg-gradient-to-r from-[#4FC08D] to-[#42B883] text-transparent bg-clip-text">
                        Configuración de Cookies
                      </span>
                    </h2>
                    <p className="text-sm text-slate-400">Gestiona tus preferencias de privacidad</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-slate-800/50 hover:bg-slate-700/50 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 backdrop-blur-sm border border-slate-700/50 hover:border-[#4FC08D]/50"
                  aria-label="Cerrar configuración"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
                <div className="text-sm text-slate-300 leading-relaxed">
                  <p>Aquí puedes revisar y modificar tus preferencias de cookies en cualquier momento. 
                  Los cambios se aplicarán inmediatamente y se recordarán para futuras visitas.</p>
                </div>

                <div className="space-y-4">
                  {cookieCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <IconComponent className="w-5 h-5 text-[#4FC08D] mt-0.5" />
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-medium text-white">{category.name}</h3>
                                {category.essential && (
                                  <Badge className="bg-[#4FC08D] text-black text-xs">
                                    Requerido
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-400 leading-relaxed">
                                {category.description}
                              </p>
                              <div className="text-xs text-slate-500">
                                <span className="font-medium">Ejemplos:</span> {category.examples.join(", ")}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            {category.essential ? (
                              <CheckCircle2 className="w-5 h-5 text-[#4FC08D]" />
                            ) : (
                              <button
                                onClick={() => toggleCookieCategory(category.id)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#4FC08D] focus:ring-offset-2 focus:ring-offset-slate-900 ${
                                  category.enabled 
                                    ? 'bg-[#4FC08D]' 
                                    : 'bg-slate-600'
                                }`}
                                aria-label={`${category.enabled ? 'Desactivar' : 'Activar'} ${category.name}`}
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
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <Button
                    variant="outline"
                    onClick={handleResetToDefaults}
                    className="border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restablecer
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                    >
                      Cancelar
                    </Button>
                    
                    <Button
                      onClick={handleSavePreferences}
                      disabled={!hasChanges}
                      className="bg-gradient-to-r from-[#42B883] to-[#4FC08D] hover:from-[#42B883]/90 hover:to-[#4FC08D]/90 text-black font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#4FC08D]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Botón flotante para abrir configuración de cookies
export const CookieSettingsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Solo mostrar si ya hay consentimiento previo
    const consent = localStorage.getItem("cookieConsent");
    setHasConsent(!!consent);
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 left-4 z-40 w-12 h-12 bg-gradient-to-br from-[#42B883] to-[#4FC08D] text-black rounded-full shadow-lg shadow-[#4FC08D]/25 hover:shadow-xl hover:shadow-[#4FC08D]/40 transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Configuración de Cookies"
        aria-label="Abrir configuración de cookies"
      >
        <Cookie className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
      </motion.button>

      <CookieSettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};