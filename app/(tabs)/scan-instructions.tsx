import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera } from '@/components/icons/Camera';
import { ConvertShape } from '@/components/icons/ConvertShape';
import { useState } from 'react';

export default function ScanInstructionsScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 4;

  const steps = [
    {
      icon: <Camera size={200} />,
      text: 'Use your smartphone\ncamera to take a photo\nof an existing analog\nor digital audiogram.\nEnsure good lighting\nand a complete view\nof the measurement values.\nThe app will automatically\nrecognize the relevant\naudiometric data.',
    },
    {
      icon: <ConvertShape size={200} />,
      text: 'The scanned audiogram\nvalues are automatically\nconverted to structured\ndigital data.\nManual entry is not required.\nThis saves time and\nreduces interpretation errors.',
    },
    {
      icon: <Camera size={200} />,
      text: 'Upload the photo\nor take one directly\nin the app.\nMake sure the\naudiogram is fully\nvisible and in focus.',
    },
    {
      icon: <Camera size={200} />,
      text: 'Receive a clear\noverview of the\nhearing loss results\nand share them\nwith your patient.',
    },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/upload-audiogram');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.instructionBox}>
          {steps[currentStep].icon}
          <Text style={styles.instruction}>
            {steps[currentStep].text}
          </Text>
        </View>

        <View style={styles.dotsContainer}>
          {[...Array(totalSteps)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentStep ? '#E31937' : '#CCCCCC' },
              ]}
            />
          ))}
        </View>
      </View>

      <Pressable style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
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
  instructionBox: {
    borderWidth: 2,
    borderColor: '#CCC',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#FFF',
  },
  instruction: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 20,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 26,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: 270,
  },
  buttonText: {
    fontFamily: 'BarlowCondensed_400Regular',
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
});
