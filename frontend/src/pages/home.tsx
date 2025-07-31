import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Image,
  Video,
  Sparkles,
  Zap,
  Users,
  Check,
  Star,
  Eye,
  User,
  Bot,
  Grid3X3,
  EyeOff,
  Download,
  ExternalLink,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { HOME_PAGE_FEATURES, APP_USER_REVIEWS } from "@/constants";

export function HomePage() {
  const { isLoaded, isSignedIn } = useAuth();

  // Modal state for viewing examples
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const handleViewExample = (feature: any) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
  };

  const downloadExampleImage = async (exampleImageUrl: string) => {
    if (!exampleImageUrl) return;

    try {
      const response = await fetch(exampleImageUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Failed to fetch example image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `example-image-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Example image downloaded!");
    } catch (error) {
      console.error("Error downloading example image:", error);
      toast.error("Failed to download example image");
    }
  };

  const openExampleItemInNewTab = (url: string) => {
    if (!url) return;

    window.open(url, "_blank");
    toast.success(
      "Example image or video opened in a new tab. Right-click to save."
    );
  };

  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    toast.success("Prompt copied to clipboard!");
  };

  const gridPattern = `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='gray' stroke-width='0.5'/%3e%3c/pattern%3e%3cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3e%3crect width='80' height='80' fill='url(%23smallGrid)'/%3e%3cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='gray' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="h-3 w-3 mr-1 flex-shrink-0" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              Transform Your Creative Workflow with AI
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Professional AI-powered tools for image editing, image and video
              generation, and intelligent conversation. Create stunning content
              in seconds — not hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8">
                    Start Creating Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link to="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className={`text-lg px-8 ${
                    isSignedIn ? "min-w-[232px]" : "min-w-[250px]"
                  }`}
                >
                  View Pricing
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>5K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 flex-shrink-0" />
                <span>10k+ Images Generated & Edited</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 flex-shrink-0" />
                <span>2K+ Videos Generated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Powerful AI Tools for Every Creator
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to create professional content with the power
              of artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOME_PAGE_FEATURES.map((feature, index) => {
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-2 hover:border-primary/30 bg-white/90 backdrop-blur-sm relative overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-indigo-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardHeader className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500" />
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-100 transition-colors"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        AI Powered
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-slate-900 group-hover:text-blue-900 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 h-[50px] md:h-[80px] group-hover:text-slate-700 transition-colors">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col relative z-10">
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 text-sm text-slate-600 group-hover:text-slate-700 transition-colors"
                        >
                          <div className="flex-shrink-0">
                            <Check className="h-4 w-4 text-green-600 group-hover:text-green-700 transition-colors" />
                          </div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Button
                        onClick={() => handleViewExample(feature)}
                        className={`w-full bg-gradient-to-r ${feature.buttonGradient} hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 group-hover:scale-105 text-white border-0`}
                        size="sm"
                      >
                        <feature.buttonIcon className="h-4 w-4 mr-2" />
                        {feature.buttonText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
              Loved by Creators Worldwide
            </h2>
            <p className="text-xl text-slate-600">
              See what our users are saying about AI Tools Studio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {APP_USER_REVIEWS.map((testimonial, index) => (
              <Card
                key={index}
                className="group text-center bg-white/90 backdrop-blur-sm hover:bg-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-2 hover:border-yellow-200 relative overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/20 to-amber-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Floating sparkle effect */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </div>

                <CardHeader>
                  <div className="flex justify-center mb-4 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300"
                        style={{
                          transitionDelay: `${i * 50}ms`,
                          animation: `pulse 2s infinite ${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic text-slate-700 group-hover:text-slate-800 transition-colors duration-300 relative z-10 leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="font-semibold text-slate-900 group-hover:text-slate-950 transition-colors duration-300">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors duration-300">
                    {testimonial.role}
                  </div>

                  {/* Animated bottom accent */}
                  <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500 rounded-full mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Creative Process?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of creators who are already using AI Tools Studio to
            create amazing content
          </p>
          {isSignedIn ? (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* View Example Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFeature && (
                <>
                  <selectedFeature.icon className="h-5 w-5" />
                  {selectedFeature.title} - Example
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              See how this AI feature works in practice
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4">
            {selectedFeature && (
              <>
                {/* AI Image Editor Example */}
                {selectedFeature.title === "AI Image Editor" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2 min-h-[36px]">
                          Original Image
                        </h4>
                        <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={selectedFeature.example.originalImageUrl}
                            alt="Original"
                            className="w-full rounded-lg object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2 min-h-[36px]">
                          <h4 className="font-medium">Background Removed</h4>
                          <Button
                            onClick={toggleGrid}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                          >
                            {showGrid ? (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Hide Grid
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" />
                                Show Grid
                              </>
                            )}
                          </Button>
                        </div>
                        <div className="bg-white relative rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={selectedFeature.example.editedImageUrl}
                            alt="Background Removed"
                            className="w-full rounded-lg object-contain"
                            style={{
                              backgroundColor: showGrid
                                ? "transparent"
                                : "#f3f4f6",
                              backgroundImage: showGrid ? gridPattern : "none",
                            }}
                          />
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Background Removed
                          </Badge>
                          {showGrid && (
                            <Badge
                              variant="outline"
                              className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm hidden md:flex"
                            >
                              <Grid3X3 className="w-3 h-3 mr-1" />
                              Transparency Grid
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() =>
                          downloadExampleImage(
                            selectedFeature.example.originalImageUrl
                          )
                        }
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Original
                      </Button>
                      <Button
                        onClick={() =>
                          downloadExampleImage(
                            selectedFeature.example.editedImageUrl
                          )
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Edited
                      </Button>
                    </div>
                  </div>
                )}

                {/* Image Generator Example */}
                {selectedFeature.title === "Image Generator" && (
                  <div className="space-y-4">
                    <div className="relative bg-white rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        src={selectedFeature.example.imageUrl}
                        alt="Generated artwork"
                        className="w-full rounded-lg object-contain max-h-96"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Generation Prompt</h4>
                        <p className="text-sm italic bg-muted p-3 rounded">
                          "{selectedFeature.example.prompt}"
                        </p>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          downloadExampleImage(selectedFeature.example.imageUrl)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          copyPrompt(selectedFeature.example.prompt)
                        }
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video Generator Example */}
                {selectedFeature.title === "Video Generator" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Source Image</h4>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                          <img
                            src={selectedFeature.example.imageUrl}
                            alt="Source"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Generated Video</h4>
                        <div className="relative bg-black rounded-lg overflow-hidden">
                          <video
                            src={selectedFeature.example.videoURL}
                            controls
                            className="w-full aspect-video"
                            poster={selectedFeature.example.imageUrl}
                          >
                            Your browser does not support the video tag.
                          </video>
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Generation Prompt</h4>
                        <p className="text-sm italic bg-muted p-3 rounded">
                          "{selectedFeature.example.prompt}"
                        </p>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button
                        onClick={() =>
                          openExampleItemInNewTab(
                            selectedFeature.example.imageUrl
                          )
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Download Image
                      </Button>
                      <Button
                        onClick={() =>
                          openExampleItemInNewTab(
                            selectedFeature.example.videoURL
                          )
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          copyPrompt(selectedFeature.example.prompt)
                        }
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Voice Chat Example */}
                {selectedFeature.title === "AI Voice Chat" && (
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-baseline gap-2">
                          <h4 className="font-medium">Conversation Topic:</h4>
                          <span className="italic">
                            {selectedFeature.example.topic}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <h4 className="font-medium">Conversation Transcript</h4>
                      {selectedFeature.example.transcript.map(
                        (message: any, idx: number) => (
                          <div
                            key={idx}
                            className={`flex ${
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                {message.role === "user" ? (
                                  <User className="w-4 h-4" />
                                ) : (
                                  <Bot className="w-4 h-4" />
                                )}
                                <span className="text-xs font-medium">
                                  {message.role === "user"
                                    ? "You"
                                    : "AI Assistant"}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                AI Tools Studio
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-500">
              <Link to="#" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            © 2025 AI Tools Studio. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
