// Vapi Call status enum
export enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

// Vapi voice configuration
export const voices = {
  sarah: {
    friendly: "EXAVITQu4vr4xnSDxMaL",
    professional: "EXAVITQu4vr4xnSDxMaL",
    educational: "EXAVITQu4vr4xnSDxMaL",
    creative: "EXAVITQu4vr4xnSDxMaL",
    analytical: "EXAVITQu4vr4xnSDxMaL",
  },
  john: {
    friendly: "VR6AewLTigWG4xSOukaG",
    professional: "VR6AewLTigWG4xSOukaG",
    educational: "VR6AewLTigWG4xSOukaG",
    creative: "VR6AewLTigWG4xSOukaG",
    analytical: "VR6AewLTigWG4xSOukaG",
  },
  emma: {
    friendly: "ThT5KcBeYPX3keUQqHPh",
    professional: "ThT5KcBeYPX3keUQqHPh",
    educational: "ThT5KcBeYPX3keUQqHPh",
    creative: "ThT5KcBeYPX3keUQqHPh",
    analytical: "ThT5KcBeYPX3keUQqHPh",
  },
  alex: {
    friendly: "SOYHLrjzK2X1ezoPC6cr",
    professional: "SOYHLrjzK2X1ezoPC6cr",
    educational: "SOYHLrjzK2X1ezoPC6cr",
    creative: "SOYHLrjzK2X1ezoPC6cr",
    analytical: "SOYHLrjzK2X1ezoPC6cr",
  },
};

// Voice options for UI
export const voiceOptions = [
  {
    id: "sarah",
    name: "Sarah",
    description: "Warm, professional female voice",
  },
  { id: "john", name: "John", description: "Clear, confident male voice" },
  { id: "emma", name: "Emma", description: "British accent, articulate" },
  { id: "alex", name: "Alex", description: "Neutral, versatile voice" },
];

// Style options for UI
export const styleOptions = [
  {
    id: "friendly",
    name: "Friendly",
    description: "Casual and approachable conversation",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Business-like and formal tone",
  },
  {
    id: "educational",
    name: "Educational",
    description: "Teaching and explanatory style",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Imaginative and artistic discussions",
  },
  {
    id: "analytical",
    name: "Analytical",
    description: "Logical and detail-oriented approach",
  },
];
