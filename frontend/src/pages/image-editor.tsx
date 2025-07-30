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
import { UsageGuard } from "@/components/usage-guard";
import {
  Upload,
  Download,
  Trash2,
  Image as ImageIcon,
  Scissors,
  Sparkles,
  Loader2,
  Grid3X3,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateRemovedBgImage,
  useListRemovedBgImages,
} from "@/api/imageRemoveBg/imageRmBg.queries";
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
import { IMAGE_EDITOR_PROGRESS_STAGES } from "@/constants";
import { formatDate } from "@/lib/utils";

export function ImageEditor() {
  // Used to diplay the image in <img>
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  // Used to call remove imaeg bg API
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);

  // Image editing status
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");

  // API hook
  const removeBackgroundMutation = useCreateRemovedBgImage();
  const { data: imageHistory, isLoading: isLoadingHistory } =
    useListRemovedBgImages();

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

  // Reads the file from disk and returns a base64 data URL when recieving a file
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Limits to only 1 file
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setUploadedFile(file);
        setProcessedImage(null);
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

  // Call remove image bg API
  const handleProcessImage = async () => {
    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    // Reset progress
    setProgress(0);
    setCurrentStage("Preparing...");

    // Progress simulation for the 30-second processing
    let stageIndex = 0;
    const progressInterval = setInterval(() => {
      if (stageIndex < IMAGE_EDITOR_PROGRESS_STAGES.length) {
        const currentProgressStage = IMAGE_EDITOR_PROGRESS_STAGES[stageIndex];
        setProgress(currentProgressStage.progress);
        setCurrentStage(currentProgressStage.stage);
        stageIndex++;
      }
    }, 4500); // Update every 4.5 seconds (27 seconds total for 6 stages)

    try {
      const result = await removeBackgroundMutation.mutateAsync({
        image: uploadedFile,
      });

      // Clear the progress interval
      clearInterval(progressInterval);

      // Complete the progress
      setProgress(100);
      setCurrentStage("Background removed successfully!");

      if (result.success && result.image?.resultImageUrl) {
        setProcessedImage(result.image.resultImageUrl);
        toast.success("Background removed successfully!");
      } else {
        throw new Error("Failed to process image - no result URL received");
      }
    } catch (error) {
      // Clear the progress interval on error
      clearInterval(progressInterval);
      setProgress(0);
      setCurrentStage("");

      console.error("Error processing image:", error);

      if (error instanceof Error) {
        toast.error(`Failed to process image: ${error.message}`);
      } else {
        toast.error("Failed to process image. Please try again.");
      }
    }
  };

  // Download the image from "Edited Result" section
  const downloadImage = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `processed-${uploadedFile?.name || "image"}.png`;
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

  // Download the HQ image from "Edited Result" section
  const downloadHighQualityImage = async () => {
    if (!processedImage) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = processedImage;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const scaleFactor = 2;
      canvas.width = img.naturalWidth * scaleFactor;
      canvas.height = img.naturalHeight * scaleFactor;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Could not create image blob");
          }

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `high-quality-${
            uploadedFile?.name?.replace(/\.[^/.]+$/, "") || "image"
          }.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("High quality PNG downloaded!");
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Error downloading high quality image:", error);
      toast.error("Failed to download high quality image");
    }
  };

  // Download the selected image from history record
  const downloadSelectedImage = async (image: {
    id: string;
    resultImageUrl: string;
  }) => {
    if (!image?.resultImageUrl) return;

    try {
      const response = await fetch(image.resultImageUrl, {
        mode: "cors",
      });
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `processed-${image.id}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  // Download the HQ selected image from history record
  const downloadHighQualitySelectedImage = async (image: {
    id: string;
    resultImageUrl: string;
  }) => {
    if (!image?.resultImageUrl) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.resultImageUrl;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      const scaleFactor = 2;
      canvas.width = img.naturalWidth * scaleFactor;
      canvas.height = img.naturalHeight * scaleFactor;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Could not create image blob");
          }

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `high-quality-${image.id}.png`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("High quality PNG downloaded!");
        },
        "image/png",
        1.0
      );
    } catch (error) {
      console.error("Error downloading high quality image:", error);
      toast.error("Failed to download high quality image");
    }
  };

  const toggleGrid = () => {
    const newShowGrid = !showGrid;
    setShowGrid(newShowGrid);
    toast.info(newShowGrid ? "Grid shown" : "Grid hidden");
  };

  const clearImages = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setProcessedImage(null);
    setProgress(0);
    setCurrentStage("");
    toast.info("Images cleared");
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

  const gridPattern = `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='gray' stroke-width='0.5'/%3e%3c/pattern%3e%3cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3e%3crect width='80' height='80' fill='url(%23smallGrid)'/%3e%3cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='gray' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">AI Image Editor</h1>
              <p className="text-muted-foreground">
                Upload your images and let our AI remove backgrounds, enhance
                quality, and apply stunning transformations.
              </p>
            </div>

            {/* Input + Result Section */}
            <div className="grid lg:grid-cols-2 gap-8 lg:items-stretch">
              {/* Input Section */}
              <div className="space-y-6 flex flex-col">
                <UsageGuard feature="imageEditing" action="process this image">
                  <Card className="flex-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5 flex-shrink-0" />
                        Upload Image
                      </CardTitle>
                      <CardDescription>
                        Drag and drop your image or click to browse (Max 10MB)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
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
                              alt="Uploaded"
                              className="max-w-full max-h-64 mx-auto rounded-lg object-contain"
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
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                            <div>
                              <p className="font-medium mb-2">
                                {isDragActive
                                  ? "Drop your image here"
                                  : "Click to upload or drag and drop"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Supports JPG, PNG, WebP (Max 10MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {uploadedImage && (
                        <div className="mt-6 space-y-4">
                          {/* Editing Time Warning */}
                          {!removeBackgroundMutation.isPending && (
                            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <p className="text-amber-800 font-medium">
                                  Processing Time
                                </p>
                                <p className="text-amber-700">
                                  Background removal takes around 30 seconds.
                                  Please be patient!
                                </p>
                              </div>
                            </div>
                          )}

                          <Button
                            onClick={handleProcessImage}
                            disabled={removeBackgroundMutation.isPending}
                            className="w-full"
                          >
                            {removeBackgroundMutation.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Scissors className="w-4 h-4 mr-2" />
                                Remove Background
                              </>
                            )}
                          </Button>

                          <Button
                            onClick={clearImages}
                            variant="outline"
                            className="w-full"
                            disabled={removeBackgroundMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Images
                          </Button>

                          {/* Editing Time Pending info */}
                          {removeBackgroundMutation.isPending && (
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
                                Image editing typically takes around 30 seconds.
                                Please wait...
                              </div>
                            </div>
                          )}

                          {removeBackgroundMutation.isError && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <p className="text-red-800 font-medium">
                                  Processing Failed
                                </p>
                                <p className="text-red-700">
                                  {removeBackgroundMutation.error instanceof
                                  Error
                                    ? removeBackgroundMutation.error.message
                                    : "An error occurred while editing your image"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </UsageGuard>
              </div>

              {/* Result Section */}
              <Card className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 flex-shrink-0" />
                      <CardTitle>Edited Result</CardTitle>
                    </div>
                    {processedImage && (
                      <Button
                        onClick={toggleGrid}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {showGrid ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            <span className="hidden sm:flex">Hide Grid</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:flex">Show Grid</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Your AI-edited image will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {processedImage ? (
                    <div className="space-y-6 flex-1 flex flex-col">
                      <div className="relative">
                        <img
                          src={processedImage}
                          alt="Processed"
                          className="w-full rounded-lg object-contain transition-all duration-300"
                          style={{
                            backgroundColor: showGrid
                              ? "transparent"
                              : "#f3f4f6",
                            backgroundImage: showGrid ? gridPattern : "none",
                          }}
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                          Background Removed
                        </Badge>
                        {showGrid && (
                          <Badge
                            variant="outline"
                            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm"
                          >
                            <Grid3X3 className="w-3 h-3 mr-1" />
                            <span className="hidden md:flex">
                              Transparency Grid
                            </span>
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3 mt-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Button
                            onClick={downloadImage}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Standard PNG
                          </Button>
                          <Button
                            onClick={downloadHighQualityImage}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            HD PNG
                          </Button>
                        </div>

                        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>
                              <strong>Standard:</strong> Original resolution
                              with transparent background
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                            <span>
                              <strong>HD:</strong> Enhanced 2x resolution
                              without grid pattern
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 flex-1 flex flex-col justify-center">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No edited image yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Upload an image and click "Remove Background" to get
                        started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Image Editing History Section */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 flex-shrink-0" />
                    Image Editing History
                  </CardTitle>
                  <CardDescription>
                    Your previous background removal results ({totalItems}{" "}
                    total)
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
                        No edited images yet
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Edit your first image to see it here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Original</TableHead>
                              <TableHead>Edited</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {currentItems.map((image: any) => (
                              <TableRow key={image.id}>
                                <TableCell>
                                  <img
                                    src={image.inputImageUrl}
                                    alt="Original"
                                    className="w-16 h-16 rounded object-cover"
                                  />
                                </TableCell>
                                <TableCell>
                                  <img
                                    src={image.resultImageUrl}
                                    alt="Processed"
                                    className="w-16 h-16 rounded object-cover"
                                    style={{
                                      backgroundColor: "transparent",
                                      backgroundImage: gridPattern,
                                    }}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3 flex-shrink-0" />
                                    {formatDate(image.createdAt)}
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

            {/* View Edited Image Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Edited Image
                  </DialogTitle>
                  <DialogDescription className="hidden sm:flex">
                    Background removal result
                  </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {selectedImage && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2 min-h-[36px]">
                            Original Image
                          </h4>
                          <img
                            src={selectedImage.inputImageUrl}
                            alt="Original"
                            className="w-full rounded-lg object-contain"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2 min-h-[36px]">
                            <h4 className="font-medium">Edited Result</h4>
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
                          <div className="relative">
                            <img
                              src={selectedImage.resultImageUrl}
                              alt="Processed"
                              className="w-full rounded-lg object-contain"
                              style={{
                                backgroundColor: showGrid
                                  ? "transparent"
                                  : "#f3f4f6",
                                backgroundImage: showGrid
                                  ? gridPattern
                                  : "none",
                              }}
                            />
                            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                              Background Removed
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Download selected image from history record */}
                        <Button
                          onClick={() => downloadSelectedImage(selectedImage)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Standard PNG
                        </Button>
                        <Button
                          onClick={() =>
                            downloadHighQualitySelectedImage(selectedImage)
                          }
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Download HD PNG
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Footer Section */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <Card className="text-center p-6">
                <Scissors className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Background Removal
                </h3>
                <p className="text-muted-foreground text-sm">
                  Precisely remove backgrounds with AI precision
                </p>
              </Card>
              <Card className="text-center p-6">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">HD Enhancement</h3>
                <p className="text-muted-foreground text-sm">
                  Download enhanced 2x resolution images without grid patterns
                </p>
              </Card>
              <Card className="text-center p-6">
                <Eye className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Preview Control</h3>
                <p className="text-muted-foreground text-sm">
                  Toggle transparency grid to see your image clearly
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
