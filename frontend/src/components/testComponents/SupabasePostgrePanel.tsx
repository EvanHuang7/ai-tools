import { useState } from "react";
import {
  useSupabasePostgreRead,
  useSupabasePostgreWrite,
} from "../../api/supabasePostgre/supabasePostgre.queries";

const SupabasePostgrePanel: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { data, isLoading } = useSupabasePostgreRead();
  const { mutate, isPending } = useSupabasePostgreWrite();

  const handleSubmit = () => {
    if (name.trim() && email.trim()) {
      mutate({ name, email });
    }
  };

  return (
    <div>
      <h2>⭐ Supabase Postgre Test</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button onClick={handleSubmit} disabled={isPending}>
        Write to PostgreSQL
      </button>
      <div>
        {isLoading ? (
          "Loading..."
        ) : data ? (
          <>
            <p>Name: {data[data.length - 1]?.name}</p>
            <p>Email: {data[data.length - 1]?.email}</p>
            <p>Created At: {data[data.length - 1]?.createdAt}</p>
          </>
        ) : (
          "No data found."
        )}
      </div>
    </div>
  );
};

export default SupabasePostgrePanel;
