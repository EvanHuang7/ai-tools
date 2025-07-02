// Vapi-related type definitions
export interface TranscriptMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isPartial?: boolean;
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
}
