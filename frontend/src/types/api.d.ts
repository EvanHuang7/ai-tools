export interface CurrentTimeApiResponse {
  api: string;
  currentTime: string;
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
