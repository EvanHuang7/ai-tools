package grpc

import (
	"context"
	"fmt"
	"time"

	pb "go-backend/gen/greeter"
)

type greeterServer struct {
	pb.UnimplementedGreeterServiceServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
	currentTime := time.Now().Format(time.RFC3339)
	msg := fmt.Sprintf("%s called the API from Go gRPC server at %s", req.Name, currentTime)
	return &pb.HelloResponse{Message: msg}, nil
}