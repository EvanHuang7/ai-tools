// DEPRECATED Kafka code:
import { Kafka } from "kafkajs";
import {
  kafkaClientId,
  kafkaMechanism,
  kafkaUsername,
} from "../utils/constants.js";
import { getEnvOrFile } from "../utils/utils.js";

const kafkaClient = new Kafka({
  clientId: kafkaClientId,
  brokers: [getEnvOrFile("KAFKA_BOOTSTRAP_SERVER")],
  ssl: true,
  sasl: {
    mechanism: kafkaMechanism,
    username: kafkaUsername,
    password: getEnvOrFile("KAFKA_SASL_USER_PASSWORD"),
  },
});

export const kafkaProducer = kafkaClient.producer();

export async function connectKafkaProducer() {
  await kafkaProducer.connect();
}
