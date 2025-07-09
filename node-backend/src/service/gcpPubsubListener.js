import { gcpPubsubClient } from "../lib/gcpPubSub.js";
import { CreateGcpPubSubMessage } from "./gcpPubSubMessages.js";
import { gcpPubsubSubscriptionName } from "../utils/constants.js";

export const listenForPubSubMessages = async () => {
  const subscription = gcpPubsubClient.subscription(gcpPubsubSubscriptionName);

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

  console.log(`Listening for messages on ${gcpPubsubSubscriptionName}...`);
};
