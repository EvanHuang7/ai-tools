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
import {
  Upload,
  Download,
  Trash2,
  Image as ImageIcon,
  Scissors,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const clearImages = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setProcessedImage(null);
    setProgress(0);
    toast.info("Images cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
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
                            This may take a few moments depending on image size
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
                </CardContent>
              </Card>

              {/* Result Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Processed Result
                  </CardTitle>
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
                          className="w-full rounded-lg object-contain bg-gray-100 dark:bg-gray-800"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='smallGrid' width='8' height='8' patternUnits='userSpaceOnUse'%3e%3cpath d='M 8 0 L 0 0 0 8' fill='none' stroke='gray' stroke-width='0.5'/%3e%3c/pattern%3e%3cpattern id='grid' width='80' height='80' patternUnits='userSpaceOnUse'%3e%3crect width='80' height='80' fill='url(%23smallGrid)'/%3e%3cpath d='M 80 0 L 0 0 0 80' fill='none' stroke='gray' stroke-width='1'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23grid)' /%3e%3c/svg%3e")`,
                          }}
                        />
                        <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                          Background Removed
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={downloadImage}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PNG
                        </Button>
                        <Button
                          onClick={downloadHighQualityImage}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Download High Quality PNG
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground text-center space-y-1">
                        <p>✨ Background successfully removed using AI</p>
                        <p>
                          Standard download: Original resolution with
                          transparent background
                        </p>
                        <p>
                          High Quality: Enhanced 2x resolution without grid
                          pattern
                        </p>
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
                <h3 className="text-lg font-semibold mb-2">
                  High Quality Enhancement
                </h3>
                <p className="text-muted-foreground text-sm">
                  Download enhanced 2x resolution images without grid patterns
                </p>
              </Card>
              <Card className="text-center p-6">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Multiple Export Options
                </h3>
                <p className="text-muted-foreground text-sm">
                  Choose between standard and high-quality PNG downloads
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
