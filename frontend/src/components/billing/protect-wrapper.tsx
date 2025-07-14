import { Protect } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { SubscriptionGuard } from "./subscription-guard";

interface ProtectWrapperProps {
  children: ReactNode;
  permission?: string;
  role?: string;
  fallback?: ReactNode;
  feature?: string;
  requiredPlan?: "pro" | "enterprise";
}

// Component to check if clerk user has access to app feature based on user plan
export function ProtectWrapper({
  children,
  permission,
  role,
  fallback,
  feature = "this feature",
  requiredPlan = "pro",
}: ProtectWrapperProps) {
  // If we have a permission or role, use Clerk's Protect component
  if (permission || role) {
    return (
      <Protect
        condition={(has) => {
          if (permission) return has({ permission });
          if (role) return has({ role });
          return false;
        }}
        fallback={
          fallback || (
            <SubscriptionGuard requiredPlan={requiredPlan} feature={feature}>
              {children}
            </SubscriptionGuard>
          )
        }
      >
        {children}
      </Protect>
    );
  }

  // Otherwise, use our custom subscription guard
  return (
    <SubscriptionGuard requiredPlan={requiredPlan} feature={feature}>
      {children}
    </SubscriptionGuard>
  );
}
