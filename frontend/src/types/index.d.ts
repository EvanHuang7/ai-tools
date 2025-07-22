export interface AudioTranscriptMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export type UserPlan = "Free" | "Standard" | "Pro";

export interface UserPlanContextType {
  userPlan: UserPlan;
  isLoading: boolean;
  refreshUserPlan: () => Promise<void>;
}
