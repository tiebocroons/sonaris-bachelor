/** Simple in-memory store to pass analysis data between screens without URL params. */

export interface AnalysisData {
  hearingLossDetected: boolean;
  isAudiogram?: boolean;
  severity: string;
  summary: string;
  explanation?: string;
  whyHearingLoss?: string;
  howAnalysis?: string;
  thresholds?: Record<string, number>;
  recommendations?: string[];
  [key: string]: unknown;
}

let pendingAnalysis: AnalysisData | null = null;

export function setAnalysis(data: AnalysisData) {
  pendingAnalysis = data;
}

export function getAnalysis(): AnalysisData | null {
  return pendingAnalysis;
}

export function clearAnalysis() {
  pendingAnalysis = null;
}
