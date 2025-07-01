package api

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"google.golang.org/genai"
)

type VideoInput struct {
	Prompt    string `json:"prompt" binding:"required"`
	ImageURL  string `json:"imageUrl"` // optional reference image
}

func GenerateVideo(c *gin.Context) {
	// Get request input
	var input VideoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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

	// NOTE: GOOGLE_API_KEY is required the GCP project having Billing enabled

	// TODO: Make sure the GCS bucket permission to only be pulbic for 
	// Read action, not including Write aciont

	// Create Gemini AI client
	duration := int32(5)
	videoConfig := &genai.GenerateVideosConfig{
		AspectRatio:      "16:9",
		NumberOfVideos: 1,
		// OutputGCSURI: "gs://ai-tools-gcs-bucket/folder/",
		DurationSeconds: &duration,
		PersonGeneration: "dont_allow",
	}

	// Generate video with image or without image if not provided
	var op *genai.GenerateVideosOperation
	if false {
		op, err = client.Models.GenerateVideos(
			ctx,
			"veo-2.0-generate-001",
			input.Prompt,
			// TOOD: store the image to GCS in this api first and use the url from it
			// "GCSURI" means "gs:// type URI" instead of a a public HTTP URL
			&genai.Image{GCSURI: input.ImageURL},
			videoConfig,
		)
	} else {
		op, err = client.Models.GenerateVideos(
			ctx,
			"veo-2.0-generate-001",
			input.Prompt,
			nil,
			videoConfig,
		)
	}

	if err != nil {
		fmt.Println("GenerateVideos error:", err) // 👈 logs error to console
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

    // For simplicity, upload only the first video:
    video := op.Response.GeneratedVideos[0].Video

    // Download the video bytes
    if _, err := client.Files.Download(ctx, video, nil); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to download video bytes"})
        return
    }

    // Upload to your GCS bucket
    bucketName := "ai-tools-gcs-bucket" 
    objectName := "videos/" + "generated_video.mp4" // customize path and filename

    if err := uploadToGCS(ctx, bucketName, objectName, video.VideoBytes); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload video to GCS: " + err.Error()})
        return
    }

    // Return public URL or GCS path (adjust depending on your bucket's ACL)
    publicURL := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, objectName)
    c.JSON(http.StatusOK, gin.H{
        "videoUrl": publicURL,
    })
}

func uploadToGCS(ctx context.Context, bucketName, objectName string, data []byte) error {
    client, err := storage.NewClient(ctx)
    if err != nil {
        return fmt.Errorf("failed to create storage client: %w", err)
    }
    defer client.Close()

    bucket := client.Bucket(bucketName)
    obj := bucket.Object(objectName)
    wc := obj.NewWriter(ctx)
    defer wc.Close()

    if _, err := wc.Write(data); err != nil {
        return fmt.Errorf("failed to write to GCS object: %w", err)
    }
    return nil
}