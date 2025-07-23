export interface CreateAudioRequest {
  topic: string;
  transcript: AudioTranscriptMessage[];
}

export interface CreateAudioResponse {
  id: string;
  userId: string;
  topic: string;
  transcript: AudioTranscriptMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ListAudiosResponse {
  id: string;
  userId: string;
  topic: string;
  transcript: AudioTranscriptMessage[];
  createdAt: string;
  updatedAt: string;
}
[];

export interface StartAudioResponse {
  passUsageCheck: boolean;
  message: string;
}

export interface RemoveBgRequest {
  image: File;
}

export interface RemoveBgResponse {
  success: boolean;
  image: {
    id: string;
    inputImageUrl: string;
    resultImageUrl: string;
  };
}

export interface ListRemovedBgImagesResponse {
  id: string;
  inputImageUrl: string;
  resultImageUrl: string;
}
[];

export interface GetAppUsageResponse {
  removeBgImageFeatureUsage: number;
  imageFeatureUsage: number;
  audioFeatureUsage: number;
  videoFeatureUsage: number;
}

export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateImageResponse {
  ID: number;
  UserID: string;
  Prompt: string;
  ImageURL: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ListImagesResponse {
  ID: number;
  UserID: string;
  Prompt: string;
  ImageURL: string;
  CreatedAt: string;
  UpdatedAt: string;
}
[];

export interface GenerateVideoRequest {
  prompt: string;
  image: File;
}

export interface GenerateVideoResponse {
  ID: number;
  UserID: string;
  Prompt: string;
  ImageURL: string;
  VideoDuration: number;
  VideoURL: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ListVideosResponse {
  ID: number;
  UserID: string;
  Prompt: string;
  ImageURL: string;
  VideoDuration: number;
  VideoURL: string;
  CreatedAt: string;
  UpdatedAt: string;
}
[];

export interface AudioTranscriptMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
