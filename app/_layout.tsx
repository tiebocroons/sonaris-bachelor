import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: 'Home', headerShown: true }} />
        <Stack.Screen name="upload-audiogram" options={{ title: 'Upload Audiogram', headerShown: true }} />
        <Stack.Screen name="scan-instructions" options={{ title: 'Scan Instructions', headerShown: true }} />
        <Stack.Screen name="error-screen" options={{ title: 'Error', headerShown: true }} />
        <Stack.Screen name="hearing-loss-results" options={{ title: 'Results', headerShown: true }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
