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
app.use(cors({ origin: "*" })); // Allow all origins for CORS

app.use(express.json()); // For JSON requests
app.use(express.urlencoded({ extended: true })); // For form submissions


// Load projects from projects.json

let projects = [];
let messages = [];
const projectsPath = path.resolve("projects.json");
try {

  
  projects = JSON.parse(fs.readFileSync(projectsPath, "utf-8"));
  console.log("Projects loaded successfully:", projects);
} catch (err) {
  console.error("Error loading projects.json:", err);
  projects = []; // Fallback to an empty array
}

const messagesPath = path.resolve("messages.json");

// Helper functions
const readMessages = () => {
  try {
    return JSON.parse(fs.readFileSync(messagesPath , 'utf8'));
  } catch (err) {
    return [];
  }
};

const saveMessages = (messages) => {
  fs.writeFileSync(messagesPath,  JSON.stringify(messages, null, 2));
};

// Validate and sanitize input
const processInput = (input) => {
  return {
    name: input.name ? input.name.toString().trim().replace(/[<>]/g, '') : '',
    email: input.email ? input.email.toString().trim().replace(/[<>]/g, '') : '',
    subject: input.subject ? input.subject.toString().trim().replace(/[<>]/g, '') : '',
    message: input.message ? input.message.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') : '',
    consent: !!input.consent
  };
};



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

// Projects route
router.get("/messages", (req, res) => {
  messages = readMessages();
  console.log("Fetching messages...");
  try {
    res.json(messages.map(msg => ({
      name: msg.name,
      subject: msg.subject,
      message: msg.message,
      date: msg.date
    })));
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
// PATCH message read status
router.patch('/messages/:id', (req, res) => {
  try {
    const messages = JSON.parse(fs.readFileSync('messages.json'));
    const updated = messages.map(msg => 
      msg.id === req.params.id ? { ...msg, read: !msg.read } : msg
    );
    fs.writeFileSync('messages.json', JSON.stringify(updated));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
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



router.post('/contact', (req, res) => {
  try {
    console.log('Raw request body:', req.body);
    
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { name, email, subject, message, consent } = processInput(req.body);

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    // Save the message
    const messages = readMessages();
    messages.push({
      id: Date.now(),
      name,
      email,
      subject,
      message,
      date: new Date().toISOString(),
      read: false
    });
    saveMessages(messages);

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});



// Home route
router.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);