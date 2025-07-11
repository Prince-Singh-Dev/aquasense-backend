const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const {
  getCommand, setCommand,
  getStatus, setStatus,
  getLevel, setLevel
} = require('./memoryStore');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ In-memory storage for supply status (optional)
let supplyAvailable = true;

// 🔄 Root check
app.get('/', (req, res) => res.send('AquaSense Backend is live!'));

// ✅ Frontend sends ON/OFF command
app.post('/command', (req, res) => {
  const { command } = req.body;
  console.log("💻 Received POST /command with:", req.body);

  if (command === "ON" || command === "OFF") {
    setCommand(command);
    console.log("✅ Command set to:", getCommand());
    return res.json({ success: true });
  }

  console.log("❌ Invalid command received:", command);
  res.status(400).json({ success: false, message: "Invalid command" });
});

// ✅ ESP fetches latest command
app.get('/command', (req, res) => {
  const currentCommand = getCommand();
  console.log("📥 ESP requested command:", currentCommand);
  res.json({ command: currentCommand });
});

// ✅ ESP posts motor status
app.post('/status', (req, res) => {
  const { status } = req.body;
  console.log("🛠️ ESP posted motor status:", status);

  if (status === "ON" || status === "OFF") {
    setStatus(status);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid status" });
  }
});

// ✅ Frontend fetches motor status
app.get('/status', (req, res) => {
  const currentStatus = getStatus();
  res.json({ status: currentStatus });
});

// ✅ ESP posts water level
app.post('/level', (req, res) => {
  const { level } = req.body;
  console.log("📊 ESP posted level:", level);

  if (typeof level === 'number' && level >= 0 && level <= 100) {
    setLevel(level);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid level" });
  }
});

// ✅ Frontend fetches water level
app.get('/level', (req, res) => {
  res.json({ level: getLevel() });
});

// ✅ ESP posts supply status
app.post('/supply', (req, res) => {
  const { available } = req.body;
  console.log("🚰 ESP posted supply:", available);

  if (typeof available === 'boolean') {
    supplyAvailable = available;
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid supply status" });
  }
});

// ✅ Frontend fetches supply status
app.get('/supply', (req, res) => {
  res.json({ available: supplyAvailable });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 AquaSense backend running on port ${PORT}`)
);
