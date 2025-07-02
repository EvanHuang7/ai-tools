package api

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

func GenerateVideo(c *gin.Context) {
	// Parse text prompt from form
	prompt := c.PostForm("prompt")
	if prompt == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prompt is required"})
		return
	}

	// Create Gemini AI client
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  os.Getenv("GOOGLE_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create Gemini client"})
		return
	}

	// Parse image file from multipart form
	var imageInput *genai.Image
	file, err := c.FormFile("image")
	if err == nil {
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read uploaded image"})
			return
		}
		defer src.Close()

		buf := new(bytes.Buffer)
		if _, err := io.Copy(buf, src); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read image bytes"})
			return
		}

		mime := mimetype.Detect(buf.Bytes())

		imageInput = &genai.Image{
			ImageBytes: buf.Bytes(),
			MIMEType:   mime.String(), // e.g., "image/jpeg"
		}
	}

	// Prepare video config
	duration := int32(5)
	videoConfig := &genai.GenerateVideosConfig{
		AspectRatio:      "16:9",
		NumberOfVideos:   1,
		DurationSeconds:  &duration,
		PersonGeneration: "dont_allow",
	}

	// Call GenerateVideos
	op, err := client.Models.GenerateVideos(
		ctx,
		"veo-2.0-generate-001",
		prompt,
		imageInput,
		videoConfig,
	)
	if err != nil {
		fmt.Println("GenerateVideos error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "video generation request failed"})
		return
	}

	for !op.Done {
		time.Sleep(20 * time.Second)
		op, err = client.Operations.GetVideosOperation(ctx, op, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error polling video operation"})
			return
		}
	}

	if len(op.Response.GeneratedVideos) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no video generated"})
		return
	}

	video := op.Response.GeneratedVideos[0].Video

	// Download the video bytes
	if _, err := client.Files.Download(ctx, video, nil); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to download video bytes"})
		return
	}

	// Upload to GCS
	bucketName := "ai-tools-gcs-bucket"
	objectName := "videos/generated_video.mp4"
	if err := uploadToGCS(ctx, bucketName, objectName, video.VideoBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload video to GCS: " + err.Error()})
		return
	}

	publicURL := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName)
	c.JSON(http.StatusOK, gin.H{"videoUrl": publicURL})
}

func uploadToGCS(ctx context.Context, bucketName, objectName string, data []byte) error {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to create storage client: %w", err)
	}
	defer client.Close()

	wc := client.Bucket(bucketName).Object(objectName).NewWriter(ctx)
	defer wc.Close()

	if _, err := wc.Write(data); err != nil {
		return fmt.Errorf("failed to write to GCS object: %w", err)
	}
	return nil
}
