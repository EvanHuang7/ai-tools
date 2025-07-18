import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
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
import { ProtectWrapper } from "@/components/billing/protect-wrapper";
import {
  Image,
  Wand2,
  Video,
  Mic,
  ArrowRight,
  Crown,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { USAGE_LIMITS } from "@/constants/usage-limits";

export function Dashboard() {
  const { userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: appUsage, isLoading: isLoadingUsage } = useGetAppUsage();

  // Check if user has pro subscription
  const hasPro = userPlan === "Pro";

  // Convert app usage data to the format expected by helper functions
  const currentUsage = appUsage
    ? {
        imageProcessing: appUsage.removeBgImageFeatureUsage || 0,
        textToImage: appUsage.imageFeatureUsage || 0,
        audioChat: appUsage.audioFeatureUsage || 0,
        videoGeneration: appUsage.videoFeatureUsage || 0,
      }
    : {};

  const stats = [
    {
      label: "Images Processed",
      value: `${currentUsage.imageProcessing || 0}/${
        USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS]?.imageProcessing ||
        USAGE_LIMITS.Free.imageProcessing
      }`,
      icon: Image,
    },
    {
      label: "Images Generated",
      value: `${currentUsage.textToImage || 0}/${
        USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS]?.textToImage ||
        USAGE_LIMITS.Free.textToImage
      }`,
      icon: Wand2,
    },
    {
      label: "Videos Generated",
      value: `${currentUsage.videoGeneration || 0}/${
        USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS]?.videoGeneration ||
        USAGE_LIMITS.Free.videoGeneration
      }`,
      icon: Video,
    },
    {
      label: "Audio Chats",
      value: `${currentUsage.audioChat || 0}/${
        USAGE_LIMITS[userPlan as keyof typeof USAGE_LIMITS]?.audioChat ||
        USAGE_LIMITS.Free.audioChat
      }`,
      icon: Mic,
    },
  ];

  const quickActions = [
    {
      title: "Edit Images",
      description: "Remove backgrounds, enhance quality",
      icon: Image,
      href: "/image-editor",
      color: "bg-blue-500",
      requiresStandardOrPro: false,
    },
    {
      title: "Generate Images",
      description: "Create images from text descriptions",
      icon: Wand2,
      href: "/text-to-image",
      color: "bg-emerald-500",
      requiresStandardOrPro: false,
    },
    {
      title: "Voice Chat",
      description: "Talk with AI assistant",
      icon: Mic,
      href: "/audio-chat",
      color: "bg-green-500",
      requiresStandardOrPro: false,
    },
    {
      title: "Generate Videos",
      description: "Create videos from your images",
      icon: Video,
      href: "/video-generator",
      color: "bg-purple-500",
      requiresStandardOrPro: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
              <p className="text-muted-foreground">
                Here's feature usages with your AI tools this month.
              </p>
            </div>

            {/* Stats Grid */}
            {isLoadingUsage || isPlanLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.label}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8">
              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Jump into your favorite AI tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <div key={index} className="relative">
                        {action.requiresStandardOrPro && userPlan === "Free" ? (
                          <ProtectWrapper
                            feature={action.title}
                            requiredPlan="Standard"
                          >
                            <Link to={action.href}>
                              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-4 h-full flex flex-col">
                                  <div
                                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                  >
                                    <action.icon className="h-6 w-6 text-white" />
                                  </div>
                                  <h3 className="font-semibold mb-2">
                                    {action.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {action.description}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-0 h-auto mt-auto"
                                  >
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </CardContent>
                              </Card>
                            </Link>
                          </ProtectWrapper>
                        ) : (
                          <Link to={action.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                              <CardContent className="p-4 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-4">
                                  <div
                                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                  >
                                    <action.icon className="h-6 w-6 text-white" />
                                  </div>
                                  {action.requiresStandardOrPro && (
                                    <Badge
                                      variant="secondary"
                                      className="text-amber-600"
                                    >
                                      <Crown className="w-3 h-3 mr-1" />
                                      Standard+
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold mb-2">
                                  {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {action.description}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0 h-auto mt-auto"
                                >
                                  Get Started
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          </Link>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
