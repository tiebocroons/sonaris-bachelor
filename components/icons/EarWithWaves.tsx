import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface EarWithWavesProps {
  size?: number;
  color?: string;
}

export const EarWithWaves: React.FC<EarWithWavesProps> = ({ size = 100, color = '#E31937' }) => {
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
        {/* Sound waves */}
        <Path
          d="M 60 40 Q 65 35 70 40"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 65 50 Q 70 40 80 50"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 70 60 Q 75 50 85 60"
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};
