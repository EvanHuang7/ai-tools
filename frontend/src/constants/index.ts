import {
  LayoutDashboard,
  Image,
  Wand2,
  Video,
  Mic,
  DollarSign,
} from "lucide-react";

// App features usage limits for different subscription plans
export const FEATURE_USAGE_LIMITS = {
  Free: {
    imageProcessing: 5, // Image editor operations per month
    textToImage: 2, // Text-to-image generations per month
    audioChat: 3, // Audio chat sessions per month (each session = 10 minutes max)
    videoGeneration: 0, // Video generations per month
  },
  Standard: {
    imageProcessing: 10,
    textToImage: 3,
    audioChat: 5,
    videoGeneration: 1,
  },
  Pro: {
    imageProcessing: 20,
    textToImage: 5,
    audioChat: 10,
    videoGeneration: 2,
  },
} as const;

// Feature descriptions for UI
export const FEATURE_DESCRIPTIONS = {
  imageProcessing: {
    name: "Image Processing",
    description: "Background removal, enhancement, and editing operations",
    icon: "Image",
  },
  textToImage: {
    name: "Text to Image",
    description: "AI-powered image generation from text prompts",
    icon: "Wand2",
  },
  audioChat: {
    name: "Audio Chat",
    description: "Voice conversations with AI assistant (10 min sessions)",
    icon: "Mic",
  },
  videoGeneration: {
    name: "Video Generation",
    description: "Create videos from images using AI animation",
    icon: "Video",
  },
} as const;

// Progress stages for image editor
export const IMAGE_EDITOR_PROGRESS_STAGES = [
  { progress: 15, stage: "Uploading image..." },
  { progress: 30, stage: "Analyzing image content..." },
  { progress: 50, stage: "Detecting background..." },
  { progress: 70, stage: "Removing background..." },
  { progress: 85, stage: "Optimizing edges..." },
  { progress: 95, stage: "Finalizing image..." },
];

// Progress stages for image generator
export const IMAGE_GENERATOR_PROGRESS_STAGES = [
  { progress: 15, stage: "Processing prompt..." },
  { progress: 30, stage: "Analyzing style preferences..." },
  { progress: 50, stage: "Generating image composition..." },
  { progress: 70, stage: "Adding details and textures..." },
  { progress: 85, stage: "Applying final touches..." },
  { progress: 95, stage: "Optimizing image quality..." },
];

// Progress stages for video generator
export const VIDEO_GENERATOR_PROGRESS_STAGES = [
  { progress: 10, stage: "Uploading image..." },
  { progress: 20, stage: "Analyzing image content..." },
  { progress: 30, stage: "Processing AI prompt..." },
  { progress: 45, stage: "Generating video frames..." },
  { progress: 60, stage: "Creating animations..." },
  { progress: 75, stage: "Rendering video..." },
  { progress: 85, stage: "Optimizing quality..." },
  { progress: 95, stage: "Finalizing video..." },
];

// Side bar navigation
export const SIDE_BAR_NAVIGATION = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Image Editor", href: "/image-editor", icon: Image },
  { name: "Text to Image", href: "/text-to-image", icon: Wand2 },
  { name: "Audio Chat", href: "/audio-chat", icon: Mic },
  { name: "Video Generator", href: "/video-generator", icon: Video },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
];
