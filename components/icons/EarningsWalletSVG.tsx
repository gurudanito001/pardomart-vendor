import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface EarningsWalletSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

export const EarningsWalletSVG: React.FC<EarningsWalletSVGProps> = ({ 
  width = 24, 
  height = 24, 
  color = "black" 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M18.5 7H19.5C20.6046 7 21.5 7.89543 21.5 9V18C21.5 19.1046 20.6046 20 19.5 20H4.5C3.39543 20 2.5 19.1046 2.5 18V6C2.5 4.89543 3.39543 4 4.5 4H15.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M18.5 7V9H21.5V16H18.5V18H19.5C20.6046 18 21.5 17.1046 21.5 16V9C21.5 7.89543 20.6046 7 19.5 7H18.5Z" 
        fill={color}
      />
      <Path 
        d="M17 11H20" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};
