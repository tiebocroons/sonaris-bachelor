/** Simple in-memory store to pass analysis data between screens without URL params. */
let pendingAnalysis: object | null = null;

export function setAnalysis(data: object) {
  pendingAnalysis = data;
}

export function getAnalysis(): object | null {
  return pendingAnalysis;
}

export function clearAnalysis() {
  pendingAnalysis = null;
}
