package api

import (
	"context"
	"fmt"
	"log"
	"net"
	"time"

	pb "go-backend/gen/greeter" // adjust to your module

	"google.golang.org/grpc"
)

type greeterServer struct {
	pb.UnimplementedGreeterServiceServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
	currentTime := time.Now().Format(time.RFC3339)
	msg := fmt.Sprintf("%s called the API from Go gRPC server at %s", req.Name, currentTime)
	return &pb.HelloResponse{Message: msg}, nil
}

func StartGrpcServer() {
	// ":50051" means bind to port 50051 on all available network interfaces (IPv4).
 	// It's shorthand for "0.0.0.0:50051"
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServiceServer(s, &greeterServer{})

	log.Println("go gRPC server listening on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
