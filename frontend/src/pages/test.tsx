import CurrentTime from "@/components/testComponents/CurrentTime";
import RedisPanel from "@/components/testComponents/RedisPanel";
import SupabasePostgrePanel from "@/components/testComponents/SupabasePostgrePanel";
import NeonPostgrePanel from "@/components/testComponents/NeonPostgrePanel";
import MongoPanel from "@/components/testComponents/MongoPanel";
import "../App.css";

export function TestPage() {
  return (
    <div>
      <h1>AI Tools App 👋 Test in GKE cluster</h1>
      <CurrentTime api="/api/node/" />
      <CurrentTime api="/api/go/" />
      <CurrentTime api="/api/python/" />
      <RedisPanel />
      <MongoPanel />
      <SupabasePostgrePanel />
      <NeonPostgrePanel />
    </div>
  );
}
