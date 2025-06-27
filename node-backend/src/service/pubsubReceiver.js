import { gcpPubsubClient } from "../lib/gcpPubSub.js";

export const listenForPubSubMessages = async () => {
  const subscriptionName = "nodejs-subscription";
  const subscription = gcpPubsubClient.subscription(subscriptionName);

  const messageHandler = (message) => {
    console.log(`Received message: ${message.data.toString()}`);
    message.ack(); // Acknowledge the message
  };

  subscription.on("message", messageHandler);
  subscription.on("error", (error) => {
    console.error(`Error receiving message:`, error);
  });

  console.log(`Listening for messages on ${subscriptionName}...`);
};
