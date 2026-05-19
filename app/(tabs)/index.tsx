import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('@/assets/sonaris.svg')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.description}>
          Scan your audiograms with{'\'\n'}
          our app{'\'\n'}
          and provide the best results{'\'\n'}
          to your patients.
        </Text>
        <Pressable 
          style={styles.infoLink}
          onPress={() => router.push('/(tabs)/scan-instructions')}
        >
          <Text style={styles.infoLinkText}>More info about the app</Text>
        </Pressable>
      </View>
      
      <Pressable 
        style={styles.button}
        onPress={() => router.push('/(tabs)/upload-audiogram')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  description: {
    fontSize: 20,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoLink: {
    marginTop: 20,
  },
  infoLinkText: {
    fontSize: 16,
    color: '#E31937',
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
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
