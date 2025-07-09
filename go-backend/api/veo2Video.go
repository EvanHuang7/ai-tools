package api

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
	"google.golang.org/genai"

	"go-backend/utils"
)

func GenerateVeo2Video(c *gin.Context) {
	// Parse text prompt from form data
	prompt := c.PostForm("prompt")
	if prompt == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prompt is required"})
		return
	}

	// Create Gemini AI client
	ctx := context.Background()
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  utils.GetEnvOrFile("GOOGLE_API_KEY"),
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create Gemini client", "detail": err.Error()})
		return
	}

	// Parse image file from multipart form
	var imageInput *genai.Image
	var baseFilename string
	file, err := c.FormFile("image")
	if err == nil {
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read uploaded image", "detail": err.Error()})
			return
		}
		defer src.Close()

		buf := new(bytes.Buffer)
		if _, err := io.Copy(buf, src); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read image bytes", "detail": err.Error()})
			return
		}

		// Detect MIME type
		mime := mimetype.Detect(buf.Bytes())

		// Generate timestamp and safe base filename
		timestamp := time.Now().Format("20060102_150405")
		ext := filepath.Ext(file.Filename)
		baseFilename = file.Filename[:len(file.Filename)-len(ext)]
		imageObjectName := fmt.Sprintf("images/%s_%s%s", baseFilename, timestamp, ext)

		// Upload input image to GCS
		if err := utils.UploadToGCS(ctx, imageObjectName, buf.Bytes()); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload input image to GCS", "detail": err.Error()})
			return
		}

		// Use image bytes for video generation
		imageInput = &genai.Image{
			ImageBytes: buf.Bytes(),
			MIMEType:   mime.String(),
		}
	}

	// Prepare video config
	duration := int32(utils.VideoDuration)
	videoConfig := &genai.GenerateVideosConfig{
		AspectRatio:      utils.VideoAspectRatio,
		NumberOfVideos:   utils.VideoNumber,
		DurationSeconds:  &duration,
		PersonGeneration: utils.VideoPersonGeneration,
	}

	// NOTE: GOOGLE_API_KEY is required the GCP project having Billing enabled
	// Call "GenerateVideos"
	op, err := client.Models.GenerateVideos(
		ctx,
		utils.VeoModel,
		prompt,
		imageInput,
		videoConfig,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "video generation request failed", "detail": err.Error()})
		return
	}

	// Repeatedly checks whether the video generation operation has finished
	for !op.Done {
		// Waits for 20 seconds between each check
		time.Sleep(20 * time.Second)
		op, err = client.Operations.GetVideosOperation(ctx, op, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error polling video operation", "detail": err.Error()})
			return
		}
	}

	if len(op.Response.GeneratedVideos) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "no video generated", "detail": "Gemini returned an empty video list"})
		return
	}

	video := op.Response.GeneratedVideos[0].Video

	// Download the video bytes
	if _, err := client.Files.Download(ctx, video, nil); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to download video bytes", "detail": err.Error()})
		return
	}

	// Upload to GCS
	timestamp := time.Now().Format("20060102_150405")
	if baseFilename == "" {
		baseFilename = "video"
	}
	videoName := fmt.Sprintf("videos/%s_%s_generated_video.mp4", baseFilename, timestamp)

	if err := utils.UploadToGCS(ctx, videoName, video.VideoBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload video to GCS", "detail": err.Error()})
		return
	}

	publicURL := fmt.Sprintf(utils.GeneratedVeoPublicURLTemplate, videoName)
	c.JSON(http.StatusOK, gin.H{"videoUrl": publicURL})
}
