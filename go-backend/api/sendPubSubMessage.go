package api

import (
	"go-backend/service"
	"net/http"

	"github.com/gin-gonic/gin"
)


type PublishRequest struct {
	Message string `json:"message"`
}

func SendPubSubMessage(c *gin.Context) {
	var req PublishRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing or invalid message"})
		return
	}

	projectID := "steadfast-pivot-462821-p7"
	topicID := "my-topic"

	id, err := service.PublishMessage(c.Request.Context(), projectID, topicID, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messageID": id})
}
