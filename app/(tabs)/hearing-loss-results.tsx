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
          contentFit="contain"
        />
        
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            Binnen verschillende richtlijnen worden voor dit profiel aanvullende klinische parameters meegenomen bij de evaluatie.
          </Text>
        </View>
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
        <Pressable 
          style={styles.readMoreButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.readMoreText}>Read More</Text>
        </Pressable>

        
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
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderLeftWidth: 0,
    maxWidth: 250,
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    lineHeight: 20,
    maxWidth: 250,
  },
  readMoreButton: {
    marginVertical: 15,
  },
  readMoreText: {
    fontSize: 16,
    color: '#E31937',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 0,
    borderWidth: 0,
    maxWidth: 250,
  },
  detailsText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
  },
  pdfButton: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    borderRadius: 25,
    width: 225,
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
