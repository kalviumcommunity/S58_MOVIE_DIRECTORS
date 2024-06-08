const express = require("express");
const { startDatabase, stopDatabase, isConnected } = require("./db");
const app = express();

const port = process.env.PUBLIC_PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    database: isConnected() ? "connected" : "disconnected",
  });
});

app.post("/post", (req, res) => {
  res.json("connected");
});

app.put("/put", (req, res) => {
  res.json("put connected");
});

app.delete("/delete", (req, res) => {
  res.json("deleted");
});

process.on("SIGINT", async () => {
  await stopDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await stopDatabase();
  process.exit(0);
});

if (require.main === module) {
  app.listen(port, async () => {
    await startDatabase();

    console.log(`🚀 Server running on PORT: ${port}`);
  });
}

module.exports = app;
