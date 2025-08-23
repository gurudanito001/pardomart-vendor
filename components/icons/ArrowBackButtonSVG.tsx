import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface ArrowBackButtonSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ArrowBackButtonSVG: React.FC<ArrowBackButtonSVGProps> = ({ 
  width = 24, 
  height = 24, 
  color = "white" 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
      <Path 
        d="M20 11.5H7.83L13.42 5.91L12 4.5L4 12.5L12 20.5L13.41 19.09L7.83 13.5H20V11.5Z" 
        fill={color}
      />
    </Svg>
  );
};
