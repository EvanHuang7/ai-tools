package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
)

const (
	uploadURLAPI    = "https://api.magichour.ai/v1/files/upload-urls"
	imageToVideoAPI = "https://api.magichour.ai/v1/image-to-video"
	videoStatusAPI  = "https://api.magichour.ai/v1/video-projects/%s"
)

type uploadURLResp struct {
	Items []struct {
		UploadURL string `json:"upload_url"`
		FilePath  string `json:"file_path"`
	} `json:"items"`
}

type imageToVideoResp struct {
	ID string `json:"id"`
}

type videoStatusResp struct {
	Status    string `json:"status"`
	Downloads []struct {
		URL string `json:"url"`
	} `json:"downloads"`
}

func GenerateMagicHourVideo(c *gin.Context) {
	apiKey := os.Getenv("MAGIC_HOUR_API_KEY")
	if apiKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "MAGIC_HOUR_API_KEY not set in environment"})
		return
	}

	prompt := c.PostForm("prompt")
	if prompt == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prompt is required"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "image is required"})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to open uploaded file"})
		return
	}
	defer src.Close()

	buf := new(bytes.Buffer)
	if _, err := io.Copy(buf, src); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read image bytes"})
		return
	}
	imageBytes := buf.Bytes()

	mimeType := mimetype.Detect(imageBytes).String()
	mimeToExt := map[string]string{
		"image/jpeg": "jpeg",
		"image/jpg":  "jpg",
		"image/png":  "png",
		// Add more as needed
	}
	
	ext := mimeToExt[mimeType]
	if ext == "" {
		exts, _ := mime.ExtensionsByType(mimeType)
		if len(exts) > 0 {
			ext = strings.TrimPrefix(exts[0], ".")
		}
	}


	// Step 1: Request upload URL 
	uploadPayload := map[string][]map[string]string{
		"items": {
			{
				"type":      "image",
				"extension": ext, // like "png", "jpg"
			},
		},
	}
	payloadBytes, _ := json.Marshal(uploadPayload)

	req, _ := http.NewRequest("POST", uploadURLAPI, bytes.NewBuffer(payloadBytes))
	req.Header.Set("Authorization", "Bearer "+os.Getenv("MAGIC_HOUR_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":     "failed to request upload URL",
			"status":    resp.StatusCode,
			"response":  string(body),
			"mime_type": mimeType,
			"ext":       ext,
		})
		return
	}
	defer resp.Body.Close()

	var uploadResp uploadURLResp
	if err := json.NewDecoder(resp.Body).Decode(&uploadResp); err != nil || len(uploadResp.Items) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid upload URL response"})
		return
	}

	uploadURL := uploadResp.Items[0].UploadURL
	filePath := uploadResp.Items[0].FilePath

	// Step 2: Upload image file
	putReq, _ := http.NewRequest("PUT", uploadURL, bytes.NewReader(imageBytes))
	putReq.Header.Set("Content-Type", "application/octet-stream")
	putResp, err := http.DefaultClient.Do(putReq)
	if err != nil || putResp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image"})
		return
	}
	defer putResp.Body.Close()

	// Step 3: Trigger image-to-video
	body := map[string]interface{}{
		"name":           "Generated video",
		"end_seconds":    5,
		"height":         960,
		"width":          512,
		"style": map[string]interface{}{
			"prompt":        prompt,
			"high_quality":  false,
			"quality_mode":  "quick",
		},
		"assets": map[string]interface{}{
			"image_file_path": filePath,
		},
	}
	bodyBytes, _ := json.Marshal(body)
	req, _ = http.NewRequest("POST", imageToVideoAPI, bytes.NewReader(bodyBytes))
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err = http.DefaultClient.Do(req)
	if err != nil || (resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated) {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to start video generation"})
		return
	}
	defer resp.Body.Close()

	var videoResp imageToVideoResp
	if err := json.NewDecoder(resp.Body).Decode(&videoResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid video creation response"})
		return
	}

	// Step 4: Poll for completion
	for {
		statusURL := fmt.Sprintf(videoStatusAPI, videoResp.ID)
		req, _ := http.NewRequest("GET", statusURL, nil)
		req.Header.Set("Authorization", "Bearer "+apiKey)

		statusResp, err := http.DefaultClient.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to check video status"})
			return
		}

		var status videoStatusResp
		if err := json.NewDecoder(statusResp.Body).Decode(&status); err != nil {
			statusResp.Body.Close()
			c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid status response"})
			return
		}
		statusResp.Body.Close()

		if status.Status == "complete" && len(status.Downloads) > 0 {
			c.JSON(http.StatusOK, gin.H{"videoUrl": status.Downloads[0].URL})
			return
		} else if status.Status == "error" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "video generation failed"})
			return
		}

		time.Sleep(3 * time.Second)
	}
}
