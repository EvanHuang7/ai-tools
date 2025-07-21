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
  Wand2,
  Download,
  Image as ImageIcon,
  Sparkles,
  Clock,
  Loader2,
  Copy,
  Eye,
  Palette,
  Calendar,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { UsageGuard } from "@/components/usage-guard";
import {
  useGenerateImage,
  useListImages,
} from "@/api/imageGeneration/image.queries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { IMAGE_GENERATOR_PROGRESS_STAGES } from "@/constants";

export function TextToImage() {
  // Image info
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Image generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");

  // API hook
  const generateImageMutation = useGenerateImage();
  const { data: imageHistory, isLoading: isLoadingHistory } = useListImages();

  // Modal state for viewing images
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Progress simulation for the 40-second generation
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        if (stageIndex < IMAGE_GENERATOR_PROGRESS_STAGES.length) {
          const currentProgressStage =
            IMAGE_GENERATOR_PROGRESS_STAGES[stageIndex];
          setProgress(currentProgressStage.progress);
          setCurrentStage(currentProgressStage.stage);
          stageIndex++;
        }
      }, 6000); // Update every 6 seconds (36 seconds total for 6 stages)

      // Call the API using the hook
      const response = await generateImageMutation.mutateAsync({
        prompt: prompt.trim(),
      });

      // Clear the progress interval
      clearInterval(progressInterval);

      // Complete the progress
      setProgress(100);
      setCurrentStage("Image generated successfully!");

      // Handle the response
      if (response && response.ImageURL) {
        const newImage = response.ImageURL;
        setGeneratedImage(newImage);
        toast.success("Image generated successfully!");
      } else {
        throw new Error("Invalid response from server - no image URL received");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setProgress(0);
      setCurrentStage("");

      if (error instanceof Error) {
        toast.error(`Failed to generate image: ${error.message}`);
      } else {
        toast.error("Failed to generate image. Please try again.");
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

  const handleViewImage = (image: any) => {
    setSelectedImage(image);
    setIsModalOpen(true);
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

                      {/* Generation Time Warning */}
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-amber-800 font-medium">
                            Processing Time
                          </p>
                          <p className="text-amber-700">
                            Image generation takes up to 40 seconds. Please be
                            patient!
                          </p>
                        </div>
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
                            Generation typically takes 30-40 seconds. Please
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
              </div>
            </div>

            {/* Features */}
            {/* Image Generation History Section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Image Generation History
                  </CardTitle>
                  <CardDescription>
                    Your previous AI-generated images
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Loading history...</span>
                    </div>
                  ) : !imageHistory || imageHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No images generated yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Generate your first image to see it here
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Preview</TableHead>
                            <TableHead>Prompt</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {imageHistory.map((image: any) => (
                            <TableRow key={image.id}>
                              <TableCell>
                                <img
                                  src={image.ImageURL}
                                  alt="Generated"
                                  className="w-16 h-16 rounded object-cover"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="max-w-[300px] truncate">
                                  {image.Prompt}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(image.CreatedAt)}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewImage(image)}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Image View Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Generated Image
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedImage && formatDate(selectedImage.CreatedAt)}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {selectedImage && (
                    <>
                      <div className="relative">
                        <img
                          src={selectedImage.ImageURL}
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
                          <h4 className="font-medium mb-2">
                            Generation Details
                          </h4>
                          <div className="space-y-2">
                            <div>
                              <span className="text-muted-foreground text-sm">
                                Prompt:
                              </span>
                              <p className="text-sm mt-1 italic">
                                "{selectedImage.Prompt}"
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = selectedImage.ImageURL;
                            link.download = `ai-generated-${selectedImage.ID}.png`;
                            link.target = "_blank";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("Image download started!");
                          }}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Image
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => copyPrompt(selectedImage.Prompt)}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Prompt
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

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
                <h3 className="text-lg font-semibold mb-2">
                  Quality Generation
                </h3>
                <p className="text-muted-foreground text-sm">
                  High-quality images in 30-40 seconds
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
