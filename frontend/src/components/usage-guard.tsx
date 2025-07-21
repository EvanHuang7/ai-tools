import { ReactNode } from "react";
import { useGetAppUsage } from "@/api/imageRemoveBg/imageRmBg.queries";
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
import { Progress } from "@/components/ui/progress";
import { Crown, Lock, Zap, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  hasRemainingUsage,
  getUsageText,
  getUsagePercentage,
} from "@/lib/utils";
import { USAGE_GUARD_FEATURE_DESCRIPTIONS } from "@/constants";
import { UsageGuardProps } from "@/types/props";

// Component to lock the app feature by checking app feature usage and limit
export function UsageGuard({ children, feature, action }: UsageGuardProps) {
  const { userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: appUsage, isLoading: isLoadingUsage } = useGetAppUsage();

  // Convert app usage data to the format expected by helper functions
  const currentUsage = appUsage
    ? {
        imageProcessing: appUsage.removeBgImageFeatureUsage || 0,
        textToImage: appUsage.imageFeatureUsage || 0,
        audioChat: appUsage.audioFeatureUsage || 0,
        videoGeneration: appUsage.videoFeatureUsage || 0,
      }
    : {};

  const canUse = hasRemainingUsage(feature, userPlan, currentUsage);
  const usageText = getUsageText(feature, userPlan, currentUsage);
  const usagePercentage = getUsagePercentage(feature, userPlan, currentUsage);
  const featureInfo = USAGE_GUARD_FEATURE_DESCRIPTIONS[feature];

  // Show loading state while fetching usage data
  if (isLoadingUsage || isPlanLoading) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span className="text-muted-foreground">Loading usage data...</span>
        </CardContent>
      </Card>
    );
  }

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
              upgrade your plan for higher limits.
            </p>

            <Link to="/pricing">
              <Button className="w-full">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
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
