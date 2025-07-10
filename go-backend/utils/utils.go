package utils

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"os"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"github.com/golang-jwt/jwt/v5"
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

// Escapes text prompt for URL path usage (used for generating imagekit image)
func UrlPathEscape(s string) string {
	return strings.ReplaceAll(url.QueryEscape(s), "+", "%20")
}

// Get V2 claims including Clerk user subscription plan from Clerk user auth token
func ParseJWT(tokenString string) (jwt.MapClaims, error) {
    parser := jwt.NewParser()
    token, _, err := parser.ParseUnverified(tokenString, jwt.MapClaims{})
    if err != nil {
        return nil, err
    }
    return token.Claims.(jwt.MapClaims), nil
}

// ExtractUserPlan extracts "pro_user" from a raw V2 JWT claim map (expecting "pla": "u:pro_user")
func ExtractUserPlan(claims map[string]interface{}) (string, error) {
	raw, ok := claims["pla"].(string)
	if !ok {
		return "", fmt.Errorf("'pla' field missing or not a string")
	}
	parts := strings.Split(raw, ":")
	if len(parts) != 2 {
		return "", fmt.Errorf("invalid 'pla' format: %s", raw)
	}
	return parts[1], nil // "pro_user"
}

// Get the current year, month, first day of month
func GetCurrentYearAndMonthStart(t time.Time) time.Time {
    return time.Date(t.Year(), t.Month(), 1, 0, 0, 0, 0, t.Location())
}