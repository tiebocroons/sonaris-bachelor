import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const BACKEND_URL = 'https://your-backend-api.com/scan-audiogram'; // Replace with actual backend URL

export default function LoadingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ photoUri: string }>();
  const [visibleDots, setVisibleDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleDots((prev) => (prev + 1) % 6);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scanAudiogramPhoto = async () => {
      try {
        if (!params.photoUri) {
          throw new Error('No photo provided');
        }

        // Create FormData to send the image
        const formData = new FormData();
        formData.append('image', {
          uri: params.photoUri,
          type: 'image/jpeg',
          name: 'audiogram.jpg',
        } as any);

        // Send to backend
        const response = await fetch(BACKEND_URL, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        // Check if scanning was successful
        if (result.success) {
          // Navigate to results screen after 5 seconds
          setTimeout(() => {
            router.push('/(tabs)/hearing-loss-results');
          }, 5000);
        } else {
          // Navigate to error screen if audiogram couldn't be read
          throw new Error(result.error || 'Could not scan audiogram');
        }
      } catch (error) {
        console.error('Error scanning audiogram:', error);
        // Navigate to error screen on failure
        router.push('/(tabs)/error-screen');
      }
    };

    // Start scanning after a short delay
    const timer = setTimeout(scanAudiogramPhoto, 1000);
    return () => clearTimeout(timer);
  }, [params.photoUri, router]);

  const getDotOpacity = (dotIndex: number) => {
    if (visibleDots >= dotIndex && visibleDots < 3) {
      return 1;
    }
    return 0.2;
  };

  return (
    <View style={styles.container}>
      <Svg width={239} height={225} viewBox="0 0 239 225" style={styles.svg}>
        {/* Ear paths */}
        <Path
          d="M141 129.5C141 129.5 146.126 135.059 146.5 139.5C146.715 142.059 146.5 145.5 145.5 146C144.5 146.5 141 147 141 147C137.654 146.664 138.757 145.698 137.817 143.154L125.817 117.941C121.579 123.99 116.879 133.347 111.52 133.341L83.6774 132.66L80.2247 113.904C74.4163 100.567 60.8815 107.64 51.5485 104.967C35.9337 100.495 32.1573 76.9318 36.5571 63.121C41.5442 47.464 55.2889 36.3147 73.0916 35.5595C86.6145 34.984 98.0334 40.5826 106.347 49.3582C120.506 64.2959 116.855 93.3141 107.816 87.5356C106.365 86.6065 103.632 82.4046 103.8 80.4564C105.202 64.1341 94.0413 47.3442 75.3395 47.7518C64.5619 47.9855 55.0132 53.7041 50.4336 61.7304C45.1168 71.0514 46.4475 86.097 54.3358 92.6847C74.5302 90.293 92.7885 98.8468 94.9285 120.756L107.816 121.412C115.393 116.173 113.522 106.516 123.838 104.311C127.441 103.543 135.149 108.279 136.594 112.055L141 129.5Z"
          fill="#E60F30"
        />
        <Path
          d="M61.0433 178.037C63.9445 200.21 78.2826 213.577 98.0754 211.97C134.682 208.997 124.899 167.385 129.131 161.031C130.27 159.323 136.57 158.723 137.319 160.636C145.298 180.86 136.564 215.513 105.964 222.988C84.3787 228.257 57.6746 217.018 52.6994 192.825C41.5202 138.475 7.31739 132.738 0.831681 86.0311C-5.53415 40.2051 25.306 3.44828 70.652 0.247346C142.378 -4.81181 163.442 69.3311 151.154 76.794C149.02 78.0888 142.66 74.3843 142.492 71.4411C140.448 36.069 110.795 11.049 75.3155 12.3198C54.5996 13.0631 35.7119 21.5329 24.5926 36.5186C12.0108 53.4823 8.94182 74.4263 15.4215 94.555C26.4748 128.908 57.0812 147.742 61.0493 178.031L61.0433 178.037Z"
          fill="#E60F30"
        />
        {/* Animated dots */}
        <Path
          d="M165 139H165.039"
          stroke="#E60F30"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={getDotOpacity(0)}
        />
        <Path
          d="M197 139H197.039"
          stroke="#E60F30"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={getDotOpacity(1)}
        />
        <Path
          d="M229 139H229.039"
          stroke="#E60F30"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={getDotOpacity(2)}
        />
      </Svg>
      <Text style={styles.text}>Analysering van audiogram...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  svg: {
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
