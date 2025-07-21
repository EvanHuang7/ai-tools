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
