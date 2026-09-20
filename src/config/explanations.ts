export interface ExplanationData {
  title: string;
  summary: string;
  details: string[];
  label: "IMPLEMENTED" | "SIMULATED" | "PROPOSED" | "DEMO-ONLY";
}

export const explanations: Record<string, ExplanationData> = {
  call: {
    title: "1. HOW VAANI KAVACH JOINS A CALL",
    summary: "Integration at multiple points in the communication stack.",
    details: [
      "Conference security bot (SIMULATED in this demo).",
      "Authorized enterprise VoIP streaming.",
      "Proposed telecom integration via APIs.",
    ],
    label: "SIMULATED",
  },
  processing: {
    title: "2. LIVE AUDIO PROCESSING",
    summary: "Capturing and normalizing audio streams in real-time.",
    details: [
      "Authorized audio input ingestion.",
      "Voice Activity Detection (VAD) to isolate speech segments.",
      "Sliding windows and streaming chunk management.",
    ],
    label: "IMPLEMENTED",
  },
  detection: {
    title: "3. MULTI-LAYER VOICE ANALYSIS",
    summary: "Evaluating voice authenticity for synthetic artifacts.",
    details: [
      "Acoustic and spectral detectors.",
      "SSL-based deep feature detectors and prosody analysis.",
      "Uncertainty handling for short bursts.",
    ],
    label: "IMPLEMENTED",
  },
  verification: {
    title: "4. CONTEXTUAL CALLER VERIFICATION",
    summary: "Checking external context beyond the Caller ID.",
    details: [
      "Demo institution registry lookup.",
      "Available origin evidence (e.g., STIR/SHAKEN).",
      "Note: A registry match does not equal authenticated call origin.",
    ],
    label: "SIMULATED",
  },
  risk: {
    title: "5. DYNAMIC RISK & VOICE CAPTCHA",
    summary: "Continuous assessment and step-up liveness checks.",
    details: [
      "Risk score dynamically updates over time.",
      "Suspicious bursts trigger Voice CAPTCHA.",
      "Independent verification of challenge-response pairs.",
    ],
    label: "IMPLEMENTED",
  },
  receipt: {
    title: "6. CRYPTOGRAPHIC RISK RECEIPT",
    summary: "Signed assessment payload associated with the intended transaction.",
    details: [
      "Contains Session ID, payee, amount, hash, timestamp, and expiry.",
      "Signed using HMAC-SHA256.",
    ],
    label: "PROPOSED",
  },
  payment: {
    title: "7. ACTION PROTECTION API",
    summary: "Transaction intercept and authorization.",
    details: [
      "Bank/Enterprise app verifies the receipt signature.",
      "API applies ALLOW, VERIFY, or BLOCK policies based on risk.",
    ],
    label: "SIMULATED",
  },
  privacy: {
    title: "8. PRIVACY AND DEPLOYMENT",
    summary: "Flexible and secure deployment options.",
    details: [
      "Data minimization and strict audio retention policies.",
      "Authenticated integrations for enterprise deployment.",
    ],
    label: "DEMO-ONLY",
  }
};
