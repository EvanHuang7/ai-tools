import { postgreDbClient } from "../lib/postgre.js";
import { gcpPubSubMessages } from "../db/schema.js";

export const CreateGcpPubSubMessage = async (message) => {
  try {
    const result = await postgreDbClient
      .insert(gcpPubSubMessages)
      .values({ message })
      .returning();

    return result[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const ListGcpPubSubMessages = async () => {
  try {
    return await postgreDbClient.select().from(gcpPubSubMessages);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
