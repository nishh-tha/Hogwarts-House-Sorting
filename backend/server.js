// server.js — Main entry point for the Hogwarts Sorting backend

require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const { verifyConnection } = require('./config/db');
const sortingRoutes = require('./routes/sorting');
const path = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────
app.use(cors());                          // Allow requests from your frontend
app.use(express.json());                  // Parse JSON request bodies

app.use(express.static(path.join(__dirname, '..')));       // Serve your frontend files (index.html etc.)

// ─── Routes ───────────────────────────────────
app.use('/api', sortingRoutes);

// Health check — visit http://localhost:3000/health to confirm it's running
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '🧙 Hogwarts Sorting backend is alive!' });
});

// ─── Start ────────────────────────────────────
async function start() {
  try {
    await verifyConnection();

    app.listen(PORT, () => {
      console.log(`\n🏰 Hogwarts Sorting backend running on http://localhost:${PORT}`);
      console.log(`📋 Endpoints:`);
      console.log(`   POST  http://localhost:${PORT}/api/sort`);
      console.log(`   GET   http://localhost:${PORT}/api/results`);
      console.log(`   GET   http://localhost:${PORT}/api/stats`);
      console.log(`   GET   http://localhost:${PORT}/api/houses\n`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});
start();
