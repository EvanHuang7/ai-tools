package handlers

import (
	"context"
	"fmt"
	"log"

	"cloud.google.com/go/pubsub"
)

func main() {
    ctx := context.Background()

    // Replace with your Google Cloud project ID
    projectID := "your-project-id"
    topicID := "my-topic"

    client, err := pubsub.NewClient(ctx, projectID)
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }
    defer client.Close()

    topic := client.Topic(topicID)

    result := topic.Publish(ctx, &pubsub.Message{
        Data: []byte("Hello from Go!"),
    })

    // Block until the result is returned and a server-generated
    // ID is returned for the published message.
    id, err := result.Get(ctx)
    if err != nil {
        log.Fatalf("Failed to publish: %v", err)
    }
    fmt.Printf("Published message ID: %v\n", id)
}
