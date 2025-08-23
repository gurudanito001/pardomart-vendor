import React from 'react';
import { Svg, Rect, Path } from 'react-native-svg';

interface ChatFilledSVGProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export const ChatFilledSVG: React.FC<ChatFilledSVGProps> = ({ 
  width = 30, 
  height = 30, 
  backgroundColor = "#2CAF0B",
  iconColor = "white"
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 30 31" fill="none">
      <Rect y="0.5" width="30" height="30" rx="15" fill={backgroundColor} />
      <Path 
        d="M15 9.42505C18.7125 9.42505 21.75 11.8415 21.75 14.825C21.75 17.8085 18.7125 20.225 15 20.225C14.163 20.225 13.3598 20.1035 12.6173 19.8875C10.6463 21.575 8.25 21.575 8.25 21.575C9.82275 20.0023 10.0725 18.9425 10.1063 18.5375C8.95875 17.5723 8.25 16.2628 8.25 14.825C8.25 11.8415 11.2875 9.42505 15 9.42505Z" 
        fill={iconColor}
      />
    </Svg>
  );
};
