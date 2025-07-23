// Audio chat
export interface AudioTranscriptMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface StartAudioResponse {
  passUsageCheck: boolean;
  message: string;
}

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

export interface AudioItem {
  id: string;
  userId: string;
  topic: string;
  transcript: AudioTranscriptMessage[];
  createdAt: string;
  updatedAt: string;
}

export type ListAudiosResponse = AudioItem[];

// Remove image bg
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

export interface RemovedBgImage {
  id: string;
  inputImageUrl: string;
  resultImageUrl: string;
}

export type ListRemovedBgImagesResponse = RemovedBgImage[];

// Generate image
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

export interface Image {
  ID: number;
  UserID: string;
  Prompt: string;
  ImageURL: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export type ListImagesResponse = Image[];

// Generate video
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

export interface Video {
  ID: number;
  UserID: string;
  Prompt: string;
  ImageURL: string;
  VideoDuration: number;
  VideoURL: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export type ListVideosResponse = Video[];

// App usage
export interface GetAppUsageResponse {
  removeBgImageFeatureUsage: number;
  imageFeatureUsage: number;
  audioFeatureUsage: number;
  videoFeatureUsage: number;
}
