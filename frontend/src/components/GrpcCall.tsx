import React from "react";
import { useGrpcCall } from "../hooks/useGrpcCall";

const GrpcCall: React.FC = () => {
  const { data, isLoading, isError, error, isFetching } = useGrpcCall();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <h2>⭐ GRPC call</h2>
      <h4>Frontend -(via Http) Python Backend - (via GRPC) Go Backend</h4>
      <p>Response Message: {data?.message}</p>
      <div>{isFetching && "Updating..."}</div>
    </div>
  );
};

export default GrpcCall;
