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
	var input VideoInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  os.Getenv("GOOGLE_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create Gemini client"})
		return
	}

	videoConfig := &genai.GenerateVideosConfig{
		AspectRatio:      "16:9",
		PersonGeneration: "dont_allow",
	}

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
		time.Sleep(10 * time.Second)
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