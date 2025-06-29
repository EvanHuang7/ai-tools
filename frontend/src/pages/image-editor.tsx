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

export function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock mutation since API is commented out
  const processImageMutation = {
    mutateAsync: async () => {
      setIsProcessing(true);
      // Simulate processing
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      setProcessedImage(uploadedImage); // Use uploaded image as processed for demo
      setIsProcessing(false);
      return { data: { processedImageUrl: uploadedImage } };
    },
    isPending: isProcessing,
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setProcessedImage(null);
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

  const processImage = async () => {
    if (!uploadedImage) return;

    setProgress(0);

    try {
      await processImageMutation.mutateAsync();
      setProgress(100);
      toast.success("Background removed successfully!");
    } catch (error) {
      setProgress(0);
      toast.error("Failed to process image");
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = "processed-image.png";
      link.click();
      toast.success("Image downloaded!");
    }
  };

  const clearImages = () => {
    setUploadedImage(null);
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
                    Drag and drop your image or click to browse
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
                          className="max-w-full max-h-64 mx-auto rounded-lg"
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
                        disabled={processImageMutation.isPending}
                        className="w-full"
                      >
                        {processImageMutation.isPending ? (
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

                      {processImageMutation.isPending && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Processing...
                            </span>
                            <span>{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      )}

                      <Button
                        onClick={clearImages}
                        variant="outline"
                        className="w-full"
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
                          className="w-full rounded-lg"
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
                          Download
                        </Button>
                        <Button variant="outline">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Enhance Quality
                        </Button>
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
                  Image Enhancement
                </h3>
                <p className="text-muted-foreground text-sm">
                  Upscale and enhance image quality automatically
                </p>
              </Card>
              <Card className="text-center p-6">
                <Download className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  High Quality Export
                </h3>
                <p className="text-muted-foreground text-sm">
                  Download in multiple formats and resolutions
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
