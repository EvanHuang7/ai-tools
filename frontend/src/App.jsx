import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";

import CurrentTime from "./components/CurrentTime";
import RedisPanel from "./components/RedisPanel";
import SupabasePostgrePanel from "./components/SupabasePostgrePanel";
import NeonPostgrePanel from "./components/NeonPostgrePanel";
import MongoPanel from "./components/MongoPanel";
import GrpcCall from "./components/GrpcCall";

export function App() {
  return (
    <div>
      <h1>AI Tools App 👋 Test gRPC call for GKE Cluster!</h1>
      <CurrentTime api="/api/node/" />
      <CurrentTime api="/api/go/" />
      <CurrentTime api="/api/python/" />
      <RedisPanel />
      <MongoPanel />
      <GrpcCall />
      <SupabasePostgrePanel />
      <NeonPostgrePanel />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
