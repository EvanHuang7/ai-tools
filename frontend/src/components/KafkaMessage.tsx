import { useState } from "react";
import {
  useKafkaMessageRead,
  useKafkaMessageWrite,
} from "../api/kafkaMessage/kafkaMessage.queries";

const KafkaMessage: React.FC = () => {
  const [message, setMessage] = useState<string>("");

  const { data, isLoading } = useKafkaMessageRead();
  const { mutate, isPending } = useKafkaMessageWrite();

  const handleSubmit = () => {
    if (message.trim()) {
      mutate({ message });
    }
  };

  return (
    <div>
      <h2>⭐ Kafka Message</h2>
      <h4>Frontend -(via Http) Nodejs Backend - (via Kafka) Python Backend</h4>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        Send Kafka message by calling Nodejs service
      </button>
      <div>
        {isLoading ? (
          "Loading..."
        ) : data ? (
          <>
            <p>Latest Kafka Message:</p>
            <p>
              {data?.messages?.[data.messages.length - 1]?.message || "N/A"}
            </p>
          </>
        ) : (
          "No data found."
        )}
      </div>
    </div>
  );
};

export default KafkaMessage;
