package main

import (
	"log"
	"os"
	"time"

	"go-backend/api"
	"go-backend/internal/db"
	"go-backend/middleware"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// 1 of Clis to run app: air OR go run main.go
func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	// Connect Neon Postgre db
	db.Init()
	
	// Creates a Gin router with Logger and Recovery middleware
    r := gin.Default()

	// Public APIs
	// Manual health check API
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "api": "go backend",
			"currentTime": time.Now().Format(time.RFC3339),
        })
    })
	// Health check API for go-backend service pod in K8s Cluster
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, "pong")
	})

	// Protected APIs
	// Only applying the Clerk auth middleware to routes registered on
	// the auth group. Any routes defined outside that group are not protected.
	auth := r.Group("/")
	auth.Use(middleware.ClerkMiddleware())

	// Add message APIs:
	auth.POST("/messages", api.CreateMessage)
	auth.GET("/messages", api.GetMessages)

	// Add sendPubSubMessage API
	auth.POST("/pubsubMessage", api.SendPubSubMessage)

	// Generate video API (Gemini Veo2)
	auth.POST("/generate-video", api.GenerateVeo2Video)

	// image API (ImageKit)
	auth.POST("/generate-image", api.GenerateImage)
	auth.get("/list-images", api.ListImages)

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
