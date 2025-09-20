import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface MyShoppersSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

export const MyShoppersSVG: React.FC<MyShoppersSVGProps> = ({ 
  width = 24, 
  height = 24, 
  color = "black" 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" 
        fill={color}
      />
      <Path 
        d="M19 14L20.09 18.26L24 19L20.09 19.74L19 24L17.91 19.74L14 19L17.91 18.26L19 14Z" 
        fill={color}
      />
      <Path 
        d="M5 14L6.09 18.26L10 19L6.09 19.74L5 24L3.91 19.74L0 19L3.91 18.26L5 14Z" 
        fill={color}
      />
    </Svg>
  );
};
