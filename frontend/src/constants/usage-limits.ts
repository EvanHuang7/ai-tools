// Usage limits for different subscription plans
export const USAGE_LIMITS = {
  free: {
    imageProcessing: 10, // Image editor operations per month
    textToImage: 10, // Text-to-image generations per month
    audioChat: 10, // Audio chat sessions per month (each session = 10 minutes max)
    videoGeneration: 10, // Video generations per month
  },
  pro: {
    imageProcessing: -1, // -1 means unlimited
    textToImage: -1,
    audioChat: -1,
    videoGeneration: -1,
  },
  enterprise: {
    imageProcessing: -1,
    textToImage: -1,
    audioChat: -1,
    videoGeneration: -1,
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

// Helper functions
export function getRemainingUsage(
  feature: keyof typeof USAGE_LIMITS.free,
  userPlan: string = "free",
  currentUsage: any = {}
) {
  const limits =
    USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.free;
  const limit = limits[feature];
  const used = currentUsage[feature] || 0;

  if (limit === -1) return -1; // Unlimited
  return Math.max(0, limit - used);
}

export function getUsagePercentage(
  feature: keyof typeof USAGE_LIMITS.free,
  userPlan: string = "free",
  currentUsage: any = {}
) {
  const limits =
    USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.free;
  const limit = limits[feature];
  const used = currentUsage[feature] || 0;

  if (limit === -1) return 100; // Unlimited shows as 100%
  return Math.min(100, (used / limit) * 100);
}

export function canUseFeature(
  feature: keyof typeof USAGE_LIMITS.free,
  userPlan: string = "free",
  currentUsage: any = {}
) {
  const remaining = getRemainingUsage(feature, userPlan, currentUsage);
  return remaining === -1 || remaining > 0;
}

export function getUsageText(
  feature: keyof typeof USAGE_LIMITS.free,
  userPlan: string = "free",
  currentUsage: any = {}
) {
  const limits =
    USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.free;
  const limit = limits[feature];
  const used = currentUsage[feature] || 0;

  if (limit === -1) return "Unlimited";
  return `${used}/${limit}`;
}
