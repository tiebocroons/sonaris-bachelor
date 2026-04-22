import { Stack } from 'expo-router';

export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="upload-audiogram" />
      <Stack.Screen name="scan-instructions" />
      <Stack.Screen name="error-screen" />
      <Stack.Screen name="hearing-loss-results" />
    </Stack>
  );
}
