import React from 'react';
import { Svg, Path, G } from 'react-native-svg';

interface ConfettiSVGProps {
  width?: number;
  height?: number;
}

export const ConfettiSVG: React.FC<ConfettiSVGProps> = ({ 
  width = 107, 
  height = 107 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 107 107" fill="none">
      <G transform="rotate(-135 53.5 53.5)">
        {/* Main cone/funnel shape */}
        <Path 
          d="M40 20C40 20 45 25 53.5 25C62 25 67 20 67 20L60 50C60 55 57 58 53.5 58C50 58 47 55 47 50L40 20Z" 
          fill="#06888C" 
        />
        <Path 
          d="M40 20C40 20 45 25 53.5 25C62 25 67 20 67 20" 
          fill="#0A9BA1" 
        />
        <Path 
          d="M45 30H62L58 45H49L45 30Z" 
          fill="#0A9BA1" 
        />
        <Path 
          d="M49 45H58L54 50H49V45Z" 
          fill="#06888C" 
        />
        
        {/* Confetti particles - stars */}
        <Path 
          d="M25 15L27 21L33 19L29 25L35 27L29 29L33 35L27 33L25 39L23 33L17 35L21 29L15 27L21 25L17 19L23 21L25 15Z" 
          fill="#FFB5A7" 
        />
        <Path 
          d="M75 12L77 18L83 16L79 22L85 24L79 26L83 32L77 30L75 36L73 30L67 32L71 26L65 24L71 22L67 16L73 18L75 12Z" 
          fill="#FFB5A7" 
        />
        <Path 
          d="M82 45L84 51L90 49L86 55L92 57L86 59L90 65L84 63L82 69L80 63L74 65L78 59L72 57L78 55L74 49L80 51L82 45Z" 
          fill="#FF9CAD" 
        />
        
        {/* Streamers/ribbons coming out */}
        <Path 
          d="M35 12C35 12 30 8 25 12C25 12 20 8 15 12" 
          stroke="#06888C" 
          strokeWidth="3" 
          fill="none" 
        />
        <Path 
          d="M75 8C75 8 80 4 85 8C85 8 90 4 95 8" 
          stroke="#06888C" 
          strokeWidth="3" 
          fill="none" 
        />
        <Path 
          d="M88 35C88 35 92 30 96 35C96 35 100 30 104 35" 
          stroke="#0A9BA1" 
          strokeWidth="3" 
          fill="none" 
        />
        <Path 
          d="M12 40C12 40 8 35 4 40C4 40 0 35 -4 40" 
          stroke="#0A9BA1" 
          strokeWidth="3" 
          fill="none" 
        />
      </G>
    </Svg>
  );
};
