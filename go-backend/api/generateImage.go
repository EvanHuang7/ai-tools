package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type requestBody struct {
	Prompt string `json:"prompt" binding:"required"`
}

// GenerateImage downloads an AI-generated image from ImageKit via text prompt,
// then uploads that generated image into your ImageKit media library with a timestamped filename.
func GenerateImage(c *gin.Context) {
	var req requestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing or invalid prompt"})
		return
	}

	imagekitID := os.Getenv("IMAGEKIT_ID")
	privateKey := os.Getenv("IMAGEKIT_PRIVATE_KEY")
	if imagekitID == "" || privateKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Missing IMAGEKIT_ID or IMAGEKIT_PRIVATE_KEY in environment"})
		return
	}

	// Construct AI-generated image URL from prompt and a filename with current timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("generated_%s.jpg", timestamp)
	escapedPrompt := urlPathEscape(req.Prompt)

	// URL format per ImageKit AI transformation docs
	generatedImageURL := fmt.Sprintf("https://ik.imagekit.io/%s/ik-genimg-prompt-%s/%s", imagekitID, escapedPrompt, filename)

	// Step 1: Generate image and download it
	resp, err := http.Get(generatedImageURL)
	if err != nil || resp.StatusCode != 200 {
		statusText := "Failed to download AI-generated image"
		if resp != nil {
			statusText = resp.Status
			resp.Body.Close()
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": statusText})
		return
	}
	defer resp.Body.Close()

	imgBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read AI-generated image bytes"})
		return
	}

	// Step 2: Upload downloaded image bytes to ImageKit upload API using Basic Auth (privateKey)
	uploadURL := "https://upload.imagekit.io/api/v1/files/upload"

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add file part with image bytes and filename
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create multipart file part"})
		return
	}
	if _, err := part.Write(imgBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write image bytes to multipart"})
		return
	}

	// Add fileName form field (optional but recommended)
	if err := writer.WriteField("fileName", filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write fileName field"})
		return
	}

	// Close multipart writer to finalize the form body
	if err := writer.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close multipart writer"})
		return
	}

	// Create HTTP POST request with Basic Auth (privateKey as username, blank password)
	reqUpload, err := http.NewRequest("POST", uploadURL, body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload request"})
		return
	}
	reqUpload.Header.Set("Content-Type", writer.FormDataContentType())
	reqUpload.SetBasicAuth(privateKey, "")

	client := &http.Client{}
	uploadResp, err := client.Do(reqUpload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute upload request"})
		return
	}
	defer uploadResp.Body.Close()

	// Check upload response status
	if uploadResp.StatusCode != http.StatusOK && uploadResp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(uploadResp.Body)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "ImageKit upload failed",
			"status":   uploadResp.Status,
			"response": string(bodyBytes),
		})
		return
	}

	// Parse response to get uploaded image URL
	type uploadResponse struct {
		URL string `json:"url"`
	}

	var upResp uploadResponse
	if err := json.NewDecoder(uploadResp.Body).Decode(&upResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse ImageKit upload response"})
		return
	}

	// Return uploaded image URL and original prompt
	c.JSON(http.StatusOK, gin.H{
		"uploaded_image_url": upResp.URL,
		"prompt":            req.Prompt,
	})
}

// urlPathEscape safely escapes text prompt for URL path usage
func urlPathEscape(s string) string {
	return strings.ReplaceAll(url.QueryEscape(s), "+", "%20")
}
