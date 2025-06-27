import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
  clientId: "node-app",
  brokers: ["your-bootstrap-url:9092"],
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: "your-username",
    password: "your-password",
  },
});

export const kafkaProducer = kafkaClient.producer();

export async function connectKafkaProducer() {
  await kafkaProducer.connect();
}
