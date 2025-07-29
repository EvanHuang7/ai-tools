import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
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
import { UsageGuard } from "@/components/usage-guard";
import {
  Upload,
  Play,
  Download,
  Video,
  Wand2,
  Clock,
  Loader2,
  AlertCircle,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGenerateVideo,
  useListVideos,
} from "@/api/videoGeneration/video.queries";
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
import { VIDEO_GENERATOR_PROGRESS_STAGES } from "@/constants";

export function VideoGenerator() {
  // Video info
  const [prompt, setPrompt] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // Video generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");

  // API hook
  const generateVideoMutation = useGenerateVideo();
  const { data: videoHistory, isLoading: isLoadingHistory } = useListVideos();

  // Modal state for viewing videos
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination calculations
  const totalItems = videoHistory?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = videoHistory?.slice(startIndex, endIndex) || [];

  // Reads the file from disk and returns a base64 data URL when recieving a file
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setUploadedFile(file);
        setGeneratedVideo(null);
        setProgress(0);
        setCurrentStage("");
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // "useDropzone" is a hook that handles drag-and-drop file uploads.
  // "getRootProps" gives props to spread onto the outer dropzone container (e.g., div).
  // "getInputProps" gives props for a hidden <input type="file" />.
  // "isDragActive" specifys whether a file is currently being dragged over the dropzone.
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // "onDrop" runs when the user drops a file onto the drop area or selects one via file picker.
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  // Generate Video API call
  const handleGenerateVideo = async () => {
    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setCurrentStage("Preparing...");
    setGeneratedVideo(null);

    try {
      // Simulate progress updates during the 40-50 second generation
      let stageIndex = 0;
      const progressInterval = setInterval(() => {
        if (stageIndex < VIDEO_GENERATOR_PROGRESS_STAGES.length) {
          const currentProgressStage =
            VIDEO_GENERATOR_PROGRESS_STAGES[stageIndex];
          setProgress(currentProgressStage.progress);
          setCurrentStage(currentProgressStage.stage);
          stageIndex++;
        }
      }, 6000); // Update every 6 seconds (48 seconds total for 8 stages)

      // Call the API using the hook
      const response = await generateVideoMutation.mutateAsync({
        prompt: prompt.trim(),
        image: uploadedFile,
      });

      // Clear the progress interval
      clearInterval(progressInterval);

      // Complete the progress
      setProgress(100);
      setCurrentStage("Video generated successfully!");

      // Handle the response
      if (response && response.VideoURL) {
        setGeneratedVideo(response.VideoURL);
        toast.success("Video generated successfully!");
      } else {
        throw new Error("Invalid response from server - no video URL received");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      setProgress(0);
      setCurrentStage("");

      if (error instanceof Error) {
        toast.error(`Failed to generate video: ${error.message}`);
      } else {
        toast.error("Failed to generate video. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = async () => {
    if (!generatedVideo) return;

    try {
      // Create a download link
      const link = document.createElement("a");
      link.href = generatedVideo;
      link.download = `generated-video-${Date.now()}.mp4`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Video download started!");
    } catch (error) {
      console.error("Error downloading video:", error);
      toast.error("Failed to download video");
    }
  };

  const clearAll = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setPrompt("");
    setGeneratedVideo(null);
    setProgress(0);
    setCurrentStage("");
    toast.info("All data cleared");
  };

  const handleViewVideo = (video: any) => {
    setSelectedVideo(video);
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
              <h1 className="text-3xl font-bold mb-2">AI Video Generator</h1>
              <p className="text-muted-foreground">
                Transform your images into stunning videos using AI. Upload an
                image, describe your vision, and watch it come to life.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <UsageGuard
                  feature="videoGeneration"
                  action="generate this video"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 flex-shrink-0" />
                        Upload Image
                      </CardTitle>
                      <CardDescription>
                        Start with your source image (Max 10MB)
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
                              className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
                            />
                            <div className="flex items-center justify-center gap-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-500/10 text-green-600 border-green-500/20"
                              >
                                Image Ready
                              </Badge>
                              <Badge variant="outline">
                                {uploadedFile &&
                                  `${(uploadedFile.size / 1024 / 1024).toFixed(
                                    1
                                  )}MB`}
                              </Badge>
                            </div>
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
                        <Wand2 className="h-5 w-5 flex-shrink-0" />
                        Video Settings
                      </CardTitle>
                      <CardDescription>
                        Customize your video generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="prompt">Prompt *</Label>
                        <Textarea
                          id="prompt"
                          placeholder="Describe the animation or movement you want to see... (e.g., 'gentle camera zoom in', 'leaves swaying in the wind', 'water flowing')"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="mt-2"
                          rows={4}
                          disabled={isGenerating}
                        />
                      </div>

                      {/* Generation Time Warning */}
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="text-amber-800 font-medium">
                            Processing Time
                          </p>
                          <p className="text-amber-700">
                            Video generation takes 40-50 seconds. Please be
                            patient!
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button
                          onClick={handleGenerateVideo}
                          disabled={
                            isGenerating || !uploadedImage || !prompt.trim()
                          }
                          className="w-full"
                        >
                          {isGenerating ? (
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

                        <Button
                          onClick={clearAll}
                          variant="outline"
                          className="w-full"
                          disabled={isGenerating}
                        >
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
                            This process typically takes 40-50 seconds. Please
                            keep this tab open.
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </UsageGuard>
              </div>

              {/* Result Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 flex-shrink-0" />
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
                        <video
                          src={generatedVideo}
                          controls
                          className="w-full aspect-video"
                          poster={uploadedImage || undefined}
                        >
                          Your browser does not support the video tag.
                        </video>
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
                            Download MP4
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const video = document.querySelector(
                                "video"
                              ) as HTMLVideoElement;
                              if (video) {
                                video.currentTime = 0;
                                video.play();
                              }
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Replay
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
                                <span className="ml-2">5s</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Style:
                                </span>
                                <span className="ml-2 capitalize">default</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Format:
                                </span>
                                <span className="ml-2">MP4</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Quality:
                                </span>
                                <span className="ml-2">HD</span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t">
                              <span className="text-muted-foreground text-sm">
                                Prompt:
                              </span>
                              <p className="text-sm mt-1 italic">"{prompt}"</p>
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
            {/* Video Generation History Section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5 flex-shrink-0" />
                    Video Generation History
                  </CardTitle>
                  <CardDescription>
                    Your previous AI-generated videos ({totalItems} total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Loading history...</span>
                    </div>
                  ) : !videoHistory || videoHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No videos generated yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Generate your first video to see it here
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
                              <TableHead>Duration</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead className="text-center">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentItems.map((video: any) => (
                              <TableRow key={video.id}>
                                <TableCell>
                                  <video
                                    src={video.VideoURL}
                                    className="w-16 h-16 rounded object-cover"
                                    muted
                                    poster={video.ImageURL}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="max-w-[300px] truncate">
                                    {video.Prompt}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {video.VideoDuration}s
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(video.CreatedAt)}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewVideo(video)}
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
                            videos
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

            {/* Video View Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Generated Video
                  </DialogTitle>
                  <DialogDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedVideo && formatDate(selectedVideo.CreatedAt)}
                    </span>
                    <Badge variant="secondary">
                      {selectedVideo?.VideoDuration}s duration
                    </Badge>
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {selectedVideo && (
                    <>
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          src={selectedVideo.VideoURL}
                          controls
                          className="w-full aspect-video"
                          poster={selectedVideo.ImageURL}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                          Generated
                        </Badge>
                      </div>

                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">Video Details</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Duration:
                              </span>
                              <span className="ml-2">
                                {selectedVideo.VideoDuration}s
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Format:
                              </span>
                              <span className="ml-2">MP4</span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <span className="text-muted-foreground text-sm">
                              Prompt:
                            </span>
                            <p className="text-sm mt-1 italic">
                              "{selectedVideo.Prompt}"
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = selectedVideo.VideoURL;
                            link.download = `generated-video-${selectedVideo.ID}.mp4`;
                            link.target = "_blank";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("Video download started!");
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download MP4
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const video = document.querySelector(
                              "video"
                            ) as HTMLVideoElement;
                            if (video) {
                              video.currentTime = 0;
                              video.play();
                            }
                          }}
                          className="flex-1"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Replay
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

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
                  Professional Quality
                </h3>
                <p className="text-muted-foreground text-sm">
                  40-50 second processing for premium results
                </p>
              </Card>
              <Card className="text-center p-6">
                <Video className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">HD Video Output</h3>
                <p className="text-muted-foreground text-sm">
                  Export high-quality MP4 videos
                </p>
              </Card>
              <Card className="text-center p-6">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Easy Download</h3>
                <p className="text-muted-foreground text-sm">
                  Download your videos instantly
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
