require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");

const Url = require("./url.model.js");

const mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// testing if mongodb connect

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  try {
    const checkUrl = new URL(url);
    dns.lookup(checkUrl.hostname, async (err) => {
      if (err) {
        return res.json({ error: "invalid url" });
      }
      const newUrl = new Url({ original_url: url });
      await newUrl.save();
      res.json({ original_url: url, short_url: newUrl.short_url });
    });
  } catch (err) {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/shorturl/:id", async function (req, res) {
  const id = req.params.id;
  try {
    const existingUrl = await Url.findOne({ short_url: id });
    if (existingUrl) {
      console.log(existingUrl);
      res.redirect(existingUrl.original_url);
    } else {
      return { error: "invalid url" };
    }
  } catch (err) {
    throw new Error("Error while checking URL");
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
