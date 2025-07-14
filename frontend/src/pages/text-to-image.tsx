import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wand2,
  Download,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Loader2,
  Copy,
  RefreshCw,
  Eye,
  Palette,
  Lightbulb,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { UsageGuard } from "@/components/usage-guard";
import { useAuth } from "@clerk/clerk-react";

export function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Image generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");

  // TODO: remove it after adding list images api hook
  const [generationHistory, setGenerationHistory] = useState<
    Array<{ id: string; prompt: string; image: string; timestamp: Date }>
  >([]);

  // Get clerk token
  const { getToken } = useAuth();

  // Generate image API call
  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate an image");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStage("Initializing...");
    setGeneratedImage(null);

    try {
      // TODO: move to constant file
      // Progress simulation for the 10-second generation
      const progressStages = [
        { progress: 15, stage: "Processing prompt..." },
        { progress: 30, stage: "Analyzing style preferences..." },
        { progress: 50, stage: "Generating image composition..." },
        { progress: 70, stage: "Adding details and textures..." },
        { progress: 85, stage: "Applying final touches..." },
        { progress: 95, stage: "Optimizing image quality..." },
      ];

      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        if (stageIndex < progressStages.length) {
          const currentProgressStage = progressStages[stageIndex];
          setProgress(currentProgressStage.progress);
          setCurrentStage(currentProgressStage.stage);
          stageIndex++;
        }
      }, 1500); // Update every 1.5 seconds (9 seconds total for 6 stages)

      // Call the API
      const token = await getToken();
      const response = await axios.post(
        "/api/go/generate-image",
        {
          prompt: prompt.trim(),
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear the progress interval
      clearInterval(progressInterval);

      // Complete the progress
      setProgress(100);
      setCurrentStage("Image generated successfully!");

      // Handle the response
      if (response.data && response.data.ImageURL) {
        const newImage = response.data.ImageURL;
        setGeneratedImage(newImage);

        // Add to history
        const historyItem = {
          id: Date.now().toString(),
          prompt: prompt.trim(),
          image: newImage,
          timestamp: new Date(),
        };
        setGenerationHistory((prev) => [historyItem, ...prev.slice(0, 9)]); // Keep last 10 items

        toast.success("Image generated successfully!");
      } else {
        throw new Error("Invalid response from server - no image URL received");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setProgress(0);
      setCurrentStage("");

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Image generation timeout. Please try again.");
        } else if (error.response?.status === 400) {
          toast.error(
            `Invalid request: ${
              error.response?.data?.message || "Please check your prompt."
            }`
          );
        } else if (error.response?.status === 500) {
          toast.error(
            "Server error during image generation. Please try again."
          );
        } else {
          toast.error(
            `Failed to generate image: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      } else {
        toast.error(
          "Failed to generate image. Please check your connection and try again."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-generated-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  const copyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    toast.success("Prompt copied to clipboard!");
  };

  const clearAll = () => {
    setPrompt("");
    setGeneratedImage(null);
    setProgress(0);
    setCurrentStage("");
    toast.info("All data cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Image Generator</h1>
              <p className="text-muted-foreground">
                Create stunning images from text descriptions using advanced AI.
                Simply describe what you want to see and watch it come to life.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-6">
                <UsageGuard feature="textToImage" action="generate this image">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        Create Your Image
                      </CardTitle>
                      <CardDescription>
                        Describe the image you want to generate
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="prompt">Image Description *</Label>
                        <Textarea
                          id="prompt"
                          placeholder="Describe the image you want to create... (e.g., 'A serene mountain lake at sunset with golden reflections')"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="mt-2 min-h-[120px]"
                          disabled={isGenerating}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Be descriptive and specific for better results.
                          Include details about style, mood, colors, and
                          composition.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={handleGenerateImage}
                          disabled={isGenerating || !prompt.trim()}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Image
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={clearAll}
                          variant="outline"
                          className="w-full"
                          disabled={isGenerating}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>

                      {isGenerating && (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {currentStage}
                            </span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <div className="text-xs text-muted-foreground text-center bg-muted/30 rounded p-2">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Generation typically takes 8-12 seconds. Please
                            wait...
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </UsageGuard>
              </div>

              {/* Result Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Generated Image
                    </CardTitle>
                    <CardDescription>Your AI-created artwork</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedImage ? (
                      <div className="space-y-4">
                        <div className="relative group">
                          <img
                            src={generatedImage}
                            alt="Generated artwork"
                            className="w-full rounded-lg object-cover shadow-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Generated
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <Button onClick={downloadImage} className="w-full">
                            <Download className="w-4 h-4 mr-2" />
                            Download Image
                          </Button>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyPrompt(prompt)}
                            >
                              <Copy className="w-3 h-3 mr-1" />
                              Copy Prompt
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(generatedImage, "_blank")
                              }
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Full View
                            </Button>
                          </div>
                        </div>

                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">
                              Generation Details
                            </h4>
                            <div className="mt-3 pt-3 border-t">
                              <span className="text-muted-foreground text-sm">
                                Prompt:
                              </span>
                              <p className="text-sm mt-1 italic">"{prompt}"</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">
                          No image generated yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Enter a prompt and click "Generate Image" to create
                          your artwork
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Generation History */}
                {generationHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Recent Generations
                      </CardTitle>
                      <CardDescription>
                        Your latest AI creations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {generationHistory.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => {
                              setGeneratedImage(item.image);
                              setPrompt(item.prompt);
                            }}
                          >
                            <img
                              src={item.image}
                              alt="Generated"
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.prompt}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground text-sm">
                  Advanced AI models for stunning image generation
                </p>
              </Card>
              <Card className="text-center p-6">
                <Palette className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Multiple Styles</h3>
                <p className="text-muted-foreground text-sm">
                  Choose from realistic to artistic styles
                </p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fast Generation</h3>
                <p className="text-muted-foreground text-sm">
                  High-quality images in just 10 seconds
                </p>
              </Card>
              <Card className="text-center p-6">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Easy Download</h3>
                <p className="text-muted-foreground text-sm">
                  Download your creations instantly
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
