import React, { useEffect } from "react";
import { useCurrentTime } from "../../api/currentTime/currentTime.queries";
import { useClerk } from "@clerk/clerk-react";

interface CurrentTimeProps {
  api: string;
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ api }) => {
  const { data, isLoading, isError, error, isFetching } = useCurrentTime(api);

  // // Test log for getting billing subscriptions info in frontend
  // const { billing } = useClerk();
  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const result = await billing.getSubscriptions({
  //         initialPage: 1,
  //         pageSize: 10,
  //       });
  //       console.log("✅ subscriptionsResult in front-end", result);
  //     } catch (err) {
  //       console.error("❌ Failed to fetch subscriptions", err);
  //     }
  //   };
  //   fetch();
  // }, [billing]); // include billing in deps

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
