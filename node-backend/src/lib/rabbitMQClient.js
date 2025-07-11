import amqplib from "amqplib";
import { getEnvOrFile } from "../utils/utils.js";
import { rabbitmqQueueName } from "../utils/constants.js";

const rabbitmqUrl = getEnvOrFile("RABBITMQ_URL");
let channel;

export const initRabbitMQ = async () => {
  if (channel) return channel;

  const connection = await amqplib.connect(rabbitmqUrl);
  channel = await connection.createChannel();
  await channel.assertQueue(rabbitmqQueueName, { durable: true });

  return channel;
};

export const sendToRabbitMQ = async (messageObject) => {
  const ch = await initRabbitMQ();
  const buffer = Buffer.from(JSON.stringify(messageObject));

  const success = ch.sendToQueue(rabbitmqQueueName, buffer, {
    persistent: true,
  });
  if (!success) throw new Error("Failed to enqueue message");
};
