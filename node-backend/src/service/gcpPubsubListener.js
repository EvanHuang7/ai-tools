import { gcpPubsubClient } from "../lib/gcpPubSub.js";
import { CreateGcpPubSubMessage } from "./gcpPubSubMessages.js";

export const listenForPubSubMessages = async () => {
  const subscriptionName = "nodejs-subscription";
  const subscription = gcpPubsubClient.subscription(subscriptionName);

  const messageHandler = async (message) => {
    try {
      await CreateGcpPubSubMessage(message.data.toString());
      message.ack();
    } catch (err) {
      console.error("Failed to store Pub/Sub message:", err);
    }
  };

  subscription.on("message", messageHandler);
  subscription.on("error", (error) => {
    console.error(`Error receiving message:`, error);
  });

  console.log(`Listening for messages on ${subscriptionName}...`);
};
