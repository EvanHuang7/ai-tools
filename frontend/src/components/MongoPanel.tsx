import { useState } from "react";
import { useMongoRead, useMongoWrite } from "../api/mongo/mongo.queries";

const MongoPanel: React.FC = () => {
  const [userId, setUserId] = useState<string>("1");
  const [plan, setPlan] = useState<string>("");
  const { data, isLoading } = useMongoRead(userId);
  const { mutate, isPending } = useMongoWrite();

  const handleSubmit = () => {
    if (userId && plan.trim()) {
      mutate({ userId, plan });
    }
  };

  return (
    <div>
      <h2>⭐ Mongo Test</h2>
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="UserId"
      />
      <input
        value={plan}
        onChange={(e) => setPlan(e.target.value)}
        placeholder="Plan"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        Write to Mongo
      </button>
      <div>
        {isLoading
          ? "Loading..."
          : `Stored value: ${data?.plans[0]?.plan || "N/A"}`}
      </div>
    </div>
  );
};

export default MongoPanel;
