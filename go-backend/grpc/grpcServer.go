package grpc

import (
	"log"
	"net"

	apppb "go-backend/gen/app"

	"google.golang.org/grpc"
)

func StartGrpcServer() {
	// ":50051" means bind to port 50051 on all available network interfaces (IPv4).
 	// It's shorthand for "0.0.0.0:50051"
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()

	// Register all gRPC services
	apppb.RegisterAppServiceServer(s, &appServer{})

	log.Println("go gRPC server listening on port 50051")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
