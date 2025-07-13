export interface CurrentTimeApiResponse {
  api: string;
  currentTime: string;
}

export interface SupabaseUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Message {
  ID: number;
  UserID: number;
  Text: string;
}

export interface Plan {
  userId: number;
  plan: string;
}

export interface RedisData {
  key: string;
  value: string;
}

export interface GrpcResponse {
  message: string;
}

export interface PubSubMessage {
  id: number;
  message: string;
  createdAt: string;
}

export interface KafkaMessage {
  message: string;
}

export interface KafkaResponse {
  messages: KafkaMessage[];
}

export interface MongoResponse {
  plans: Plan[];
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  credits: number;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

export interface ProcessImageRequest {
  imageUrl: string;
  operation: "remove-background" | "enhance" | "upscale";
  prompt?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  isAudio?: boolean;
}

// NEW LINE
export interface GenerateVideoRequest {
  prompt: string;
  image: File;
}

export interface GenerateImageRequest {
  prompt: string;
}

export interface RemoveBgResponse {
  success: boolean;
  image: {
    id: string;
    inputImageUrl: string;
    resultImageUrl: string;
  };
}

export interface CreateAudioRequest {
  topic: string;
  transcript: AudioTranscriptMessage[];
}
