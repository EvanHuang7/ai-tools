package api

import (
	"context"
	"net/http"
	"os"
	"time"

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

	// TODO: Make sure the GCS bucket permission to only be pulbic for 
	// Read action, not including Write aciont

	// Create Gemini AI client
	duration := int32(5)
	videoConfig := &genai.GenerateVideosConfig{
		AspectRatio:      "16:9",
		NumberOfVideos: 1,
		OutputGCSURI: "gs://ai-tools-gcs-bucket/folder/",
		DurationSeconds: &duration,
		PersonGeneration: "dont_allow",
	}

	// Generate video with image or without image if not provided
	var op *genai.GenerateVideosOperation
	if input.ImageURL != "" {
		op, err = client.Models.GenerateVideos(
			ctx,
			"veo-2.0-generate-001",
			input.Prompt,
			// TOOD: store the image to GCS in this api first and use the url from it
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

	c.JSON(http.StatusOK, gin.H{
		"videoUrl": op.Response.GeneratedVideos[0].Video.URI,
	})
}