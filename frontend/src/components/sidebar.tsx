import { Link, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useGetAppUsage } from "@/api/imageRemoveBg/imageRmBg.queries";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  Image,
  Wand2,
  Video,
  Mic,
  Settings,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { getUsageText, getUsagePercentage } from "@/constants/usage-limits";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Image Editor", href: "/image-editor", icon: Image },
  { name: "Text to Image", href: "/text-to-image", icon: Wand2 },
  { name: "Audio Chat", href: "/audio-chat", icon: Mic },
  { name: "Video Generator", href: "/video-generator", icon: Video },
];

export function Sidebar() {
  const location = useLocation();
  const { openUserProfile } = useClerk();
  const { user } = useUser();
  const { data: appUsage, isLoading: isLoadingUsage } = useGetAppUsage();

  // Check user's subscription plan
  const userPlan = (user?.publicMetadata?.plan as string) || "free";
  const hasPro = userPlan === "pro" || userPlan === "enterprise";

  // Convert app usage data to the format expected by helper functions
  const currentUsage = appUsage
    ? {
        imageProcessing: appUsage.removeBgImageCount || 0,
        textToImage: appUsage.textToImageCount || 0,
        audioChat: appUsage.audioChatCount || 0,
        videoGeneration: appUsage.videoGenerationCount || 0,
      }
    : {};

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-3">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Usage</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  hasPro ? "bg-amber-100 text-amber-800 border-amber-200" : ""
                )}
              >
                {hasPro ? "Pro Plan" : "Free Plan"}
              </Badge>
            </div>

            {isLoadingUsage ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-xs text-muted-foreground">
                  Loading...
                </span>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Images</span>
                      <span>
                        {getUsageText(
                          "imageProcessing",
                          userPlan,
                          currentUsage
                        )}
                      </span>
                    </div>
                    <Progress
                      value={getUsagePercentage(
                        "imageProcessing",
                        userPlan,
                        currentUsage
                      )}
                      className="h-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        Text-to-Image
                      </span>
                      <span>
                        {getUsageText("textToImage", userPlan, currentUsage)}
                      </span>
                    </div>
                    <Progress
                      value={getUsagePercentage(
                        "textToImage",
                        userPlan,
                        currentUsage
                      )}
                      className="h-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Audio Chat</span>
                      <span>
                        {getUsageText("audioChat", userPlan, currentUsage)}
                      </span>
                    </div>
                    <Progress
                      value={getUsagePercentage(
                        "audioChat",
                        userPlan,
                        currentUsage
                      )}
                      className="h-1"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Video Gen</span>
                      <span>
                        {getUsageText(
                          "videoGeneration",
                          userPlan,
                          currentUsage
                        )}
                      </span>
                    </div>
                    <Progress
                      value={getUsagePercentage(
                        "videoGeneration",
                        userPlan,
                        currentUsage
                      )}
                      className="h-1"
                    />
                  </div>
                </div>

                {!hasPro && (
                  <>
                    <p className="text-xs text-muted-foreground mb-3">
                      Upgrade to Pro for unlimited usage
                    </p>
                    <Button size="sm" className="w-full">
                      Upgrade Plan
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border p-3">
        <nav className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => openUserProfile()}
          >
            <Settings className="mr-3 h-4 w-4" />
            Account Settings
            <ExternalLink className="ml-auto h-3 w-3" />
          </Button>
        </nav>
      </div>
    </div>
  );
}
