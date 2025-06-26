package handlers

import (
	"context"
	"fmt"
	"log"
	"net"

	pb "go-backend/gen/greeter" // adjust to your module

	"google.golang.org/grpc"
)

type greeterServer struct {
	pb.UnimplementedGreeterServiceServer
}

func (s *greeterServer) SayHello(ctx context.Context, req *pb.HelloRequest) (*pb.HelloResponse, error) {
	msg := fmt.Sprintf("Hello, %s! (from Go gRPC server)", req.Name)
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

	log.Println("gRPC server listening on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
