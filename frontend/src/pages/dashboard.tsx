import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useGetAppUsage } from "@/api/imageRemoveBg/imageRmBg.queries";
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
import { ProtectWrapper } from "@/components/billing/protect-wrapper";
import { useUser } from "@clerk/clerk-react";
import {
  Image,
  Wand2,
  Video,
  Mic,
  Clock,
  Zap,
  ArrowRight,
  Crown,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getUsageText, getUsagePercentage } from "@/constants/usage-limits";

export function Dashboard() {
  const { user } = useUser();
  const { data: appUsage, isLoading: isLoadingUsage } = useGetAppUsage();

  // Check if user has pro subscription using publicMetadata
  const userPlan = (user?.publicMetadata?.plan as string) || "free";
  const hasPro = userPlan === "pro" || userPlan === "enterprise";

  // Convert app usage data to the format expected by helper functions
  const currentUsage = appUsage
    ? {
        imageProcessing:
          appUsage.appFeaturesUsage.removeBgImageFeatureUsage || 0,
        textToImage: appUsage.appFeaturesUsage.imageFeatureUsage || 0,
        audioChat: appUsage.appFeaturesUsage.audioFeatureUsage || 0,
        videoGeneration: appUsage.appFeaturesUsage.videoFeatureUsage || 0,
      }
    : {};

  const stats = [
    {
      label: "Images Processed",
      value: currentUsage.imageProcessing?.toString() || "0",
      icon: Image,
      change: "+12%",
    },
    {
      label: "Images Generated",
      value: currentUsage.textToImage?.toString() || "0",
      icon: Wand2,
      change: "+35%",
    },
    {
      label: "Videos Generated",
      value: currentUsage.videoGeneration?.toString() || "0",
      icon: Video,
      change: "+25%",
    },
    {
      label: "Audio Chats",
      value: currentUsage.audioChat?.toString() || "0",
      icon: Mic,
      change: "+8%",
    },
  ];

  const recentActivity = [
    {
      type: "image",
      title: "Background removed from portrait.jpg",
      time: "2 hours ago",
    },
    {
      type: "generate",
      title: 'Generated "sunset mountain landscape"',
      time: "3 hours ago",
    },
    { type: "audio", title: "Voice chat session completed", time: "1 day ago" },
    {
      type: "video",
      title: "Generated video from landscape.png",
      time: "4 hours ago",
    },
  ];

  const quickActions = [
    {
      title: "Edit Images",
      description: "Remove backgrounds, enhance quality",
      icon: Image,
      href: "/image-editor",
      color: "bg-blue-500",
      requiresPro: false,
    },
    {
      title: "Generate Images",
      description: "Create images from text descriptions",
      icon: Wand2,
      href: "/text-to-image",
      color: "bg-emerald-500",
      requiresPro: false,
    },
    {
      title: "Voice Chat",
      description: "Talk with AI assistant",
      icon: Mic,
      href: "/audio-chat",
      color: "bg-green-500",
      requiresPro: true,
    },
    {
      title: "Generate Videos",
      description: "Create videos from your images",
      icon: Video,
      href: "/video-generator",
      color: "bg-purple-500",
      requiresPro: true,
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
              <h1 className="text-3xl font-bold mb-2">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your AI tools today.
              </p>
            </div>

            {/* Stats Grid */}
            {isLoadingUsage ? (
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
                      <p className="text-xs text-muted-foreground">
                        This month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Jump into your favorite AI tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <div key={index} className="relative">
                        {action.requiresPro && !hasPro ? (
                          <ProtectWrapper
                            permission="subscription:pro"
                            feature={action.title}
                            requiredPlan="pro"
                          >
                            <Link to={action.href}>
                              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                                <CardContent className="p-6">
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
                                    className="p-0 h-auto"
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
                              <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div
                                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                                  >
                                    <action.icon className="h-6 w-6 text-white" />
                                  </div>
                                  {action.requiresPro && (
                                    <Badge
                                      variant="secondary"
                                      className="text-amber-600"
                                    >
                                      <Crown className="w-3 h-3 mr-1" />
                                      Pro
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
                                  className="p-0 h-auto"
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

                {/* Usage Overview */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Usage Overview</CardTitle>
                    <CardDescription>
                      Your activity over the past 30 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingUsage ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span className="text-muted-foreground">
                          Loading usage data...
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Image Processing
                            </span>
                            <span className="text-sm text-muted-foreground">
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
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Text to Image
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {getUsageText(
                                "textToImage",
                                userPlan,
                                currentUsage
                              )}
                            </span>
                          </div>
                          <Progress
                            value={getUsagePercentage(
                              "textToImage",
                              userPlan,
                              currentUsage
                            )}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Audio Chat Sessions
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {getUsageText(
                                "audioChat",
                                userPlan,
                                currentUsage
                              )}
                            </span>
                          </div>
                          <Progress
                            value={getUsagePercentage(
                              "audioChat",
                              userPlan,
                              currentUsage
                            )}
                            className="h-2"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Video Generation
                            </span>
                            <span className="text-sm text-muted-foreground">
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
                            className="h-2"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest AI tool usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {activity.type === "image" && (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Image className="h-4 w-4 text-blue-600" />
                              </div>
                            )}
                            {activity.type === "generate" && (
                              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                <Wand2 className="h-4 w-4 text-emerald-600" />
                              </div>
                            )}
                            {activity.type === "video" && (
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Video className="h-4 w-4 text-purple-600" />
                              </div>
                            )}
                            {activity.type === "audio" && (
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Mic className="h-4 w-4 text-green-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upgrade Prompt - Only show if not Pro */}
                {!hasPro && (
                  <Card className="mt-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        Upgrade to Pro
                      </CardTitle>
                      <CardDescription>
                        Get unlimited credits and premium features
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Unlimited image processing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Unlimited text-to-image generation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Unlimited audio chat sessions
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Unlimited video generation
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Priority support
                        </li>
                      </ul>
                      <Link to="/pricing">
                        <Button className="w-full">Upgrade Now</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}

                {/* Pro Status Card - Show if Pro */}
                {hasPro && (
                  <Card className="mt-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-800">
                        <Crown className="h-5 w-5" />
                        Pro Member
                      </CardTitle>
                      <CardDescription className="text-amber-700">
                        You have access to all premium features
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-4 text-sm text-amber-800">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          Unlimited usage on all features
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          Priority processing
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          Premium support
                        </li>
                      </ul>
                      <Button
                        variant="outline"
                        className="w-full border-amber-300 text-amber-800 hover:bg-amber-200"
                        onClick={() => {
                          // This will open Clerk's user profile which includes billing management
                          const {
                            openUserProfile,
                          } = require("@clerk/clerk-react");
                          openUserProfile();
                        }}
                      >
                        Manage Account
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
