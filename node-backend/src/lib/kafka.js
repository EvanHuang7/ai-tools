import { Kafka } from "kafkajs";
import {
  kafkaClientId,
  kafkaBrokers,
  kafkaMechanism,
  kafkaUsername,
  kafkaPassword,
} from "../utils/constants.js";

const kafkaClient = new Kafka({
  clientId: kafkaClientId,
  brokers: kafkaBrokers,
  ssl: true,
  sasl: {
    mechanism: kafkaMechanism,
    username: kafkaUsername,
    password: kafkaPassword,
  },
});

export const kafkaProducer = kafkaClient.producer();

export async function connectKafkaProducer() {
  await kafkaProducer.connect();
}
