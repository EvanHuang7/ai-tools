import { ReactNode } from "react";
import { SubscriptionGuard } from "./subscription-guard";

interface ProtectWrapperProps {
  children: ReactNode;
  feature?: string;
  requiredPlan?: "Standard" | "Pro";
}

// Component to check if clerk user has access to app feature based on user plan
export function ProtectWrapper({
  children,
  feature = "this feature",
  requiredPlan = "Standard",
}: ProtectWrapperProps) {
  // Otherwise, use our custom subscription guard
  return (
    <SubscriptionGuard requiredPlan={requiredPlan} feature={feature}>
      {children}
    </SubscriptionGuard>
  );
}
