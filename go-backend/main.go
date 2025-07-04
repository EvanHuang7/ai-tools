package main

import (
	"log"
	"os"
	"time"

	"go-backend/api"
	"go-backend/internal/db"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// 1 of Clis to run app: air OR go run main.go
func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
	log.Println("No .env file found, relying on environment variables")
	}

	// Connect Postgre db
	db.Init()

    r := gin.Default() // Creates a Gin router with Logger and Recovery middleware

    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "api": "go backend",
			"currentTime": time.Now().Format(time.RFC3339), // ISO8601 timestamp
        })
    })

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, "pong")
	})

	// Add message APIs:
	r.POST("/messages", api.CreateMessage)
	r.GET("/messages", api.GetMessages)

	// Add sendPubSubMessage API:
	r.POST("/pubsubMessage", api.SendPubSubMessage)

	// Generate Gemini Veo2 video API
	r.POST("/veoVideo", api.GenerateVideo)

	// Add gRPC APIs:
	// Start gRPC server in a new goroutine so it doesn't block HTTP server
    go api.StartGrpcServer()

	port := os.Getenv("PORT")
	if port == "" {
		// Defaulting to 8000 to deconflict with unprivileged nginx container
		port = "8000"
	}

	// Host is set to '0.0.0.0', so go server 
	// listens on all interfaces (both external and localhost of physical machine or VM or container).
	r.Run("0.0.0.0:" + port)
}
