import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useState } from 'react';

export default function UploadAudiogramScreen() {
  const [image, setImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    console.log('Take photo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Audiogram</Text>
      
      <View style={styles.photoBox}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderIcon}>🖼️</Text>
            <Text style={styles.placeholderText}>
              Neem een foto van de audiogram{'\n'}png, webpp en jpg toegelaten
            </Text>
          </View>
        )}
      </View>

      <Pressable 
        style={styles.button}
        onPress={handleTakePhoto}
      >
        <Text style={styles.buttonText}>Neem foto</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, !image && styles.buttonDisabled]}
        disabled={!image}
      >
        <Text style={styles.buttonText}>Volgende</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  photoBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 30,
    marginBottom: 40,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
