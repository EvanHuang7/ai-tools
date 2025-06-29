import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
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
  Upload,
  Play,
  Download,
  Video,
  Wand2,
  Clock,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export function VideoGenerator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState("3");
  const [progress, setProgress] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock mutation since API is commented out
  const generateVideoMutation = {
    mutateAsync: async () => {
      setIsGenerating(true);
      setProgress(0);

      // Simulate progress
      const stages = [20, 40, 60, 80, 100];
      for (const stage of stages) {
        setProgress(stage);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setGeneratedVideo("/api/placeholder-video.mp4");
      setIsGenerating(false);
      return { data: { videoUrl: "/api/placeholder-video.mp4" } };
    },
    isPending: isGenerating,
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setGeneratedVideo(null);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  });

  const generateVideo = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      await generateVideoMutation.mutateAsync();
      toast.success("Video generated successfully!");
    } catch (error) {
      setProgress(0);
      toast.error("Failed to generate video");
    }
  };

  const downloadVideo = () => {
    toast.success("Video download started!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Video Generator</h1>
              <p className="text-muted-foreground">
                Transform your images into stunning videos using AI. Upload an
                image, describe your vision, and watch it come to life.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Image
                    </CardTitle>
                    <CardDescription>
                      Start with your source image
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${
                          isDragActive
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                    >
                      <input {...getInputProps()} />
                      {uploadedImage ? (
                        <div className="space-y-4">
                          <img
                            src={uploadedImage}
                            alt="Source"
                            className="max-w-full max-h-48 mx-auto rounded-lg"
                          />
                          <Badge
                            variant="secondary"
                            className="bg-green-500/10 text-green-600 border-green-500/20"
                          >
                            Image Ready
                          </Badge>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                          <div>
                            <p className="font-medium mb-2">
                              {isDragActive
                                ? "Drop your image here"
                                : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, WebP (Max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Video Settings
                    </CardTitle>
                    <CardDescription>
                      Customize your video generation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="prompt">Prompt</Label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe the animation or movement you want to see..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Style</Label>
                        <Select value={style} onValueChange={setStyle}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cinematic">Cinematic</SelectItem>
                            <SelectItem value="anime">Anime</SelectItem>
                            <SelectItem value="realistic">Realistic</SelectItem>
                            <SelectItem value="artistic">Artistic</SelectItem>
                            <SelectItem value="fantasy">Fantasy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Duration</Label>
                        <Select value={duration} onValueChange={setDuration}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3 seconds</SelectItem>
                            <SelectItem value="5">5 seconds</SelectItem>
                            <SelectItem value="10">10 seconds</SelectItem>
                            <SelectItem value="15">15 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={generateVideo}
                      disabled={
                        generateVideoMutation.isPending ||
                        !uploadedImage ||
                        !prompt.trim()
                      }
                      className="w-full"
                    >
                      {generateVideoMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating Video...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Generate Video
                        </>
                      )}
                    </Button>

                    {generateVideoMutation.isPending && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Generating...
                          </span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Result Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Generated Video
                  </CardTitle>
                  <CardDescription>
                    Your AI-generated video will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generatedVideo ? (
                    <div className="space-y-6">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                          <div className="text-center">
                            <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                            <p className="text-foreground">Video Preview</p>
                            <p className="text-sm text-muted-foreground">
                              Generated based on your prompt
                            </p>
                          </div>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                          Generated
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            onClick={downloadVideo}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download HD
                          </Button>
                          <Button variant="outline">
                            <Play className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>

                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Video Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Duration:
                                </span>
                                <span className="ml-2">{duration}s</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Style:
                                </span>
                                <span className="ml-2 capitalize">{style}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Resolution:
                                </span>
                                <span className="ml-2">1080p</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Format:
                                </span>
                                <span className="ml-2">MP4</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No video generated yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload an image and enter a prompt to generate your
                        video
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-4 gap-6">
              <Card className="text-center p-6">
                <Wand2 className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Animation</h3>
                <p className="text-muted-foreground text-sm">
                  Create smooth animations from still images
                </p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Multiple Durations
                </h3>
                <p className="text-muted-foreground text-sm">
                  Generate videos from 3 to 15 seconds
                </p>
              </Card>
              <Card className="text-center p-6">
                <Video className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">HD Quality</h3>
                <p className="text-muted-foreground text-sm">
                  Export in crisp 1080p resolution
                </p>
              </Card>
              <Card className="text-center p-6">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Easy Export</h3>
                <p className="text-muted-foreground text-sm">
                  Download in popular video formats
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
