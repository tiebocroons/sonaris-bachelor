import { Svg, Path } from 'react-native-svg';

interface CameraProps {
  size?: number;
  color?: string;
}

export function Camera({ size = 200, color = '#D8D8D8' }: CameraProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 180 180" fill="none">
      <Path
        d="M50.7 165H129.3C150 165 158.25 152.325 159.225 136.875L163.125 74.925C164.175 58.725 151.275 45 135 45C130.425 45 126.225 42.375 124.125 38.325L118.725 27.45C115.275 20.625 106.275 15 98.625 15H81.45C73.725 15 64.725 20.625 61.275 27.45L55.875 38.325C53.775 42.375 49.575 45 45 45C28.725 45 15.825 58.725 16.875 74.925L20.775 136.875C21.675 152.325 30 165 50.7 165Z"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M78.75 60H101.25"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M90 135C103.425 135 114.375 124.05 114.375 110.625C114.375 97.2 103.425 86.25 90 86.25C76.575 86.25 65.625 97.2 65.625 110.625C65.625 124.05 76.575 135 90 135Z"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
