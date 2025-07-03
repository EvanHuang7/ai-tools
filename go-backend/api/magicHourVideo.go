package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"strings"
	"time"

	"github.com/gabriel-vasile/mimetype"
	"github.com/gin-gonic/gin"
)

const (
	magicHourAPIKey  = "MAGIC_HOUR_API_KEY"
	uploadURLAPI     = "https://api.magichour.ai/v1/files/upload-urls"
	imageToVideoAPI  = "https://api.magichour.ai/v1/image-to-video"
	videoStatusAPI   = "https://api.magichour.ai/v1/video-projects/%s"
)

type uploadURLResp struct {
	Items []struct {
		UploadURL string `json:"uploadUrl"`
		FilePath  string `json:"filePath"`
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

// POST /generate-magic-video
func GenerateMagicHourVideo(c *gin.Context) {
	prompt := c.PostForm("prompt")
	if prompt == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "prompt is required"})
		return
	}

	// 1. Parse image
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
	exts, _ := mime.ExtensionsByType(mimeType)
	if len(exts) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported file type"})
		return
	}
	ext := strings.TrimPrefix(exts[0], ".")

	// 2. Request upload URL
	payload := []map[string]string{{"type": "image", "extension": ext}}
	payloadBytes, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", uploadURLAPI, bytes.NewBuffer(payloadBytes))
	req.Header.Set("Authorization", "Bearer "+magicHourAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to request upload URL"})
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

	// 3. Upload image
	putReq, _ := http.NewRequest("PUT", uploadURL, bytes.NewReader(imageBytes))
	putReq.Header.Set("Content-Type", "application/octet-stream")
	putResp, err := http.DefaultClient.Do(putReq)
	if err != nil || putResp.StatusCode != 200 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image to Magic Hour"})
		return
	}
	defer putResp.Body.Close()

	// 4. Request video generation
	body := map[string]interface{}{
		"assets": map[string]string{
			"imageFilePath": filePath,
		},
		"prompt":          prompt,
		"durationSeconds": 5,
		"width":           640,
		"height":          360,
	}
	bodyBytes, _ := json.Marshal(body)
	req, _ = http.NewRequest("POST", imageToVideoAPI, bytes.NewReader(bodyBytes))
	req.Header.Set("Authorization", "Bearer "+magicHourAPIKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err = http.DefaultClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to request video generation"})
		return
	}
	defer resp.Body.Close()

	var videoResp imageToVideoResp
	if err := json.NewDecoder(resp.Body).Decode(&videoResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid video response"})
		return
	}

	// 5. Poll video status
	for {
		statusURL := fmt.Sprintf(videoStatusAPI, videoResp.ID)
		req, _ := http.NewRequest("GET", statusURL, nil)
		req.Header.Set("Authorization", "Bearer "+magicHourAPIKey)

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
