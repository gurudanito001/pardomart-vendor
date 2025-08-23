import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface OrderSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

export const OrderSVG: React.FC<OrderSVGProps> = ({ 
  width = 24, 
  height = 24, 
  color = "black" 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <Path 
        d="M17.5 4H7.5C6.39543 4 5.5 4.89543 5.5 6V19C5.5 20.1046 6.39543 21 7.5 21H17.5C18.6046 21 19.5 20.1046 19.5 19V6C19.5 4.89543 18.6046 4 17.5 4Z" 
        stroke={color} 
        strokeWidth="2"
      />
      <Path 
        d="M9.5 9H15.5M9.5 13H15.5M9.5 17H13.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};
