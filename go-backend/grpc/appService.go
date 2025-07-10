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
	// Sample logic: generate redis key like "usage:<userId>:2025-07"
	redisKey := fmt.Sprintf("usage:%s:%s", req.UserId, time.Now().Format("2006-01"))
	return &apppb.GetAppMonthlyUsageKeyResponse{
		RedisKey: redisKey,
	}, nil
}
