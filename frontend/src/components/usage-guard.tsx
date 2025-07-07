import { ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Crown, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import {
  canUseFeature,
  getUsageText,
  getUsagePercentage,
  FEATURE_DESCRIPTIONS,
} from "@/lib/constants/usage-limits";

interface UsageGuardProps {
  children: ReactNode;
  feature: "imageProcessing" | "textToImage" | "audioChat" | "videoGeneration";
  action?: string; // e.g., "process this image", "generate this video"
}

export function UsageGuard({ children, feature, action }: UsageGuardProps) {
  const { user } = useUser();

  // Check user's subscription plan
  const userPlan = (user?.publicMetadata?.plan as string) || "free";
  const canUse = canUseFeature(feature, userPlan);
  const usageText = getUsageText(feature, userPlan);
  const usagePercentage = getUsagePercentage(feature, userPlan);
  const featureInfo = FEATURE_DESCRIPTIONS[feature];

  if (canUse) {
    return <>{children}</>;
  }

  return (
    <Card className="border-2 border-dashed border-muted-foreground/25">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Usage Limit Reached
        </CardTitle>
        <CardDescription>
          You've reached your monthly limit for {featureInfo.name.toLowerCase()}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{featureInfo.name}</span>
              <Badge
                variant="outline"
                className="text-amber-600 border-amber-200"
              >
                {usageText}
              </Badge>
            </div>
            <Progress value={usagePercentage} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">
              {featureInfo.description}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {action ? `To ${action}, ` : "To continue using this feature, "}
              upgrade to Pro for unlimited access.
            </p>

            <Link to="/pricing">
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>

            <p className="text-xs text-muted-foreground">
              Your usage resets on the 1st of each month
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
