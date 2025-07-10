package api

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"go-backend/service"
	"go-backend/utils"
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

	payload := map[string]interface{}{
		"type": 	  "test",
		"message":    req.Message + "Published from Go service",
	}
	id, err := service.PublishMessage(c.Request.Context(), utils.GCPProjectID, utils.GCPPubSubTopicID, payload)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"messageID": id})
}
