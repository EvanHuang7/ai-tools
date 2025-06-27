import PubSub from "google-cloud/pubsub";

const projectId = "steadfast-pivot-462821-p7";

export const gcpPubsubClient = new PubSub({ projectId });
