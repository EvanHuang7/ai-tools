import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./App.css";

import CurrentTime from "./components/CurrentTime";
import RedisPanel from "./components/RedisPanel";
import SupabasePostgrePanel from "./components/SupabasePostgrePanel";
import NeonPostgrePanel from "./components/NeonPostgrePanel";
import MongoPanel from "./components/MongoPanel";
import GrpcCall from "./components/GrpcCall";
import GcpPubSub from "./components/GcpPubSub";

export function App() {
  return (
    <div>
      <h1>
        AI Tools App 👋 Test GCP PubSub for GKE Cluster! (Fix CA Cert in Go
        image,2)
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
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;
