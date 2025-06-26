package service

import (
	"context"
	"fmt"

	"cloud.google.com/go/pubsub"
)

func PublishMessage(ctx context.Context, projectID, topicID, message string) (string, error) {
	client, err := pubsub.NewClient(ctx, projectID)
	if err != nil {
		return "", fmt.Errorf("failed to create pubsub client: %w", err)
	}
	defer client.Close()

	topic := client.Topic(topicID)
	result := topic.Publish(ctx, &pubsub.Message{
		Data: []byte(message),
	})

	id, err := result.Get(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to publish message: %w", err)
	}

	return id, nil
}
