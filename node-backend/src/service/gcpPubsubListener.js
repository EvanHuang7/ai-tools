import { gcpPubsubClient } from "../lib/gcpPubSub.js";
import { CreateGcpPubSubMessage } from "./gcpPubSubMessages.js";
import { gcpPubsubSubscriptionName } from "../utils/constants.js";

export const listenForPubSubMessages = async () => {
  const subscription = gcpPubsubClient.subscription(gcpPubsubSubscriptionName);

  const messageHandler = async (message) => {
    try {
      // Parse Pub/Sub message
      const payloadString = message.data.toString();
      const payload = JSON.parse(payloadString);

      if (payload.type == "test") {
        await CreateGcpPubSubMessage(payload.message);
      } else {
        // TODO: get audio usage and add that to payload and sent it to kafkas
        console.log("Parsed Pub/Sub message:", payload);
      }

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
