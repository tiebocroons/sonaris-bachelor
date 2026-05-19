import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { EarWithWaves } from '@/components/icons/EarWithWaves';
import { EarWithAlert } from '@/components/icons/EarWithAlert';
import { EarWithWarning } from '@/components/icons/EarWithWarning';
import { getAnalysis, clearAnalysis } from '@/constants/analysis-store';

export default function HearingLossResultsScreen() {
  const [showDetails, setShowDetails] = useState(false);

  const analysis = getAnalysis();
  clearAnalysis();

  if (!analysis) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No analysis data available</Text>
      </View>
    );
  }

  // Determine icon component based on severity
  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'normal':
        return <EarWithWaves size={100} />;
      case 'mild':
      case 'moderate':
        return <EarWithAlert size={100} />;
      case 'moderately_severe':
      case 'moderately severe':
      case 'severe':
      case 'profound':
        return <EarWithWarning size={100} />;
      default:
        return <EarWithWarning size={100} />;
    }
  };

  const getSeverityTitle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'normal':
        return 'Normaal gehoor';
      case 'mild':
        return 'Licht gehoorverlies';
      case 'moderate':
        return 'Matig gehoorverlies';
      case 'moderately_severe':
      case 'moderately severe':
        return 'Matig-ernstig gehoorverlies';
      case 'severe':
        return 'Ernstig gehoorverlies';
      case 'profound':
        return 'Zeer ernstig gehoorverlies';
      default:
        return 'Gehoorverlies';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {getSeverityTitle(analysis.severity)}
        </Text>

        <View style={styles.iconContainer}>
          {getSeverityIcon(analysis.severity)}
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {analysis.summary || 'Analyse van uw audiogram is voltooid.'}
          </Text>
        </View>

        {showDetails && (
          <View style={styles.detailsBox}>
            {analysis.explanation && (
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Uitleg: </Text>
                {analysis.explanation}
              </Text>
            )}
            {analysis.whyHearingLoss && (
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Analyse: </Text>
                {analysis.whyHearingLoss}
              </Text>
            )}
            {analysis.howAnalysis && (
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Hoe we het hebben gelezen: </Text>
                {analysis.howAnalysis}
              </Text>
            )}
            {analysis.thresholds && (
              <View style={styles.thresholdsBox}>
                <Text style={styles.detailsLabel}>Drempelwaarden (dB HL):</Text>
                {analysis.thresholds.frequencies && (
                  <>
                    <Text style={styles.detailsText}>
                      Linkeroor: {JSON.stringify(analysis.thresholds.leftEar)}
                    </Text>
                    <Text style={styles.detailsText}>
                      Rechteroor: {JSON.stringify(analysis.thresholds.rightEar)}
                    </Text>
                  </>
                )}
              </View>
            )}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <View style={styles.recommendationsBox}>
                <Text style={styles.detailsLabel}>Aanbevelingen:</Text>
                {analysis.recommendations.map((rec: string, index: number) => (
                  <Text key={index} style={styles.recommendationItem}>
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        <Pressable 
          style={styles.readMoreButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.readMoreText}>
            {showDetails ? 'Minder tonen' : 'Meer tonen'}
          </Text>
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
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
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
  detailsLabel: {
    fontWeight: '600',
    color: '#E31937',
  },
  thresholdsBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  recommendationsBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 16,
    color: '#E31937',
    textAlign: 'center',
    marginTop: 50,
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
