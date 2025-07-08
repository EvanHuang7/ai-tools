import express from "express";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { listenForPubSubMessages } from "./service/gcpPubsubListener.js";
import { postgreDbClient } from "./lib/postgre.js";
import { users } from "./db/schema.js";
import { ListGcpPubSubMessages } from "./service/gcpPubSubMessages.js";
import { connectKafkaProducer, kafkaProducer } from "./lib/kafka.js";
import userRoutes from "./routes/user.route.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

// Express app config
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// Register Clerk Auth
// The "clerkMiddleware()" function checks the request's cookies and
// headers for a session JWT and if found, attaches the
// Auth object to the request object under the auth key.
app.use(clerkMiddleware());

// setup the logger
app.use(morgan("tiny"));

// Test API
app.get("/", (req, res) => {
  res.json({ api: "node backend", currentTime: new Date().toISOString() });
});

app.get("/ping", async (_, res) => {
  res.send("pong");
});

// Test Postgresql db API
// Create User
app.post("/users", authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await postgreDbClient
      .insert(users)
      .values({ name, email }) // no id or createdAt!
      .returning();

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get All Users
app.get("/users", authMiddleware, async (_, res) => {
  try {
    const result = await postgreDbClient.select().from(users);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test GCP Pubsub
app.get("/gcpPubsubMessage", authMiddleware, async (_, res) => {
  try {
    const result = await ListGcpPubSubMessages();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test Kafka messagee
app.post("/sendKafkaMessage", authMiddleware, async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message in request body" });
  }

  try {
    await kafkaProducer.send({
      topic: "hello-world",
      messages: [{ value: message }],
    });

    res.json({ success: true, message });
  } catch (err) {
    console.error("Failed to send Kafka message:", err);
    res.status(500).json({ error: "Failed to send Kafka message" });
  }
});

// Set up API routes
app.use("/user", authMiddleware, userRoutes);

// We omit the "host" argument between "port" and "()",
// so the host is default to be '0.0.0.0', which means
// node server listens on all interfaces (both external and localhost of physical machine or VM or container).
const server = app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);

  // Start listening to GCP Pub/Sub messages once server is running
  listenForPubSubMessages().catch((err) => {
    console.error("Failed to start GCP Pub/Sub listener:", err);
  });

  // Start a Kafka connection as producer once server is running
  connectKafkaProducer().catch((err) => {
    console.error("Failed to connect Kafka producer:", err);
  });
});

process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});
