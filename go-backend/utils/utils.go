package utils

import (
	"context"
	"fmt"
	"log"
	"os"

	"cloud.google.com/go/storage"
)

// Gets the environment variable by key.
// If not found, it tries to read from the file specified by ${KEY}_FILE.
// If both fail and no default is provided, it returns an empty string.
func GetEnvOrFile(key string, defaultValue ...string) string {
	val := os.Getenv(key)
	if val != "" {
		return val
	}

	// Read the secret from file Only if creating a docker secret 
	// within Docker Swarm.
	filePath := os.Getenv(key + "_FILE")
	if filePath != "" {
		content, err := os.ReadFile(filePath)
		if err != nil {
			log.Fatalf("Failed to read from %s: %v", filePath, err)
		}
		return string(content)
	}

	if len(defaultValue) > 0 {
		return defaultValue[0]
	}

	return ""
}

// Upload image or video to GCS
func UploadToGCS(ctx context.Context, objectName string, data []byte) error {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return fmt.Errorf("failed to create storage client: %w", err)
	}
	defer client.Close()

	wc := client.Bucket(GCSBucketName).Object(objectName).NewWriter(ctx)
	defer wc.Close()

	if _, err := wc.Write(data); err != nil {
		return fmt.Errorf("failed to write to GCS object: %w", err)
	}
	return nil
}