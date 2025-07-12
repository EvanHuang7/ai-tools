import CurrentTime from "@/components/testComponents/CurrentTime";
import "../App.css";

export function TestPage() {
  return (
    <div>
      <h1>AI Tools App 👋 Test in GKE cluster for using RabbitMQ</h1>
      <CurrentTime api="/api/node/" />
      <CurrentTime api="/api/go/" />
      <CurrentTime api="/api/python/" />
    </div>
  );
}
