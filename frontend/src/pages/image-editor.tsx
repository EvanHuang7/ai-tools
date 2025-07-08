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
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setUploadedFile(file);
        setProcessedImage(null);
        setProgress(0);
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
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const processImage = async () => {
    if (!uploadedFile) {
      toast.error("Please upload an image first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("image", uploadedFile);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call your Python API
      const response = await axios.post("/api/python/remove-bg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout for processing
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Assuming your API returns the processed image URL
      if (response.data && response.data.processed_url) {
        setProcessedImage(response.data.processed_url);
        toast.success("Background removed successfully!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setProgress(0);

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          toast.error("Processing timeout. Please try with a smaller image.");
        } else if (error.response?.status === 413) {
          toast.error(
            "Image file is too large. Please use an image under 10MB."
          );
        } else if (error.response?.status === 400) {
          toast.error("Invalid image format. Please use JPG, PNG, or WebP.");
        } else {
          toast.error(
            `Failed to process image: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      } else {
        toast.error("Failed to process image. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = async () => {
    if (!processedImage) return;

    try {
      // If the processed image is a URL, fetch it and download
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

  const downloadHighQualityImage = async () => {
    if (!processedImage) return;

    try {
      // Create a canvas to render the image without the grid background
      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = processedImage;
      });

      // Create canvas with higher resolution for better quality
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not get canvas context");
      }

      // Set canvas size to match or enhance the image dimensions
      const scaleFactor = 2; // 2x resolution for higher quality
      canvas.width = img.naturalWidth * scaleFactor;
      canvas.height = img.naturalHeight * scaleFactor;

      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Draw the image at higher resolution
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to blob and download
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
        1.0 // Maximum quality
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
    toast.info("Images cleared");
  };

  // Define the grid pattern as a constant
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

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Image
                  </CardTitle>
                  <CardDescription>
                    Drag and drop your image or click to browse (Max 10MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsageGuard
                    feature="imageProcessing"
                    action="process this image"
                  >
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
                        <Button
                          onClick={processImage}
                          disabled={isProcessing}
                          className="w-full"
                        >
                          {isProcessing ? (
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

                        {isProcessing && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Processing image...
                              </span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground text-center">
                              This may take a few moments depending on image
                              size
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={clearImages}
                          variant="outline"
                          className="w-full"
                          disabled={isProcessing}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Images
                        </Button>
                      </div>
                    )}
                  </UsageGuard>
                </CardContent>
              </Card>

              {/* Result Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      <CardTitle>Processed Result</CardTitle>
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
                            Hide Grid
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            Show Grid
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <CardDescription>
                    Your AI-processed image will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {processedImage ? (
                    <div className="space-y-6">
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
                            Transparency Grid
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        {/* Primary download buttons */}
                        <div className="grid grid-cols-2 gap-3">
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

                        {/* Download info */}
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
                    <div className="text-center py-12">
                      <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">
                        No processed image yet
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

            {/* Features */}
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
