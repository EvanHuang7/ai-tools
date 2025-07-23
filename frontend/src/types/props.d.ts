export interface AuthProtectedRouteProps {
  children: React.ReactNode;
}

export interface ClerkPricingTableProps {
  className?: string;
}

export interface FeatureGuardProps {
  children: ReactNode;
  feature?: string;
  requiredPlan?: "Standard" | "Pro";
}

export interface UsageGuardProps {
  children: ReactNode;
  feature: "imageEditing" | "imageGeneration" | "audioChat" | "videoGeneration";
  action?: string; // e.g., "process this image", "generate this video"
}

export interface UserPlanProviderProps {
  children: ReactNode;
}
