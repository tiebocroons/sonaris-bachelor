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
      icon: <Camera size={120} />,
      text: 'Maak met uw\nsmartphonecamera een\nfoto van een bestaand\nanalog of digitaal\naudiogram.\nZorg voor voldoende licht\nen een volledig zicht op de\nmeetwaarden.\nDe app herkent\nautomatisch de relevante\naudiometrische gegevens.',
    },
    {
      icon: <ConvertShape size={120} />,
      text: 'De gescande\n audiogramwaarden worden automatisch omgezet\n naar gestructureerde digitale\n data.\nManuele invoer\n is niet nodig.\nDit bespaart tijd\n en vermindert interpretatiefouten.',
    },
    {
      icon: <Camera size={120} />,
      text: 'Stap 3 tekst hier.',
    },
    {
      icon: <Camera size={120} />,
      text: 'Stap 4 tekst hier.',
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
    fontSize: 16,
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
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
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
