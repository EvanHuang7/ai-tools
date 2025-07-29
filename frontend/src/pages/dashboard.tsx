import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useGetAppUsage } from "@/api";
import { useUserPlan } from "@/components/user-plan-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureGuard } from "@/components/feature-guard";
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
import { FEATURE_USAGE_LIMITS, QUICK_ACTIONS } from "@/constants";

export function Dashboard() {
  const { userPlan, isLoading: isPlanLoading } = useUserPlan();
  const { data: appUsage, isLoading: isLoadingUsage } = useGetAppUsage();

  // Convert app usage data to the format expected by helper functions
  const currentUsage = appUsage
    ? {
        imageEditing: appUsage.removeBgImageFeatureUsage || 0,
        imageGeneration: appUsage.imageFeatureUsage || 0,
        audioChat: appUsage.audioFeatureUsage || 0,
        videoGeneration: appUsage.videoFeatureUsage || 0,
      }
    : {};

  const stats = [
    {
      label: "Images Edited",
      value: `${currentUsage.imageEditing || 0}/${
        FEATURE_USAGE_LIMITS[userPlan as keyof typeof FEATURE_USAGE_LIMITS]
          ?.imageEditing || FEATURE_USAGE_LIMITS.Free.imageEditing
      }`,
      icon: Image,
    },
    {
      label: "Images Generated",
      value: `${currentUsage.imageGeneration || 0}/${
        FEATURE_USAGE_LIMITS[userPlan as keyof typeof FEATURE_USAGE_LIMITS]
          ?.imageGeneration || FEATURE_USAGE_LIMITS.Free.imageGeneration
      }`,
      icon: Wand2,
    },
    {
      label: "Videos Generated",
      value: `${currentUsage.videoGeneration || 0}/${
        FEATURE_USAGE_LIMITS[userPlan as keyof typeof FEATURE_USAGE_LIMITS]
          ?.videoGeneration || FEATURE_USAGE_LIMITS.Free.videoGeneration
      }`,
      icon: Video,
    },
    {
      label: "Audio Chats",
      value: `${currentUsage.audioChat || 0}/${
        FEATURE_USAGE_LIMITS[userPlan as keyof typeof FEATURE_USAGE_LIMITS]
          ?.audioChat || FEATURE_USAGE_LIMITS.Free.audioChat
      }`,
      icon: Mic,
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
                Here's how you've used your AI tools this month.
              </p>
            </div>

            {/* Stats Section */}
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
                      <CardTitle className="text-sm font-medium truncate">
                        {stat.label}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-8">
              {/* Quick Actions Section */}
              {isPlanLoading ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Jump into your favorite AI tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                      <Card key={index} className="h-full">
                        <CardContent className="p-4 h-full flex flex-col min-h-[180px] items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Jump into your favorite AI tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map((action, index) => (
                      <div key={index} className="relative">
                        {action.requiresStandardOrPro && userPlan === "Free" ? (
                          <FeatureGuard
                            feature={action.title}
                            requiredPlan="Standard"
                          >
                            <Link to={action.href}>
                              <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                                <CardContent className="p-4 h-full flex flex-col min-h-[180px]">
                                  <div
                                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                                  >
                                    <action.icon className="h-6 w-6 text-white" />
                                  </div>
                                  <h3 className="font-semibold mb-2 text-base">
                                    {action.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
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
                          </FeatureGuard>
                        ) : (
                          <Link to={action.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
                              <CardContent className="p-4 h-full flex flex-col min-h-[180px]">
                                <div className="flex items-center justify-between mb-4">
                                  <div
                                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}
                                  >
                                    <action.icon className="h-6 w-6 text-white" />
                                  </div>
                                  {action.requiresStandardOrPro && (
                                    <Badge
                                      variant="secondary"
                                      className="text-amber-600"
                                    >
                                      <Crown className="w-3 h-3 mr-1 flex lg:hidden" />
                                      Standard+
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="font-semibold mb-2 text-base">
                                  {action.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
