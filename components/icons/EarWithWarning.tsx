import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface EarWithWarningProps {
  size?: number;
  color?: string;
}

export const EarWithWarning: React.FC<EarWithWarningProps> = ({ size = 100, color = '#E31937' }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Ear outline */}
        <Path
          d="M 25 20 Q 20 40 20 60 Q 20 80 35 85 Q 50 90 50 65 Q 50 45 45 30 Z"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner ear */}
        <Path
          d="M 33 30 Q 30 45 30 60 Q 30 75 37 78"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Warning badge - triangle */}
        <Path
          d="M 70 40 L 80 65 L 60 65 Z"
          stroke={color}
          strokeWidth="2"
          fill="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Exclamation mark inside */}
        <Circle cx="70" cy="55" r="1.5" fill={color} />
        <Path
          d="M 70 49 L 70 54"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};
