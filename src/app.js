require("dotenv").config();

// Import the dependencies used to run the app, validate URLs, connect to MongoDB,
// and guard the create-link endpoint against abuse.
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { rateLimit } = require("express-rate-limit");
const Link = require("./models/Link");

const app = express();
// Trust loopback traffic so the rate limiter can correctly read the client IP
// when the app is behind local proxying.
app.set("trust proxy", "loopback");

const PORT = process.env.PORT || 3000;

// Limit how often a client can create short links to reduce spam and abuse.
const linkCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many links created. Please try again later." },
});

// Apply the limiter only to the API route that creates links, then cap request bodies
// so oversized payloads are rejected before they hit the database layer.
app.use("/api/links", linkCreationLimiter);
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "../public")));

// Create a new short code and store the target URL in MongoDB.
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

  // Retry a few times if a generated short code collides with an existing one.
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

// Resolve a short code to its stored destination and redirect the browser.
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

// Provide a lightweight health check so the hosting layer can confirm the app is up
// and that MongoDB is connected before traffic is considered healthy.
app.get("/api/health", (req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "unavailable",
    message: "",
  });
});

// Convert oversized JSON bodies into a JSON error before they explode as a raw Express error.
app.use((error, req, res, next) => {
  if (error.type === "entity.too.large") {
    return res.status(413).json({ error: "Request body must not exceed 20 KB." });
  }

  next(error);
});

// Connect to MongoDB once at startup, initialize the model index, and then begin listening.
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
