import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { voices } from "../constants/vapi";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCredits(credits: number): string {
  return new Intl.NumberFormat().format(credits);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// Vapi assistant configuration
export const configureAssistant = (
  voice: string,
  style: string,
  topic: string
) => {
  const voiceId =
    voices[voice as keyof typeof voices][
      style as keyof (typeof voices)[keyof typeof voices]
    ] || "EXAVITQu4vr4xnSDxMaL";

  const vapiAssistant = {
    name: "AI Companion",
    firstMessage: topic
      ? `Hello, let's start the session. Today we'll be talking about ${topic}.`
      : "Hello! I'm here to chat with you. What's on your mind today?",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable AI assistant having a real-time voice conversation with a user. Your goal is to engage in meaningful conversation about the given topic.

          Guidelines:
          ${
            topic
              ? `- Focus on the topic: ${topic}`
              : "- Discuss any topic the user brings up"
          }
          - Keep your conversation style ${style}
          - Keep the conversation flowing smoothly while maintaining control
          - Ask engaging follow-up questions to keep the user engaged
          - Keep your responses conversational and natural, like in a real voice conversation
          - Keep responses relatively short and to the point
          - Do not include any special characters in your responses - this is a voice conversation
          - Be helpful, informative, and engaging
          
          Remember: This is a voice conversation, so speak naturally and conversationally.`,
        },
      ],
    },
  };
  return vapiAssistant;
};
