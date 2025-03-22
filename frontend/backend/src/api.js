const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Correctly import node-fetch
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors());

// Load projects from projects.json


try {
  const projectsPath = path.join(__dirname, "projects.json");
  const fullPath = path.resolve("projects.json");
  projects = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
  console.log("Projects loaded successfully:", projects);
} catch (err) {
  console.error("Error loading projects.json:", err);
  projects = []; // Fallback to an empty array
}
// Projects route
router.get("/projects", (req, res) => {
  try {
    console.log("Fetching projects...");
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Cannot open file", details: err.message });
  }
});

// Weather route
router.get("/weather", async (req, res) => {
  console.log("Fetching weather data...");
  try {
    const weatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=halifax,ca&units=metric&appid=${process.env.WEATHER_API_KEY}`;
    console.log("Weather API URL:", weatherAPI);

    const response = await fetch(weatherAPI);
    console.log("OpenWeatherMap API response status:", response.status);

    if (!response.ok) {
      throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Weather data received:", data);

    // Extract required fields
    const weatherData = {
      city: data.name,
      temperature: { current: data.main.temp },
      humidity: data.main.humidity,
    };

    res.json(weatherData);
  } catch (err) {
    console.error("Error fetching weather data:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Home route
router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);