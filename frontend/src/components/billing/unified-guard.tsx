import { ReactNode } from "react";
import { useUserPlan } from "@/contexts/UserPlanContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface UnifiedGuardProps {
  children: ReactNode;
  feature?: string;
  requiredPlan?: "Standard" | "Pro";
}

// Unified component that combines ProtectWrapper and SubscriptionGuard functionality
export function UnifiedGuard({
  children,
  feature = "this feature",
  requiredPlan = "Standard",
}: UnifiedGuardProps) {
  const { userPlan } = useUserPlan();

  // Check if user has the required subscription
  const hasRequiredPlan =
    userPlan === requiredPlan ||
    (requiredPlan === "Standard" && userPlan === "Pro");

  if (!hasRequiredPlan) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            {requiredPlan} Feature
          </CardTitle>
          <CardDescription>
            Upgrade to {requiredPlan} to access {feature}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-4">
            <Badge
              variant="outline"
              className="text-amber-600 border-amber-200"
            >
              {requiredPlan} Plan Required
            </Badge>
            <p className="text-sm text-muted-foreground">
              This feature is available for {requiredPlan} subscribers only.
            </p>
            <Link to="/pricing">
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
