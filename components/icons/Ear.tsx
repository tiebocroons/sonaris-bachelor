import { View } from 'react-native';

interface EarProps {
  size?: number;
  color?: string;
}

export const Ear: React.FC<EarProps> = ({ size = 100, color = '#E31937' }) => {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.6,
          height: size * 0.8,
          borderRadius: size * 0.3,
          borderWidth: size * 0.08,
          borderColor: color,
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: size * 0.3,
            height: size * 0.4,
            borderRadius: size * 0.15,
            borderWidth: size * 0.08,
            borderColor: color,
            left: size * 0.12,
            top: size * 0.1,
          }}
        />
      </View>
    </View>
  );
};
