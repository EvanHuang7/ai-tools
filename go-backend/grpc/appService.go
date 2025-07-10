package grpc

import (
	"context"
	"fmt"
	"time"

	apppb "go-backend/gen/app"
	"go-backend/service"
	"go-backend/utils"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type appServer struct {
	apppb.UnimplementedAppServiceServer
}

func (s *appServer) GetAppMonthlyUsageKey(ctx context.Context, req *apppb.GetAppMonthlyUsageKeyRequest) (*apppb.GetAppMonthlyUsageKeyResponse, error) {
	// Step 1: Generate a key
	// Sample logic: generate redis key like "usage:abc123:2025-07-10-22-49-33"
	redisKey := fmt.Sprintf("usage:%s:%s", req.UserId, time.Now().Format("2006-01-02-15-04-05"))

	// Step 2: Get feature usage data
	currentImageMonthlyUsage, err := service.GetImageFeatureMonthlyUsage(req.UserId)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to get remove bg image usage: %v", err)
	}

	currentVideoMonthlyUsage, err := service.GetVideoFeatureMonthlyUsage(req.UserId)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to get video generation usage: %v", err)
	}

	// Step 3: Send a pubsub message to Node backend with all info
	// eg. UserId, redisKey, currentImageMonthlyUsage, currentVideoMonthlyUsage
	payload := map[string]interface{}{
		"type": 	  			  "app-monthly-usage",
		"userId":                 req.UserId,
		"redisKey":               redisKey,
		"imageFeatureUsage":      currentImageMonthlyUsage,
		"videoFeatureUsage":      currentVideoMonthlyUsage,
		"timestamp":              time.Now().Format(time.RFC3339),
	}
	_, err = service.PublishMessage(ctx, utils.GCPProjectID, utils.GCPPubSubTopicID, payload)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to publish GCP pubsub message: %v", err)
	}

	return &apppb.GetAppMonthlyUsageKeyResponse{
		RedisKey: redisKey,
	}, nil
}
