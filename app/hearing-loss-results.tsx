import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { EarWithWarning } from '@/components/icons/EarWithWarning';

export default function HearingLossResultsScreen() {
  const router = useRouter();
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ernstige hoorverlies</Text>
        
        <EarWithWarning size={100} color="#E31937" />
        
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Hearing Loss Assessment</Text>
          <Text style={styles.resultText}>
            Binnen verschillende richtlijnen worden voor dit profiel aanvullende klinische parameters meegenomen bij de evaluatie.
          </Text>
        </View>

        <Pressable 
          style={styles.readMoreButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </Pressable>

        {showDetails && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailsText}>
              Additional clinical parameters and detailed assessment guidelines for this hearing loss profile:
            </Text>
            <Text style={styles.detailsText}>
              • Audiological assessment
            </Text>
            <Text style={styles.detailsText}>
              • Speech discrimination
            </Text>
            <Text style={styles.detailsText}>
              • Patient counseling
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.pdfButton}>
          <Text style={styles.pdfButtonText}>Download PDF</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

import React from 'react';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 30,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  resultBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    marginVertical: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#E31937',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  readMoreButton: {
    marginVertical: 15,
  },
  readMoreText: {
    fontSize: 14,
    color: '#E31937',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  detailsText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pdfButton: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    borderRadius: 25,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
