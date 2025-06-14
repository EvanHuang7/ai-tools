import React from "react";
import { useCurrentTime } from "../hooks/useCurrentTime";

const CurrentTime = ({ api }) => {
  const { data, isLoading, isError, error, isFetching } = useCurrentTime(api);

  if (isLoading) return <p>Loading {api}...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <p>API: {data.api}</p>
      <p>Time from DB: {data.currentTime}</p>
      <div>{isFetching && "Updating..."}</div>
    </div>
  );
};

export default CurrentTime;
