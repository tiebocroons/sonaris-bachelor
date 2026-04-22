import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import React, { useState } from 'react';

export default function HearingLossResultsScreen() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ernstige hoorverlies</Text>
        
        <Image
          source={require('@/assets/severe.svg')}
          style={styles.icon}
        />
        
        <View style={styles.resultBox}>
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
              Het audiogram toont een ernstig gehoorverlies, bilateraal aanwezig, met een duidelijke toename van het verlies in het mididen- en hoge frequentiebereik.
            </Text>
            <Text style={styles.detailsText}>
              De drempelwaarden liggen over meerdere frequenties verhoogd, wat kan wijzen op een significante beperking in functioneel gehoor.
            </Text>
            <Text style={styles.detailsText}>
              De gemeten spraakverstaanbaarheid is beperkt in verhouding tot de gehoordrempels, wat binnen verschillende richtlijnen wordt meegenomen als aanvullende parameter bij verdere evaluatie.
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
  icon: {
    width: 144,
    height: 112,
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderLeftWidth: 0,
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
    padding: 0,
    marginTop: 0,
    borderWidth: 0,
  },
  detailsText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
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
