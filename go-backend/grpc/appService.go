package grpc

import (
	"context"
	"fmt"
	"time"

	apppb "go-backend/gen/app"
)

type appServer struct {
	apppb.UnimplementedAppServiceServer
}

func (s *appServer) GetAppMonthlyUsageKey(ctx context.Context, req *apppb.GetAppMonthlyUsageKeyRequest) (*apppb.GetAppMonthlyUsageKeyResponse, error) {
	// Step 1: Generate a key
	// Sample logic: generate redis key like "usage:abc123:2025-07-10-22-49-33"
	redisKey := fmt.Sprintf("usage:%s:%s", req.UserId, time.Now().Format("2006-01-02-15-04-05"))

	// Step 2: Get the video and remove bg image features usage

	// Step 3: Send a pubsub message with all info to Node backend
	return &apppb.GetAppMonthlyUsageKeyResponse{
		RedisKey: redisKey,
	}, nil
}
