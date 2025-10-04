import { motion } from 'framer-motion';
import { useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export const AnimatedText = ({ text, className = '' }: AnimatedTextProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    hover: {
      scale: 1.05,
      rotateX: 2,
      rotateY: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -90 
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        // ease: "easeOut" // omitimos para cumplir tipos de transición
      }
    },
    hover: {
      y: Math.random() * 20 - 10,
      rotateZ: Math.random() * 20 - 10,
      scale: 1 + Math.random() * 0.2,
      transition: {
        duration: 0.3,
        // ease: "easeOut" // omitimos para cumplir tipos de transición
      }
    }
  };

  return (
    <motion.div
      className={`relative cursor-pointer select-none ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: 1000 }}
    >
      {/* Efecto de resplandor de fondo */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-500/20 blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.2 : 0.8
        }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Texto principal */}
      <motion.h2 
        className="relative text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tight antialiased"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: '900',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        {/* Sombra de texto */}
        <span 
          className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent opacity-20"
          style={{ transform: 'translate(2px, 2px)' }}
        >
          {text}
        </span>
        
        {/* Texto con gradiente */}
        <span className="relative bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
          {text.split('').map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block"
              variants={letterVariants}
              whileHover={{
                y: Math.random() * 30 - 15,
                rotateX: Math.random() * 20 - 10,
                rotateY: Math.random() * 20 - 10,
                rotateZ: Math.random() * 30 - 15,
                scale: 1.1 + Math.random() * 0.3,
                textShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.9)',
                  '0 0 40px rgba(59, 130, 246, 0.6)',
                  '0 4px 8px rgba(0,0,0,0.4)'
                ].join(', '),
                filter: 'brightness(1.3) contrast(1.1)',
                transition: {
                  duration: 0.3
                }
              }}
              style={{
                transformOrigin: 'center bottom',
                textShadow: '0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(59, 130, 246, 0.4)'
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </motion.h2>
      
      {/* Partículas flotantes */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full"
              initial={{ 
                opacity: 0,
                scale: 0,
                x: `${50}%`,
                y: `${50}%`
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Ejemplo de uso:
// <AnimatedText text="GLASTOR" className="text-center" />