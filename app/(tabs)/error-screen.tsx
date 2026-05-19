import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Error } from '@/components/icons/Error';

export default function ErrorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ errorMessage?: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Error size={200} />
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>
          {params.errorMessage || 'Something went wrong,\nplease try again!'}
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'AnekTamil_700Bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#E31937',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 225,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
