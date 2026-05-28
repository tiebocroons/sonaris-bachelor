import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { NormalHearing } from '@/components/icons/NormalHearing';
import { SevereHearing } from '@/components/icons/SevereHearing';
import { getAnalysis, clearAnalysis, AnalysisData } from '@/constants/analysis-store';

export default function HearingLossResultsScreen() {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [analysis] = useState<AnalysisData | null>(() => {
    const data = getAnalysis();
    clearAnalysis();
    return data;
  });

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
      case 'mild':
      case 'moderate':
        return <NormalHearing size={200} />;
      case 'moderately_severe':
      case 'moderately severe':
      case 'severe':
      case 'profound':
      default:
        return <SevereHearing size={200} />;
    }
  };

  const getSeverityTitle = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'normal':
        return 'Normal hearing';
      case 'mild':
        return 'Mild hearing loss';
      case 'moderate':
        return 'Moderate hearing loss';
      case 'moderately_severe':
      case 'moderately severe':
        return 'Moderately severe hearing loss';
      case 'severe':
        return 'Severe hearing loss';
      case 'profound':
        return 'Profound hearing loss';
      default:
        return 'Hearing loss';
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
            {analysis.summary || 'Analysis of your audiogram is complete.'}
          </Text>
        </View>

        {showDetails && (
          <View style={styles.detailsBox}>
            {analysis.explanation && (
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Explanation: </Text>
                {analysis.explanation}
              </Text>
            )}
            {analysis.whyHearingLoss && (
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Analysis: </Text>
                {analysis.whyHearingLoss}
              </Text>
            )}
            {analysis.howAnalysis && (
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>How we read it: </Text>
                {analysis.howAnalysis}
              </Text>
            )}
            {analysis.thresholds && (
              <View style={styles.thresholdsBox}>
                <Text style={styles.detailsLabel}>Thresholds (dB HL):</Text>
                {/* Header row */}
                {(() => {
                  const thresholds = analysis.thresholds as { leftEar?: Record<string,number>; rightEar?: Record<string,number> };
                  const freqs = ['250','500','1k','2k','4k','8k'];
                  const freqKeys = ['250','500','1000','2000','4000','8000'];
                  return (
                    <View style={styles.thresholdTable}>
                      <View style={styles.thresholdRow}>
                        <Text style={styles.thresholdLabelCell}>Hz</Text>
                        {freqs.map(f => (
                          <Text key={f} style={styles.thresholdHeaderCell}>{f}</Text>
                        ))}
                      </View>
                      {thresholds.leftEar && (
                        <View style={styles.thresholdRow}>
                          <Text style={styles.thresholdEarCell}>L</Text>
                          {freqKeys.map(f => (
                            <Text key={f} style={styles.thresholdValueCell}>
                              {thresholds.leftEar![f] ?? '—'}
                            </Text>
                          ))}
                        </View>
                      )}
                      {thresholds.rightEar && (
                        <View style={[styles.thresholdRow, styles.thresholdRowAlt]}>
                          <Text style={styles.thresholdEarCell}>R</Text>
                          {freqKeys.map(f => (
                            <Text key={f} style={styles.thresholdValueCell}>
                              {thresholds.rightEar![f] ?? '—'}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })()}
              </View>
            )}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <View style={styles.recommendationsBox}>
                <Text style={styles.detailsLabel}>Recommendations:</Text>
                {analysis.recommendations.map((rec: string, index: number) => (
                  <Text key={index} style={styles.recommendationItem}>
                    • {rec}
                  </Text>
                ))}
              </View>
            )}
            {/* Fallback: show any extra fields the AI returned that aren't displayed above */}
            {(() => {
              const knownKeys = new Set(['hearingLossDetected', 'severity', 'summary', 'explanation', 'whyHearingLoss', 'howAnalysis', 'thresholds', 'recommendations']);
              const extraEntries = Object.entries(analysis).filter(([k, v]) => {
                if (knownKeys.has(k)) return false;
                if (v === null || v === undefined) return false;
                if (Array.isArray(v) && v.length === 0) return false;
                if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v as object).length === 0) return false;
                return true;
              });
              if (extraEntries.length === 0) return null;
              return (
                <View>
                  {extraEntries.map(([key, value]) => (
                    <Text key={key} style={styles.detailsText}>
                      <Text style={styles.detailsLabel}>{key}: </Text>
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </Text>
                  ))}
                </View>
              );
            })()}
            {/* If absolutely nothing rendered, show a message */}
            {!analysis.explanation && !analysis.whyHearingLoss && !analysis.howAnalysis && !analysis.thresholds && !(analysis.recommendations?.length) &&
              Object.keys(analysis).filter(k => !['hearingLossDetected','severity','summary'].includes(k)).length === 0 && (
              <Text style={styles.detailsText}>No additional details available.</Text>
            )}
          </View>
        )}

        <Pressable 
          style={styles.readMoreButton}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.readMoreText}>
            {showDetails ? 'Show less' : 'Show more'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Download PDF</Text>
        </Pressable>
        <Pressable style={styles.pdfButton} onPress={() => router.push('/upload-audiogram')}>
          <Text style={styles.pdfButtonText}>Scan new audiogram</Text>
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
    fontSize: 36,
    fontFamily: 'AnekTamil_700Bold',
    marginBottom: 30,
    color: '#000',
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 240,
    height: 240,
    marginBottom: 30,
  },
  resultBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    borderLeftWidth: 0,
    maxWidth: 300,
  },
  resultText: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 20,
    color: '#333',
    lineHeight: 26,
    maxWidth: 300,
  },
  readMoreButton: {
    marginVertical: 15,
  },
  readMoreText: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 20,
    color: '#E31937',
    textDecorationLine: 'underline',
  },
  detailsBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginTop: 0,
    borderWidth: 0,
    maxWidth: 300,
  },
  detailsText: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 20,
    color: '#333',
    marginBottom: 12,
    lineHeight: 26,
  },
  detailsLabel: {
    fontFamily: 'AnekTamil_700Bold',
    fontSize: 20,
    color: '#E31937',
  },
  thresholdsBox: {
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  thresholdTable: {
    width: '100%',
  },
  thresholdRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  thresholdRowAlt: {
    backgroundColor: '#fdf0f2',
  },
  thresholdLabelCell: {
    width: 36,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#E31937',
    paddingVertical: 7,
  },
  thresholdHeaderCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#E31937',
    paddingVertical: 7,
  },
  thresholdEarCell: {
    width: 36,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 14,
    fontWeight: '700',
    color: '#E31937',
    paddingVertical: 9,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  thresholdValueCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 14,
    color: '#333',
    paddingVertical: 9,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  recommendationsBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  recommendationItem: {
    fontFamily: 'BarlowCondensed_400Regular',
    fontSize: 20,
    color: '#333',
    marginTop: 8,
    lineHeight: 26,
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
    gap: 12,
  },
  pdfButton: {
    backgroundColor: '#E31937',
    paddingVertical: 14,
    borderRadius: 25,
    width: 270,
  },
  pdfButtonText: {
    fontFamily: 'BarlowCondensed_400Regular',
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  scanButton: {
    paddingVertical: 14,
    borderRadius: 25,
    width: 270,
    borderWidth: 2,
    borderColor: '#E31937',
  },
  scanButtonText: {
    fontFamily: 'BarlowCondensed_400Regular',
    color: '#E31937',
    fontSize: 20,
    textAlign: 'center',
  },
});
