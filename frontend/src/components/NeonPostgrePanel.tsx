import { useState } from "react";
import {
  useNeonPostgreRead,
  useNeonPostgreWrite,
} from "../api/neonPostgre/neonPostgre.queries";

const NeonPostgrePanel: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [text, setText] = useState<string>("");

  const { data, isLoading } = useNeonPostgreRead();
  const { mutate, isPending } = useNeonPostgreWrite();

  const handleSubmit = () => {
    if (userId.trim() && text.trim()) {
      mutate({ userId: Number(userId), text });
    }
  };

  return (
    <div>
      <h2>⭐ Neon Postgre Test</h2>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="UserId"
      />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Text"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        Write to PostgreSQL
      </button>
      <div>
        {isLoading ? (
          "Loading..."
        ) : data ? (
          <>
            <p>UserId: {data[data.length - 1]?.ID}</p>
            <p>Text: {data[data.length - 1]?.Text}</p>
          </>
        ) : (
          "No data found."
        )}
      </div>
    </div>
  );
};

export default NeonPostgrePanel;
