// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mock data for projects
const projects = [
  {
    id: 1,
    name: "Trello Workspace Clone",
    author: "Jingyi Yang",
    languages: ["React", "Spring Boot", "MySQL"],
    description: "A full-stack project to manage workspaces and tasks.",
  },
  {
    id: 2,
    name: "Weather App",
    author: "Jingyi Yang",
    languages: ["React", "OpenWeatherMap API"],
    description: "A weather application that provides real-time weather information.",
  },
];

// API route to fetch projects
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

// API route to fetch weather data
app.get("/api/weather", async (req, res) => {
  const city = req.query.city || "Halifax";
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});