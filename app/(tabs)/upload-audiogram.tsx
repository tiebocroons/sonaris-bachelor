import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function UploadAudiogramScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' && !permission?.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        router.push({
          pathname: '/(tabs)/loading-screen',
          params: { photoUri: result.assets[0].uri }
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    }
  };

  const handleTakePhoto = async () => {
    if (permission?.granted && cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setImage(photo.uri);
        setShowCamera(false);
        router.push({
          pathname: '/(tabs)/loading-screen',
          params: { photoUri: photo.uri }
        });
      } catch (error) {
        console.error('Error taking photo:', error);
      }
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
              <Text style={styles.cancelButtonText}>Annuleren</Text>
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
      <View style={styles.content}>
        <Text style={styles.title}>Upload Audiogram</Text>
        
        <View style={styles.photoBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholderContent}>
              <Text style={styles.placeholderIcon}>🖼️</Text>
              <Text style={styles.placeholderText}>
                Take a photo of the audiogram{'\'\n'}PNG, WebP and JPG supported
              </Text>
            </View>
          )}
        </View>

        {image && (
          <Pressable 
            style={styles.changeButton}
            onPress={() => setImage(null)}
          >
            <Text style={styles.changeButtonText}>Change photo</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.buttonContainer}>
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
          <Text style={styles.buttonText}>📷 Take photo</Text>
        </Pressable>

        <Pressable 
          style={styles.button}
          onPress={handlePickImage}
        >
          <Text style={styles.buttonText}>📁 Upload from storage</Text>
        </Pressable>
      </View>
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
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#E31937',
    textAlign: 'center',
  },
  photoBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    minHeight: 280,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderContent: {
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  placeholderText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E31937',
  },
  changeButtonText: {
    color: '#E31937',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
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
