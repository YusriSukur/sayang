const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Database Table (Safe for Serverless)
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        anniversary_date INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Login Endpoint
app.post('/api/login', async (req, res) => {
  await initDb(); // Ensure table exists
  const { username, anniversaryDate } = req.body;

  try {
    if (anniversaryDate != 22) {
      return res.status(400).json({ error: 'Masa lupa tanggal jadian sendiri? Coba lagi ya sayang! 😜' });
    }

    // Log the login
    await pool.query(
      'INSERT INTO users (username, password, anniversary_date) VALUES ($1, $2, $3)',
      [username, 'logged_in', anniversaryDate]
    ).catch(err => console.log('Log entry skip'));

    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    
    res.json({ 
      message: 'Login successful', 
      token, 
      user: { username: username } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// For Vercel, we export the app
module.exports = app;
