require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Link = require("./models/Link");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/api/links", async (req, res) => {
  const destination = req.body?.url;

  if (typeof destination !== "string") {
    return res.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }

  let parsedDestination;
  try {
    parsedDestination = new URL(destination);
  } catch {
    return res.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }

  if (!["http:", "https:"].includes(parsedDestination.protocol)) {
    return res.status(400).json({ error: "Enter a valid HTTP or HTTPS URL." });
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const code = crypto.randomBytes(6).toString("base64url");

    try {
      await Link.create({ code, url: parsedDestination.toString() });
      return res.status(201).json({ code, path: `/l/${code}` });
    } catch (error) {
      if (error.code !== 11000 || attempt === 2) {
        return res.status(503).json({ error: "Link storage is temporarily unavailable." });
      }
    }
  }
});

app.get("/l/:code", async (req, res) => {
  let link;
  try {
    link = await Link.findOne({ code: req.params.code }).select("url").lean();
  } catch {
    return res.status(503).send("Link storage is temporarily unavailable.");
  }

  if (!link) {
    return res.status(404).send("Short link not found.");
  }

  res.redirect(302, link.url);
});

app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "unavailable",
    message: "",
  });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await Link.init();

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`http://127.0.0.1:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(`Unable to start LinkLocker: ${error.message}`);
  process.exit(1);
});
