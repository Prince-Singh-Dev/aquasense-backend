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

app.get('/', (req, res) => res.send('AquaSense Backend is live!'));

// Frontend sends ON/OFF command
app.post('/command', (req, res) => {
  const { command } = req.body;
  if (command === "ON" || command === "OFF") {
    setCommand(command);
    return res.json({ success: true });
  }
  res.status(400).json({ success: false, message: "Invalid command" });
});

// ESP fetches latest command
app.get('/command', (req, res) => {
  res.json({ command: getCommand() });
});

// ESP posts motor status
app.post('/status', (req, res) => {
  const { status } = req.body;
  if (status) {
    setStatus(status);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Frontend fetches motor status
app.get('/status', (req, res) => {
  res.json({ status: getStatus() });
});

// ESP posts water level
app.post('/level', (req, res) => {
  const { level } = req.body;
  if (level >= 0 && level <= 100) {
    setLevel(level);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

// Frontend gets water level
app.get('/level', (req, res) => {
  res.json({ level: getLevel() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 AquaSense backend running on port ${PORT}`));
