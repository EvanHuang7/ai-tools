import { PubSub } from "@google-cloud/pubsub";
import { gcpProjectId } from "../utils/constants.js";

export const gcpPubsubClient = new PubSub({ gcpProjectId });
