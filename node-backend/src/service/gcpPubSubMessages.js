import { postgreDbClient } from "../lib/postgre.js";
import { gcpPubSubMessages } from "../db/schema.js";

export const CreateGcpPubSubMessage = async (message) => {
  try {
    const result = await postgreDbClient
      .insert(gcpPubSubMessages)
      .values({ message: message + "(Received and stored in Nodejs service)" })
      .returning();

    return result[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};
