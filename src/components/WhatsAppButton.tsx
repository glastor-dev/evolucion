import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle, Clock, MessageCircle, Send, Users, Zap } from "lucide-react";
import "./whatsapp-cinema.css";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  variant?: "cinema" | "floating" | "navbar" | "premium" | "minimal";
  size?: "sm" | "md" | "lg" | "xl";
  showPulse?: boolean;
  showNotification?: boolean;
  customText?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "+5491132578591",
  message = "🚀 ¡Hola! Me interesa conocer más sobre sus productos cinematográficos.",
  className = "",
  variant = "cinema",
  size = "md",
  showPulse = true,
  showNotification = false,
  customText = "Contactar por WhatsApp",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Simular estado online/offline
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% del tiempo online
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-8 h-8";
      case "xl":
        return "w-10 h-10";
      default:
        return "w-6 h-6";
    }
  };

  // Componente Cinema (principal)
  if (variant === "cinema") {
    return (
      <motion.div
        className={`whatsapp-cinema group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.button
          onClick={handleWhatsAppClick}
          className="relative bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl overflow-hidden shadow-2xl"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Contactar por WhatsApp"
        >
          {/* Fondo con efectos */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Partículas de fondo */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Contenido */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="relative">
              <MessageCircle
                className={`${getIconSize()} transition-transform duration-300 group-hover:rotate-12`}
              />
              {showPulse && (
                <motion.div
                  className="absolute inset-0 bg-white rounded-full opacity-30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {isOnline && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white" />
              )}
            </div>

            <span className="text-lg font-semibold">{customText}</span>

            <motion.div
              className="flex items-center"
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>

          {/* Efecto de brillo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{ transform: "translateX(-100%) skewX(-45deg)" }}
            animate={isHovered ? { x: "200%" } : {}}
            transition={{ duration: 0.8 }}
          />
        </motion.button>
      </motion.div>
    );
  }

  // Componente Floating cinematográfico
  if (variant === "floating") {
    return (
      <motion.div
        className={`fixed bottom-6 right-6 z-50 ${className}`}
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <motion.button
          onClick={handleWhatsAppClick}
          className="whatsapp-floating relative bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full shadow-2xl overflow-hidden group"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Abrir chat de WhatsApp"
        >
          {/* Efecto de pulso (desactivado) */}
          {showPulse && (
            <div
              className="absolute inset-0 bg-green-400 rounded-full opacity-30"
            />
          )}

          {/* Partículas flotantes (desactivadas) */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${25 + i * 10}%`,
                  top: `${25 + (i % 2) * 25}%`,
                  opacity: 0.4
                }}
              />
            ))}
          </div>

          {/* Icono principal */}
          <div className="relative z-10">
            <MessageCircle className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
            {isOnline && (
              <div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-300 rounded-full border-2 border-white"
              />
            )}
          </div>

          {/* Notificación */}
          {showNotification && (
            <div
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
            >
              1
            </div>
          )}
        </motion.button>

        {/* Tooltip cinematográfico */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl border border-green-500/30 backdrop-blur-sm"
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-400"}`}
                  />
                  <span>{isOnline ? "En línea" : "Desconectado"}</span>
                </div>
                <Zap className="w-3 h-3 text-yellow-400" />
              </div>
              <p className="text-xs text-gray-300 mt-1">¡Respuesta rápida garantizada!</p>

              {/* Flecha del tooltip */}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-l-8 border-l-slate-900 border-y-4 border-y-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Componente Premium con glassmorphism
  if (variant === "premium") {
    return (
      <motion.button
        onClick={handleWhatsAppClick}
        className={`whatsapp-premium group relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl overflow-hidden ${className}`}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contactar por WhatsApp Premium"
      >
        {/* Fondo glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-600/10 to-green-500/20 group-hover:from-green-400/30 group-hover:to-emerald-500/30 transition-all duration-500" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
              backgroundSize: "15px 15px",
            }}
          />
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>

            {/* Indicador de estado */}
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center"
            >
              <CheckCircle className="w-2 h-2 text-white" />
            </div>
          </div>

          <div className="flex-1 text-left">
            <h3 className="text-white font-semibold text-lg">WhatsApp Business</h3>
            <p className="text-gray-300 text-sm flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>Soporte 24/7</span>
              <Clock className="w-3 h-3 ml-2" />
              <span>Respuesta inmediata</span>
            </p>
          </div>

          <motion.div
            className="flex items-center gap-2"
            animate={isHovered ? { x: 10 } : { x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Send className="w-5 h-5 text-green-400" />
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Efectos de partículas premium (desactivados) */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Partículas desactivadas para evitar titilado */}
        </div>
      </motion.button>
    );
  }

  // Componente Navbar minimalista
  if (variant === "navbar") {
    return (
      <motion.button
        onClick={handleWhatsAppClick}
        className={`p-2 rounded-lg hover:bg-white/10 transition-all duration-300 group ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-green-400 transition-colors duration-300" />
          {isOnline && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
          )}
        </div>
      </motion.button>
    );
  }

  // Componente Minimal
  return (
    <motion.button
      onClick={handleWhatsAppClick}
      className={`inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className={getIconSize()} />
      <span>{customText}</span>
    </motion.button>
  );
};

export default WhatsAppButton;
