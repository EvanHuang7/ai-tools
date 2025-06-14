import express from "express";
import morgan from "morgan";
import { postgreDbClient } from "./lib/postgre.js";
import { users } from "./db/schema.js";

// Express app config
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

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
app.post("/users", async (req, res) => {
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
app.get("/users", async (_, res) => {
  try {
    const result = await postgreDbClient.select().from(users);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const server = app.listen(port, () => {
  console.log(`Node server listening on port ${port}`);
});

process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("HTTP server closed");
  });
});
