import { useState } from "react";
import { useRedisRead, useRedisWrite } from "../hooks/useRedis";

const RedisPanel = () => {
  const [key, setKey] = useState("user-1");
  const [value, setValue] = useState("");
  const { data, isLoading } = useRedisRead(key);
  const { mutate, isPending } = useRedisWrite();

  const handleSubmit = () => {
    if (key && value.trim()) {
      mutate({ key, value });
    }
  };

  return (
    <div>
      <h2>⭐ Redis Test</h2>
      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        placeholder="Key"
      />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        Write to Redis
      </button>
      <div>
        {isLoading ? "Loading..." : `Stored value: ${data?.value || "N/A"}`}
      </div>
    </div>
  );
};

export default RedisPanel;
