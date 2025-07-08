import React from "react";
import { useCurrentTime } from "../api/currentTime/currentTime.queries";

interface CurrentTimeProps {
  api: string;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ api }) => {
  const { data, isLoading, isError, error, isFetching } = useCurrentTime(api);

  if (isLoading) return <p>Loading {api}...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <h2>⭐ API: {data?.api}</h2>
      <p>Time from DB: {data?.currentTime}</p>
      <div>{isFetching && "Updating..."}</div>
    </div>
  );
};

export default CurrentTime;
