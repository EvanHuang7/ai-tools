// Usage limits for different subscription plans
export const USAGE_LIMITS = {
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

// TODO: move to utils file
// Helper functions
export function getRemainingUsage(
  feature: keyof typeof USAGE_LIMITS.Free,
  userPlan: string = "Free",
  currentUsage: any = {}
) {
  const limits =
    USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.Free;
  const limit = limits[feature];
  const used = currentUsage[feature] || 0;

  return Math.max(0, limit - used);
}

export function getUsagePercentage(
  feature: keyof typeof USAGE_LIMITS.Free,
  userPlan: string = "Free",
  currentUsage: any = {}
) {
  const limits =
    USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.Free;
  const limit = limits[feature];
  const used = currentUsage[feature] || 0;

  return Math.min(100, (used / limit) * 100);
}

export function canUseFeature(
  feature: keyof typeof USAGE_LIMITS.Free,
  userPlan: string = "Free",
  currentUsage: any = {}
) {
  const remaining = getRemainingUsage(feature, userPlan, currentUsage);
  return remaining > 0;
}

export function getUsageText(
  feature: keyof typeof USAGE_LIMITS.Free,
  userPlan: string = "Free",
  currentUsage: any = {}
) {
  const limits =
    USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.Free;
  const limit = limits[feature];
  const used = currentUsage[feature] || 0;

  return `${used}/${limit}`;
}
