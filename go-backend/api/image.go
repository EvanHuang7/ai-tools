package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"go-backend/db"
	"go-backend/service"
	"go-backend/utils"
)

type generateImageRequest struct {
	Prompt string `json:"prompt" binding:"required"`
}

// Parse upload image API response to get uploaded image URL after
// uploading generated image to Imagekit.
type uploadImageResponse struct {
	URL string `json:"url"`
}

// GenerateImage downloads an AI-generated image from ImageKit via text prompt,
// then uploads that generated image into your ImageKit media library with a timestamped filename.
func GenerateImage(c *gin.Context) {
	// Step 1: Check app feature monthly usage
	// Get Clerk userId and userPlan from Gin context
	userIDRaw, idOk := c.Get("userId")
	userPlanRaw, planOk := c.Get("userPlan")
	if !idOk || !planOk {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDRaw.(string)
	userPlan := userPlanRaw.(string)
	
	// Check the current monthly usage based on user plan first
	currentMonthlyUsage, err := service.GetImageFeatureMonthlyUsage(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get usage: " + err.Error()})
		return
	}

	monthlyLimit := 0
	switch userPlan {
	case "free_user":
		monthlyLimit = utils.FreeUserImageFeatureMonthlyLimit
	case "standard_user":
		monthlyLimit = utils.StandardUserImageFeatureMonthlyLimit
	case "pro_user":
		monthlyLimit = utils.ProUserImageFeatureMonthlyLimit
	default:
		monthlyLimit = 0
	}

	if currentMonthlyUsage >= monthlyLimit {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error": "You've exceeded your monthly image generation feature usage limit. Please upgrade your plan to continue.",
		})
		return
	}

	// Step 2: Generate image with Imagekit and download it
	// Get api request body and check the Imagekit credentials
	var req generateImageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing or invalid prompt"})
		return
	}

	imagekitID := utils.GetEnvOrFile("IMAGEKIT_ID")
	privateKey := utils.GetEnvOrFile("IMAGEKIT_PRIVATE_KEY")
	if imagekitID == "" || privateKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Missing IMAGEKIT_ID or IMAGEKIT_PRIVATE_KEY in environment"})
		return
	}

	// Build file name and prompt used in generate image API URL
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("generated_%s.jpg", timestamp)
	escapedPrompt := utils.UrlPathEscape(req.Prompt)

	// Build generate image API URL
	generatedImageURL := fmt.Sprintf(utils.GeneratedImageURLTemplate, imagekitID, escapedPrompt, filename)

	// Make generate image API call
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

	// Read the generated image
	imgBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read AI-generated image bytes"})
		return
	}

	// Step 3: Upload downloaded image to ImageKit
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	// Add file form field
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create multipart file part"})
		return
	}
	if _, err := part.Write(imgBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write image bytes to multipart"})
		return
	}

	// Add fileName form field
	if err := writer.WriteField("fileName", filename); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to write fileName field"})
		return
	}

	// Close multipart writer to finalize the form body
	if err := writer.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close multipart writer"})
		return
	}

	// Build Upload image API request
	reqUpload, err := http.NewRequest("POST", utils.UploadImageAPIURL, body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload request"})
		return
	}
	reqUpload.Header.Set("Content-Type", writer.FormDataContentType())
	reqUpload.SetBasicAuth(privateKey, "")

	// Make Upload image API call
	client := &http.Client{}
	uploadResp, err := client.Do(reqUpload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute upload request"})
		return
	}
	defer uploadResp.Body.Close()

	// If upload image API status is not 200, return error
	if uploadResp.StatusCode != http.StatusOK && uploadResp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(uploadResp.Body)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "ImageKit upload failed",
			"status":   uploadResp.Status,
			"response": string(bodyBytes),
		})
		return
	}

	// Get public image url from upload image API response
	var upResp uploadImageResponse
	if err := json.NewDecoder(uploadResp.Body).Decode(&upResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse ImageKit upload response"})
		return
	}

	// Step 4: Create data in Neon db
	// Create an entry in Image table.
	// Don't need to add CreatedAt and UpdatedAt fields
	// because GORM automatically populates these fields.
	image := db.Image{
		UserID:	userID,
		Prompt: req.Prompt,
		ImageURL: upResp.URL,
	}
	if err := db.DB.Create(&image).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Step 5: Increment monthly usage in DB
	if err := service.IncrementImageFeatureMonthlyUsage(userID, 1); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update monthly usage"})
		return
	}
	
	// Return created image in API response
	c.JSON(http.StatusOK, image)
}

// List all generated images for logged in user
func ListImages(c *gin.Context) {
	// Get Clerk userId from Gin context
	userIdRaw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	clerkUserId := userIdRaw.(string)

	// Get all existing generated image for this user
	var images []db.Image
	err := db.DB.Where("user_id = ?", clerkUserId).Order("created_at DESC").Find(&images).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, images)
}