import { Svg, Path } from 'react-native-svg';

interface ConvertShapeProps {
  size?: number;
  color?: string;
}

export function ConvertShape({ size = 180, color = '#DADADA' }: ConvertShapeProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <Path
        d="M165 38.625V66.375C165 83.25 158.25 90 141.375 90H121.125C104.25 90 97.5 83.25 97.5 66.375V38.625C97.5 21.75 104.25 15 121.125 15H141.375C158.25 15 165 21.75 165 38.625Z"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M82.5 113.625V141.375C82.5 158.25 75.75 165 58.875 165H38.625C21.75 165 15 158.25 15 141.375V113.625C15 96.75 21.75 90 38.625 90H58.875C75.75 90 82.5 96.75 82.5 113.625Z"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M165 112.5C165 141.525 141.525 165 112.5 165L120.375 151.875"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 67.5C15 38.475 38.475 15 67.5 15L59.625 28.125"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
