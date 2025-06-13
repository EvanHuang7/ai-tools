import express from "express";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

// setup the logger
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.json({ api: "node backend", currentTime: new Date().toISOString() });
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
