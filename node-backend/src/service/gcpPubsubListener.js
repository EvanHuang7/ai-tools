import { gcpPubsubClient } from "../lib/gcpPubSubClient.js";
import { gcpPubsubSubscriptionName } from "../utils/constants.js";
import { getAudioFeatureMonthlyUsage } from "./audioFeatureMonthlyUsage.js";
// import { kafkaProducer } from "../lib/kafkaClient.js";
import { sendToRabbitMQ } from "../lib/rabbitMQClient.js";

export const listenForPubSubMessages = async () => {
  const subscription = gcpPubsubClient.subscription(gcpPubsubSubscriptionName);

  const messageHandler = async (message) => {
    try {
      // Parse Pub/Sub message
      const payloadString = message.data.toString();
      const payload = JSON.parse(payloadString);

      // Get audio usage and attach it to payload
      const currentAudioMonthlyUsage = await getAudioFeatureMonthlyUsage(
        payload.userId
      );
      const updatedPayload = {
        ...payload,
        audioFeatureUsage: currentAudioMonthlyUsage,
      };

      // Send to RabbitMQ instead of Kafka
      await sendToRabbitMQ(updatedPayload);

      // Comment: Send updated payload to Kafka.
      // DEPRECATED Kafka code:
      // await kafkaProducer.send({
      //   topic: "hello-world",
      //   messages: [{ value: JSON.stringify(updatedPayload) }],
      // });

      message.ack();
    } catch (err) {
      console.error("Failed to process or store Pub/Sub message:", err);
      message.nack(); // requeue for retry
    }
  };

  subscription.on("message", messageHandler);
  subscription.on("error", (error) => {
    console.error(`Error receiving message:`, error);
  });

  console.log(`Listening for messages on ${gcpPubsubSubscriptionName}...`);
};
