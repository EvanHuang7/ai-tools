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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
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

export function ImageGenerator() {
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalItems = imageHistory?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = imageHistory?.slice(startIndex, endIndex) || [];

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
      // Progress simulation for the 30-second generation
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        if (stageIndex < IMAGE_GENERATOR_PROGRESS_STAGES.length) {
          const currentProgressStage =
            IMAGE_GENERATOR_PROGRESS_STAGES[stageIndex];
          setProgress(currentProgressStage.progress);
          setCurrentStage(currentProgressStage.stage);
          stageIndex++;
        }
      }, 5000); // Update every 5 seconds (30 seconds total for 6 stages)

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

  // Download the image from "Generated Image" section
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

  // Download the selected image from history record
  const downloadSelectedImage = async (selectedImage: {
    ImageURL: string;
    ID: string;
  }) => {
    if (!selectedImage) return;

    try {
      const response = await fetch(selectedImage.ImageURL, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ai-generated-${selectedImage.ID}.png`;
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

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

            {/* Input + Result Sections */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6 flex flex-col">
                <UsageGuard
                  feature="imageGeneration"
                  action="generate this image"
                >
                  <Card className="h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 flex-shrink-0" />
                        Create Your Image
                      </CardTitle>
                      <CardDescription>
                        Describe the image you want to generate
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col">
                      <div className="space-y-6">
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

                        {/* Generation Time Warning Banner */}
                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm">
                            <p className="text-amber-800 font-medium">
                              Processing Time
                            </p>
                            <p className="text-amber-700">
                              Image generation takes around 30 seconds. Please
                              be patient!
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mt-auto">
                        <Button
                          onClick={handleGenerateImage}
                          disabled={isGenerating || !prompt.trim()}
                          className="w-full "
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

                      {/* Generating Image Progress and Clock Info */}
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
                            Generation in progress — usually completes in about
                            30 seconds. Please wait...
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </UsageGuard>
              </div>

              {/* Result Section */}
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 flex-shrink-0" />
                    Generated Image
                  </CardTitle>
                  <CardDescription>Your AI-created artwork</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
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
                        <Button
                          onClick={downloadImage}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Image
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyPrompt(prompt)}
                          >
                            <Copy className="w-3 h-3 mr-1 flex-shrink-0 hidden sm:flex" />
                            Copy Prompt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(generatedImage, "_blank")
                            }
                          >
                            <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0 hidden sm:flex" />
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
                    <div className="text-center py-12 flex-1 flex flex-col justify-center">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No image generated yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enter a prompt and click "Generate Image" to create your
                        artwork
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Image Generation History Section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 flex-shrink-0" />
                    Image Generation History
                  </CardTitle>
                  <CardDescription>
                    Your previous AI-generated images ({totalItems} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Loading history...</span>
                    </div>
                  ) : !imageHistory || totalItems === 0 ? (
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
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Preview</TableHead>
                              <TableHead>Prompt</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentItems.map((image: any) => (
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
                                    <Calendar className="w-3 h-3 flex-shrink-0" />
                                    {formatDate(image.CreatedAt)}
                                  </div>
                                </TableCell>
                                <TableCell>
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

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between">
                          <div className="hidden md:flex text-sm text-muted-foreground">
                            Showing {startIndex + 1} to{" "}
                            {Math.min(endIndex, totalItems)} of {totalItems}{" "}
                            images
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToPreviousPage}
                              disabled={currentPage === 1}
                              className="flex items-center gap-1"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span className="hidden sm:flex ">Previous</span>
                            </Button>

                            <div className="flex items-center gap-1">
                              {totalPages <= 3 ? (
                                // Show all pages if 3 or fewer
                                Array.from(
                                  { length: totalPages },
                                  (_, i) => i + 1
                                ).map((page) => (
                                  <Button
                                    key={page}
                                    variant={
                                      currentPage === page
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => goToPage(page)}
                                    className="w-8 h-8 p-0"
                                  >
                                    {page}
                                  </Button>
                                ))
                              ) : (
                                // Always show exactly 3 elements for more than 3 pages
                                <>
                                  {currentPage === 1 ? (
                                    // Page 1 of n: "1 ... n"
                                    <>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => goToPage(1)}
                                        className="w-8 h-8 p-0"
                                      >
                                        1
                                      </Button>
                                      <span className="px-2 text-muted-foreground">
                                        ...
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(totalPages)}
                                        className="w-8 h-8 p-0"
                                      >
                                        {totalPages}
                                      </Button>
                                    </>
                                  ) : currentPage === totalPages ? (
                                    // Page n of n: "1 ... n"
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(1)}
                                        className="w-8 h-8 p-0"
                                      >
                                        1
                                      </Button>
                                      <span className="px-2 text-muted-foreground">
                                        ...
                                      </span>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => goToPage(totalPages)}
                                        className="w-8 h-8 p-0"
                                      >
                                        {totalPages}
                                      </Button>
                                    </>
                                  ) : (
                                    // Middle page: "... n ..."
                                    <>
                                      <span className="px-2 text-muted-foreground">
                                        ...
                                      </span>
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => goToPage(currentPage)}
                                        className="w-8 h-8 p-0"
                                      >
                                        {currentPage}
                                      </Button>
                                      <span className="px-2 text-muted-foreground">
                                        ...
                                      </span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToNextPage}
                              disabled={currentPage === totalPages}
                              className="flex items-center gap-1"
                            >
                              <span className="hidden sm:flex ">Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* View Generated Image Modal */}
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
                      <div className="relative bg-white rounded-lg overflow-hidden">
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
                        {/* Download selected image from history record */}
                        <Button
                          onClick={() => downloadSelectedImage(selectedImage)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
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

            {/* Footer Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-12 gap-6">
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
                  Generate stunning images in different styles
                </p>
              </Card>
              <Card className="text-center p-6">
                <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Quality Generation
                </h3>
                <p className="text-muted-foreground text-sm">
                  High-quality images in 30 seconds
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
