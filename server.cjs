const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Database Table and Seed User
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
    
    // Seed default user
    const defaultUser = {
      username: 'zil',
      password: 'password123',
      anniversaryDate: 22
    };

    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [defaultUser.username]);
    if (userCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
      await pool.query(
        'INSERT INTO users (username, password, anniversary_date) VALUES ($1, $2, $3)',
        [defaultUser.username, hashedPassword, defaultUser.anniversaryDate]
      );
      console.log('Default user seeded');
    }

    console.log('Database table initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};
initDb();

// Simplified Login Endpoint (Any name allowed, Date must be 22)
app.post('/api/login', async (req, res) => {
  const { username, anniversaryDate } = req.body;

  try {
    // Strictly validate the date
    if (anniversaryDate != 22) {
      return res.status(400).json({ error: 'Masa lupa tanggal jadian sendiri? Coba lagi ya sayang! 😜' });
    }

    // Optional: Log the login to Neon database so you can see who opened it
    await pool.query(
      'INSERT INTO users (username, password, anniversary_date) VALUES ($1, $2, $3)',
      [username, 'logged_in', anniversaryDate]
    ).catch(err => console.log('Log entry failed (possibly duplicate name), but allowing login anyway.'));

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
