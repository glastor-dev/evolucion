import React from 'react';
import { useTranslation } from 'react-i18next';
import { USFlagIcon, SpainFlagIcon } from './SvgIcons';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const isSpanish = i18n.language === 'es';

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 group"
      title={isSpanish ? 'Cambiar a inglés' : 'Switch to Spanish'}
      aria-label={isSpanish ? 'Cambiar idioma a inglés' : 'Change language to Spanish'}
    >
      <div className="w-6 h-6 transition-transform duration-200 group-hover:scale-110">
        {isSpanish ? (
          <USFlagIcon className="w-full h-full" />
        ) : (
          <SpainFlagIcon className="w-full h-full" />
        )}
      </div>
    </button>
  );
};

export default LanguageToggle;