import React from 'react';
import { Svg, Path } from 'react-native-svg';

interface ArrowBackSVGProps {
  width?: number;
  height?: number;
  color?: string;
}

export const ArrowBackSVG: React.FC<ArrowBackSVGProps> = ({ 
  width = 30, 
  height = 30, 
  color = "white" 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 31 30" fill="none">
      <Path 
        d="M20.1278 21.993C20.3661 22.2135 20.5 22.5125 20.5 22.8243C20.5 23.1361 20.3661 23.4352 20.1278 23.6556C19.8895 23.8761 19.5662 24 19.2292 24C18.8921 24 18.5689 23.8761 18.3306 23.6556L9.87313 15.8313C9.75486 15.7223 9.66102 15.5927 9.59699 15.4501C9.53296 15.3074 9.5 15.1545 9.5 15C9.5 14.8455 9.53296 14.6926 9.59699 14.5499C9.66102 14.4073 9.75486 14.2777 9.87313 14.1687L18.3306 6.34435C18.5689 6.12387 18.8921 6 19.2292 6C19.5662 6 19.8895 6.12387 20.1278 6.34435C20.3661 6.56483 20.5 6.86387 20.5 7.17568C20.5 7.48749 20.3661 7.78653 20.1278 8.00702L12.57 14.999L20.1278 21.993Z" 
        fill={color}
      />
    </Svg>
  );
};
