import { Kafka } from "kafkajs";

const kafkaClient = new Kafka({
  clientId: "nodejs-app",
  brokers: [
    "d1fgarsdfulgj4bj0b60.any.us-west-2.mpx.prd.cloud.redpanda.com:9092",
  ],
  ssl: true,
  sasl: {
    mechanism: "SCRAM-SHA-256",
    username: "ai-tools-redpanda-user",
    password: "Ab12345678!",
  },
});

export const kafkaProducer = kafkaClient.producer();

export async function connectKafkaProducer() {
  await kafkaProducer.connect();
}
