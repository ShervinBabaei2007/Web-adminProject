require("dotenv").config();

const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const links = new Map();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.post("/api/links", (req, res) => {
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

  let code;
  do {
    code = crypto.randomBytes(6).toString("base64url");
  } while (links.has(code));

  links.set(code, parsedDestination.toString());
  res.status(201).json({ code, path: `/l/${code}` });
});

app.get("/l/:code", (req, res) => {
  const destination = links.get(req.params.code);

  if (!destination) {
    return res.status(404).send("Short link not found.");
  }

  res.redirect(302, destination);
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "",
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
