package api

import (
	"fmt"
	"net/http"
	"net/url"
	"os"

	"github.com/gin-gonic/gin"
)

// GenerateImage handles POST /generateImage
func GenerateImage(c *gin.Context) {
	type requestBody struct {
		Prompt string `json:"prompt" binding:"required"`
	}

	var req requestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing or invalid prompt"})
		return
	}

	imagekitID := os.Getenv("IMAGEKIT_ID")
	if imagekitID == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Missing IMAGEKIT_ID in environment"})
		return
	}

	// Use a placeholder image already uploaded to your ImageKit account
	// This file must exist in your media library and be public
	baseImage := "default.jpg"

	// Encode prompt
	escapedPrompt := url.PathEscape(req.Prompt)
	imageURL := fmt.Sprintf("https://ik.imagekit.io/%s/%s?tr=ik-genimg-prompt-%s", imagekitID, baseImage, escapedPrompt)

	// Optional: check if ImageKit responded successfully
	resp, err := http.Get(imageURL)
	if err != nil || resp.StatusCode != http.StatusOK {
		statusText := "ImageKit generation failed"
		if resp != nil {
			statusText = resp.Status
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": statusText})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"image_url": imageURL,
		"prompt":    req.Prompt,
	})
}
