export interface InferenceResult {
  authenticityScore?: number;
  uncertainty?: number;
  evidence?: string[];
  latencyMs?: number;
  status: "pending" | "processing" | "completed" | "error" | "not_connected";
  error?: string;
}

/**
 * Placeholder client for the real Vaani Kavach AI Model API.
 * The real model will be connected in approximately 3 days.
 * 
 * DO NOT generate fake predictions. Just return standard "not_connected" states.
 */
export async function analyzeAudio(audioFile: File | Blob): Promise<InferenceResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    status: "not_connected",
    error: "Real AI model integration is in progress. API endpoint not yet available.",
  };
}
