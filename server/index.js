const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Create a new ticket
app.post("/tickets", (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message is required." });
  }

  const sql = `
    INSERT INTO tickets (message)
    VALUES (?)
  `;

  db.run(sql, [message], function (err) {
    if (err) {
      console.error("Error inserting ticket:", err.message);
      return res.status(500).json({ error: "Failed to save ticket." });
    }

    res.status(201).json({
      id: this.lastID,
      message,
      category: "general",
      priority: "normal",
      suggested_reply: "",
    });
  });
});

// Get all tickets
app.get("/tickets", (req, res) => {
  const sql = `
    SELECT * FROM tickets
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching tickets:", err.message);
      return res.status(500).json({ error: "Failed to fetch tickets." });
    }

    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});