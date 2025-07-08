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
