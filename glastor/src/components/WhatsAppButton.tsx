import React from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from './SvgIcons';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  variant?: 'default' | 'floating' | 'navbar';
  size?: 'sm' | 'md' | 'lg';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '+5491132578591', // Número por defecto
  message = 'Hola! Me interesa conocer más sobre sus productos.',
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const getButtonStyles = () => {
    switch (variant) {
      case 'floating':
        return `fixed bottom-20 right-4 sm:bottom-24 sm:right-6 lg:bottom-28 lg:right-8 z-40 
                bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl 
                transition-all duration-300 hover:scale-110 rounded-full p-3 sm:p-4`;
      case 'navbar':
        return 'hover:bg-accent p-1.5 sm:p-2';
      default:
        return 'bg-green-500 hover:bg-green-600 text-white';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  if (variant === 'floating') {
    return (
      <button
        onClick={handleWhatsAppClick}
        className={`${getButtonStyles()} ${className}`}
        aria-label="Contactar por WhatsApp"
        title="¡Chatea con nosotros por WhatsApp!"
      >
        <WhatsAppIcon className={`${getIconSize()} text-white`} />
      </button>
    );
  }

  if (variant === 'navbar') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`${getButtonStyles()} ${className}`}
        onClick={handleWhatsAppClick}
        aria-label="Contactar por WhatsApp"
        title="¡Chatea con nosotros por WhatsApp!"
      >
        <WhatsAppIcon className={`${getIconSize()} text-green-500`} />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`${getButtonStyles()} ${className}`}
      aria-label="Contactar por WhatsApp"
      title="¡Chatea con nosotros por WhatsApp!"
    >
      <WhatsAppIcon className={`${getIconSize()} mr-2`} />
      Contactar por WhatsApp
    </Button>
  );
};

export default WhatsAppButton;