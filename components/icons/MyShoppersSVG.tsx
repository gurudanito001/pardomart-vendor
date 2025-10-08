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
      {/* Staff ID badge */}
      <Path d="M3 4H21C21.5523 4 22 4.44772 22 5V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V5C2 4.44772 2.44772 4 3 4Z" fill={color} opacity="0.15"/>
      {/* Clip corner holder */}
      <Path d="M10 2C9.44772 2 9 2.44772 9 3V4H15V3C15 2.44772 14.5523 2 14 2H10Z" fill={color}/>
      {/* User circle */}
      <Path d="M12 8a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z" fill={color}/>
      {/* Shoulders */}
      <Path d="M6.5 17.5c0-2.2091 3.3579-3.5 5.5-3.5s5.5 1.2909 5.5 3.5v.5H6.5v-.5Z" fill={color}/>
      {/* ID row lines */}
      <Path d="M4.5 8H8.5V9.5H4.5V8Z" fill={color}/>
      <Path d="M15.5 8H19.5V9.5H15.5V8Z" fill={color}/>
    </Svg>
  );
};
