package api

import (
	"net/http"
	"strconv"

	"go-backend/internal/db"

	"github.com/gin-gonic/gin"
)

type MessageInput struct {
	UserID int    `json:"userId" binding:"required"`
	Text   string `json:"text" binding:"required"`
}

func CreateMessage(c *gin.Context) {
	var input MessageInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message := db.Message{
		UserID: input.UserID,
		Text:   input.Text,
	}

	if err := db.DB.Create(&message).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, message)
}

func GetMessages(c *gin.Context) {
	userIdStr := c.Query("userId")
	var messages []db.Message
	var err error

	// userIdRaw, exists := c.Get("userId")
	// if !exists {
	// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
	// 	return
	// }
	
	// userId := userIdRaw.(string)
	// fmt.Println("Clerk userId:", userId)


	if userIdStr != "" {
		userId, err := strconv.Atoi(userIdStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid userId"})
			return
		}
		err = db.DB.Where("user_id = ?", userId).Find(&messages).Error
	} else {
		err = db.DB.Find(&messages).Error
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}
