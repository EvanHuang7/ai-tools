package main

import (
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func main() {
    r := gin.Default() // Creates a Gin router with Logger and Recovery middleware

    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "api": "go backend",
			"currentTime": time.Now().Format(time.RFC3339), // ISO8601 timestamp
        })
    })

	port := os.Getenv("PORT")
	if port == "" {
		// Defaulting to 8000 to deconflict with unprivileged nginx container
		port = "8000"
	}

	r.Run(":" + port) // listen and serve on 0.0.0.0:8000 (or "PORT" env var if set)}
}
