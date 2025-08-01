import {
  LayoutDashboard,
  Image,
  Wand2,
  Video,
  Mic,
  DollarSign,
  Sparkles,
  Play,
  MessageCircle,
} from "lucide-react";

// App features usage limits for different subscription plans
export const FEATURE_USAGE_LIMITS = {
  Free: {
    imageEditing: 5, // Image editor operations per month
    imageGeneration: 2, // Image generator operations per month
    audioChat: 3, // Audio or Voice chat sessions per month (each session = 10 minutes max)
    videoGeneration: 0, // Video generations per month
  },
  Standard: {
    imageEditing: 10,
    imageGeneration: 3,
    audioChat: 5,
    videoGeneration: 1,
  },
  Pro: {
    imageEditing: 20,
    imageGeneration: 5,
    audioChat: 10,
    videoGeneration: 2,
  },
} as const;

// Usage Guard component feature descriptions
export const USAGE_GUARD_FEATURE_DESCRIPTIONS = {
  imageEditing: {
    name: "Image Editing",
    description: "Background removal, enhancement, and editing operations",
    icon: "Image",
  },
  imageGeneration: {
    name: "Image Generation",
    description: "AI-powered image generation from text prompts",
    icon: "Wand2",
  },
  audioChat: {
    name: "Voice Chat",
    description: "Voice conversations with AI assistant",
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
  { name: "Image Generator", href: "/image-generator", icon: Wand2 },
  { name: "Voice Chat", href: "/audio-chat", icon: Mic },
  { name: "Video Generator", href: "/video-generator", icon: Video },
  { name: "Pricing", href: "/pricing", icon: DollarSign },
];

// Home page feature description
export const HOME_PAGE_FEATURES = [
  {
    icon: Image,
    title: "AI Image Editor",
    description:
      "Remove backgrounds, enhance quality, and transform images with AI",
    features: [
      "Background Removal",
      "Image Enhancement",
      "Object Removal",
      "Style Transfer",
    ],
    buttonGradient: "from-purple-500 to-pink-600",
    buttonText: "See Editing Magic",
    buttonIcon: Wand2,
    example: {
      originalImageUrl:
        "https://ik.imagekit.io/9irwmbrzl/ai-generated-3_TvnO858Py.png",
      editedImageUrl:
        "https://ik.imagekit.io/9irwmbrzl/bg_removed_ai-generated-3_CBaH8yOxp.png",
    },
  },
  {
    icon: Wand2,
    title: "Image Generator",
    description: "Generate stunning images from text prompts using AI",
    features: [
      "Text to Image",
      "Multiple Styles",
      "High Resolution",
      "Custom Prompts",
    ],
    buttonGradient: "from-blue-500 to-cyan-600",
    buttonText: "View AI Artwork",
    buttonIcon: Sparkles,
    example: {
      prompt: "Generate a fancy red Chevrolet C7 Corvette car image",
      imageUrl:
        "https://ik.imagekit.io/fmxhbshza/generated_20250711_062433_GVJSwqLyM.jpg",
    },
  },
  {
    icon: Video,
    title: "Video Generator",
    description:
      "Create stunning videos from images using AI-powered animation",
    features: [
      "Image to Video",
      "Custom Prompts",
      "Multiple Styles",
      "HD Export",
    ],
    buttonGradient: "from-green-500 to-emerald-600",
    buttonText: "Watch AI Video",
    buttonIcon: Play,
    example: {
      prompt:
        "Create a video of a Samoyed running towards a Golden Retriever in the park, and they play with the tennis ball on the ground.",
      imageUrl:
        "https://storage.googleapis.com/ai-tools-gcs-bucket/images/dog-in-park_20250730_200108.jpg",
      videoURL:
        "https://storage.googleapis.com/ai-tools-gcs-bucket/videos/dog-in-park_20250730_200108_generated_video.mp4",
    },
  },
  {
    icon: Mic,
    title: "AI Voice Chat",
    description:
      "Engage in natural conversations with AI using voice recognition",
    features: [
      "Voice Recognition",
      "Natural Speech",
      "Real-time Chat",
      "Multiple Voices",
    ],
    buttonGradient: "from-orange-500 to-red-600",
    buttonText: "See Conversation",
    buttonIcon: MessageCircle,
    example: {
      topic: "how to sleep well",
      transcript: [
        {
          role: "assistant",
          content:
            "Hello. Let's start the session. Today, we'll be talking about how to sleep well.",
        },
        { role: "user", content: "Sure. Let's talk about that." },
        {
          role: "assistant",
          content:
            "Great. So tell me, do you usually feel well rested when you wake up, or is sleep something you struggle with?",
        },
        {
          role: "user",
          content: "I feel like sometime it's hard to sleep into at night.",
        },
        {
          role: "assistant",
          content:
            "I hear you. That can be really frustrating. Do you find it hard to fall asleep because your mind is racing? Racing or is it more about not feeling tired enough?",
        },
        {
          role: "user",
          content:
            "Maybe not a few tired enough. So I always thinking about something else.",
        },
        {
          role: "assistant",
          content:
            "That's really common. Sometimes your brain just doesn't wanna shut off. Have you ever tried relaxing techniques before bed like deep breathing or maybe journaling to get those thoughts out?",
        },
        {
          role: "user",
          content: "Yeah. I try try to relax my mind, but doesn't work.",
        },
        {
          role: "assistant",
          content:
            "That's tough when it doesn't work. Have you checked if your environment might be making it harder to relax? Like is your room dark and quiet enough or maybe distractions like screens could be affecting you?",
        },
        {
          role: "user",
          content: "So you mean turn off the light or something else?",
        },
        {
          role: "assistant",
          content:
            "Exactly. Keeping your room dark helps your brain know it's time to sleep, Also, limiting screen time before bed can make a big difference. Screens can mess with the sleep hormones. Ever tried putting your phone away an hour before bed?",
        },
        { role: "user", content: "Mhmm. It's good idea. Facts." },
        {
          role: "assistant",
          content:
            "Yeah. It can work wonders. You might also try creating a bedtime routine. Something calming like reading or stretching to signal to your body it's time to wind down. Are you someone who likes routines?",
        },
        { role: "user", content: "I'm good. Thanks." },
        {
          role: "assistant",
          content:
            "You're welcome. If you ever want more tips or just a chat, let me know. Sleep well.",
        },
      ],
    },
  },
];

// Home page app user reviews
export const APP_USER_REVIEWS = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content:
      "This platform has revolutionized my workflow. The AI tools are incredibly powerful and easy to use.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Marketing Director",
    content:
      "The video generation feature saves us hours of work. Quality is outstanding.",
    rating: 5,
  },
  {
    name: "Emily Davis",
    role: "Designer",
    content:
      "Best AI image editor I've used. The background removal is flawless.",
    rating: 5,
  },
];

// Dashboard page quick actions
export const QUICK_ACTIONS = [
  {
    title: "Edit Images",
    description: "Remove backgrounds, enhance quality",
    icon: Image,
    href: "/image-editor",
    color: "bg-blue-500",
    requiresStandardOrPro: false,
  },
  {
    title: "Generate Images",
    description: "Create images from text descriptions",
    icon: Wand2,
    href: "/image-generator",
    color: "bg-emerald-500",
    requiresStandardOrPro: false,
  },
  {
    title: "Voice Chat",
    description: "Talk with AI assistant",
    icon: Mic,
    href: "/audio-chat",
    color: "bg-green-500",
    requiresStandardOrPro: false,
  },
  {
    title: "Generate Videos",
    description: "Create videos from your images",
    icon: Video,
    href: "/video-generator",
    color: "bg-purple-500",
    requiresStandardOrPro: true,
  },
];

// Pricing page faqs
export const FAQS = [
  {
    question: "How do user plans and usage limits work?",
    answer:
      "Our app uses tiered user plans (Free, Standard, and Pro), each with its own limits for different features. Higher-tier plans unlock increased usage and access to advanced tools. You can upgrade at any time based on your needs.",
  },
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "No, we currently do not offer a free trial for paid plans.",
  },
];
