import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const MenuIcon: React.FC<IconProps> = ({ className = "h-5 w-5", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);

export const ShoppingCartIcon: React.FC<IconProps> = ({ className = "h-5 w-5", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = "h-5 w-5", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = "h-5 w-5", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = "h-5 w-5", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="m19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
  </svg>
);

// Language Flag Icons
export const USFlagIcon: React.FC<IconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 16" 
    fill="none"
  >
    <rect width="24" height="16" fill="#B22234" rx="2"/>
    <rect width="24" height="1.23" y="1.23" fill="white"/>
    <rect width="24" height="1.23" y="3.69" fill="white"/>
    <rect width="24" height="1.23" y="6.15" fill="white"/>
    <rect width="24" height="1.23" y="8.62" fill="white"/>
    <rect width="24" height="1.23" y="11.08" fill="white"/>
    <rect width="24" height="1.23" y="13.54" fill="white"/>
    <rect width="9.6" height="8.62" fill="#3C3B6E"/>
    <g fill="white">
      <circle cx="1.6" cy="1.6" r="0.3"/>
      <circle cx="3.2" cy="1.6" r="0.3"/>
      <circle cx="4.8" cy="1.6" r="0.3"/>
      <circle cx="6.4" cy="1.6" r="0.3"/>
      <circle cx="8" cy="1.6" r="0.3"/>
      <circle cx="2.4" cy="2.8" r="0.3"/>
      <circle cx="4" cy="2.8" r="0.3"/>
      <circle cx="5.6" cy="2.8" r="0.3"/>
      <circle cx="7.2" cy="2.8" r="0.3"/>
    </g>
  </svg>
);

export const SpainFlagIcon: React.FC<IconProps> = ({ className = "h-4 w-4", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 16" 
    fill="none"
  >
    <rect width="24" height="16" fill="#AA151B" rx="2"/>
    <rect width="24" height="10" y="3" fill="#F1BF00"/>
    <g transform="translate(6, 5)">
      <rect width="4" height="6" fill="#AA151B"/>
      <rect width="3" height="4" x="0.5" y="1" fill="#F1BF00"/>
      <rect width="2" height="2" x="1" y="1.5" fill="#AA151B"/>
    </g>
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className = "h-5 w-5", size }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
  </svg>
);