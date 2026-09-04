import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "h-11 w-auto", 
  variant = "light",
  height = 48 
}) => {
  // If variant is light, JYADA text is dark (#111827) so it reads clearly on white/light backgrounds.
  // If variant is dark, JYADA text is white (#FFFFFF) for dark footers / dark headers.
  const textColor = variant === 'dark' ? '#FFFFFF' : '#111827';
  const subtextColor = variant === 'dark' ? '#9BA3AF' : '#6B7280';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 420 80" 
        height={height}
        style={{ width: 'auto', display: 'block', maxHeight: '100%' }}
        aria-label="Jyada Kharido — Best Deals • Big Savings"
      >
        <defs>
          <linearGradient id="jkAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3366" />
            <stop offset="50%" stopColor="#F52D56" />
            <stop offset="100%" stopColor="#FF9900" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F52D56" floodOpacity="0.3" />
          </filter>
        </defs>

        <g transform="translate(10, 8)">
          <path 
            d="M 22 24 C 22 10, 42 10, 42 24" 
            fill="none" 
            stroke="url(#jkAccentGrad)" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
          />
          
          <rect 
            x="10" 
            y="22" 
            width="44" 
            height="42" 
            rx="10" 
            fill="url(#jkAccentGrad)" 
            filter="url(#glow)" 
          />

          <path 
            d="M 24 45 L 32 36 L 40 45" 
            fill="none" 
            stroke="#FFFFFF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <line 
            x1="32" 
            y1="36" 
            x2="32" 
            y2="52" 
            stroke="#FFFFFF" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </g>

        <text 
          x="75" 
          y="49" 
          fontFamily="-apple-system, BlinkMacSystemFont, 'Outfit', 'Segoe UI', Roboto, sans-serif" 
          fontSize="34" 
          fontWeight="900" 
          letterSpacing="-1px" 
          fill={textColor}
        >
          JYADA
        </text>

        <text 
          x="188" 
          y="49" 
          fontFamily="-apple-system, BlinkMacSystemFont, 'Outfit', 'Segoe UI', Roboto, sans-serif" 
          fontSize="34" 
          fontWeight="900" 
          letterSpacing="-1px" 
          fill="url(#jkAccentGrad)"
        >
          KHARIDO
        </text>

        <path 
          d="M 190 58 Q 255 70 320 58" 
          fill="none" 
          stroke="#FF9900" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
        />
        
        <text 
          x="77" 
          y="69" 
          fontFamily="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Segoe UI', Roboto, sans-serif" 
          fontSize="9" 
          fontWeight="700" 
          letterSpacing="2.5px" 
          fill={subtextColor}
        >
          BEST DEALS • BIG SAVINGS
        </text>
      </svg>
    </div>
  );
};
