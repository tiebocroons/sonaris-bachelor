import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface EarWithAlertProps {
  size?: number;
  color?: string;
}

export const EarWithAlert: React.FC<EarWithAlertProps> = ({ size = 100, color = '#E31937' }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Ear outline */}
        <Path
          d="M 30 20 Q 25 40 25 60 Q 25 80 40 85 Q 55 90 55 65 Q 55 45 50 30 Z"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner ear */}
        <Path
          d="M 38 30 Q 35 45 35 60 Q 35 75 42 78"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Alert badge */}
        <Circle cx="70" cy="55" r="12" stroke={color} strokeWidth="2.5" fill="white" />
        {/* Exclamation mark */}
        <Circle cx="70" cy="50" r="1.5" fill={color} />
        <Path
          d="M 70 54 L 70 60"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};
