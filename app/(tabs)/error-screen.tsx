import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Error } from '@/components/icons/Error';

export default function ErrorScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Error size={200} />
        <Text style={styles.title}>Oops!</Text>
        <Text style={styles.message}>
          Er is iets fout gelopen,{'\n'}
          probeer het nog eens opnieuw!
        </Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Probeer opnieuw</Text>
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
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#E31937',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
