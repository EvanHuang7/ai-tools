import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CurrentTime from "./components/CurrentTime";
import RedisPanel from "./components/RedisPanel";
import SupabasePostgrePanel from "./components/SupabasePostgrePanel";
import NeonPostgrePanel from "./components/NeonPostgrePanel";
import MongoPanel from "./components/MongoPanel";
import "./App.css";

export function App() {
  return (
    <div>
      <h1>AI Tools App 👋 Test CI GitHub Worflow!</h1>
      <CurrentTime api="/api/node/" />
      <CurrentTime api="/api/go/" />
      <CurrentTime api="/api/python/" />
      <RedisPanel />
      <MongoPanel />
      <SupabasePostgrePanel />
      <NeonPostgrePanel />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
