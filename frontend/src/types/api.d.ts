export interface CreateAudioRequest {
  topic: string;
  transcript: AudioTranscriptMessage[];
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

export interface GenerateImageRequest {
  prompt: string;
}

export interface GenerateVideoRequest {
  prompt: string;
  image: File;
}
