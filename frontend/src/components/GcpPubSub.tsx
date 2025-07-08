import { useState } from "react";
import {
  useGcpPubSubRead,
  useGcpPubSubWrite,
} from "../api/gcpPubSub/gcpPubSub.queries";

const GcpPubSub: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const { data, isLoading } = useGcpPubSubRead();
  const { mutate, isPending } = useGcpPubSubWrite();

  const handleSubmit = () => {
    if (message.trim()) {
      mutate({ message });
    }
  };

  return (
    <div>
      <h2>⭐ GcpPubSub</h2>
      <h4>Frontend -(via Http) Go Backend - (via GCP Pubsub) Node Backend</h4>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        Send GCP Pubsub message by calling Go service
      </button>
      <div>
        {isLoading ? (
          "Loading..."
        ) : data ? (
          <>
            <p>Latest GCP pubsub Message:</p>
            <p>{data[data.length - 1]?.message}</p>
          </>
        ) : (
          "No data found."
        )}
      </div>
    </div>
  );
};

export default GcpPubSub;
