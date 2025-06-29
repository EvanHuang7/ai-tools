import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";

import CurrentTime from "./components/CurrentTime";
import RedisPanel from "./components/RedisPanel";
import SupabasePostgrePanel from "./components/SupabasePostgrePanel";
import NeonPostgrePanel from "./components/NeonPostgrePanel";
import MongoPanel from "./components/MongoPanel";
import GrpcCall from "./components/GrpcCall";
import GcpPubSub from "./components/GcpPubSub";
import KafkaMessage from "./components/KafkaMessage";

export function App() {
  return (
    <div>
      <h1>
        AI Tools App 👋 GKE Cluster Test after converting frontend app from JS
        to TS
      </h1>
      <CurrentTime api="/api/node/" />
      <CurrentTime api="/api/go/" />
      <CurrentTime api="/api/python/" />
      <RedisPanel />
      <MongoPanel />
      <SupabasePostgrePanel />
      <NeonPostgrePanel />
      <GrpcCall />
      <GcpPubSub />
      <KafkaMessage />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
