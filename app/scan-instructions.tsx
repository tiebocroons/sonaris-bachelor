import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { EarWithWaves } from '@/components/icons/EarWithWaves';

export default function ScanInstructionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <EarWithWaves size={120} color="#E31937" />
        <Text style={styles.title}>Scan Audiograms</Text>
        <Text style={styles.description}>
          Scan jou audiogrammen met onze app{'\n'}
          en geef de beste resultaten{'\n'}
          aan u patiënten.
        </Text>
        <Pressable style={styles.infoLink}>
          <Text style={styles.infoLinkText}>Meer info over de app</Text>
        </Pressable>
      </View>

      <Pressable 
        style={styles.button}
        onPress={() => router.push('/hearing-loss-results')}
      >
        <Text style={styles.buttonText}>Verdergaan</Text>
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
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoLink: {
    marginTop: 20,
  },
  infoLinkText: {
    fontSize: 14,
    color: '#E31937',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    paddingHorizontal: 60,
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
