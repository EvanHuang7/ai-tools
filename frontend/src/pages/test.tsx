import CurrentTime from "@/components/CurrentTime";
import RedisPanel from "@/components/RedisPanel";
import SupabasePostgrePanel from "@/components/SupabasePostgrePanel";
import NeonPostgrePanel from "@/components/NeonPostgrePanel";
import MongoPanel from "@/components/MongoPanel";
import GrpcCall from "@/components/GrpcCall";
import GcpPubSub from "@/components/GcpPubSub";
import KafkaMessage from "@/components/KafkaMessage";
import "../App.css";

export function TestPage() {
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
    </div>
  );
}
