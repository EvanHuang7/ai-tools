package service

import (
	"context"
	"encoding/json"
	"fmt"

	"cloud.google.com/go/pubsub"
)

func PublishMessage(ctx context.Context, projectID, topicID string, messagePayload any) (string, error) {
	// Marshal structured payload to JSON
	msgBytes, err := json.Marshal(messagePayload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal message payload: %w", err)
	}

	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		return "", fmt.Errorf("failed to create pubsub client: %w", err)
	}
	defer client.Close()

	topic := client.Topic(topicID)
	result := topic.Publish(ctx, &pubsub.Message{
		Data: msgBytes,
	})

	id, err := result.Get(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to publish message: %w", err)
	}

	return id, nil
}
