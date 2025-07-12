import express from "express";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { listenForPubSubMessages } from "./service/gcpPubsubListener.js";
// import { connectKafkaProducer } from "./lib/kafkaClient.js";
import audioRoutes from "./routes/audio.route.js";
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

// Setup the logger
app.use(morgan("tiny"));

// Manual health check API
app.get("/", (req, res) => {
  res.json({ api: "node backend", currentTime: new Date().toISOString() });
});
// Health check API for node-backend service pod in K8s Cluster
app.get("/ping", async (_, res) => {
  res.send("pong");
});

// Set up API routes
app.use("/audio", authMiddleware, audioRoutes);

// We omit the "host" argument between "port" and "()",
// so the host is default to be '0.0.0.0', which means
// node server listens on all interfaces (both external and localhost of physical machine or VM or container).
const server = app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);

  // Start listening to GCP Pub/Sub messages once server is running
  listenForPubSubMessages().catch((err) => {
    console.error("Failed to start GCP Pub/Sub listener:", err);
  });

  // Comment: Start a Kafka connection as producer once server is running.
  // DEPRECATED Kafka code:
  // connectKafkaProducer().catch((err) => {
  //   console.error("Failed to connect Kafka producer:", err);
  // });
});

process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});
