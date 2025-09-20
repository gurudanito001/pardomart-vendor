import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface ResourcesSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ResourcesSVG: React.FC<ResourcesSVGProps> = ({ 
  width = 24, 
  height = 24, 
  color = "black" 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        d="M16.5 10.25L21 12.5L12 17L3 12.5L7.5 10.25M16.5 15.25L21 17.5L12 22L3 17.5L7.5 15.25M12 3L21 7.5L12 12L3 7.5L12 3Z" 
        stroke={color} 
        strokeWidth="2"
      />
    </Svg>
  );
};
