import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function UploadAudiogramScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const handleTakePhoto = async () => {
    if (permission?.granted && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setImage(photo.uri);
        setShowCamera(false);
        // Automatically navigate to loading screen after photo is taken
        router.push('/(tabs)/loading-screen');
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const handleContinue = () => {
    if (image) {
      router.push('/(tabs)/scan-instructions');
    }
  };

  if (showCamera && permission?.granted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef} facing="back">
          <View style={styles.cameraControls}>
            <Pressable 
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={styles.captureButton}
              onPress={handleTakePhoto}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>
            <View style={styles.spacer} />
          </View>
        </CameraView>
      </View>
    );
  }

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

      {image && (
        <Pressable 
          style={styles.changeButton}
          onPress={() => setImage(null)}
        >
          <Text style={styles.changeButtonText}>Andere foto</Text>
        </Pressable>
      )}

      <Pressable 
        style={styles.button}
        onPress={() => {
          if (permission?.granted) {
            setShowCamera(true);
          } else {
            requestPermission();
          }
        }}
      >
        <Text style={styles.buttonText}>Neem foto</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, !image && styles.changeButton]}
        onPress={handleContinue}
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
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#fff',
  },
  spacer: {
    width: 70,
  },
  changeButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E31937',
  },
  changeButtonText: {
    color: '#E31937',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
