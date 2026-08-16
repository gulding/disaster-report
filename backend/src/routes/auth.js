const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { requireAuth } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { ime, email, password, telefon } = req.body;

    if (!ime || !email || !password) {
      return res.status(400).json({ error: 'Ime, email i lozinka su obavezni.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Lozinka mora imati najmanje 6 znakova.' });
    }

    const db = getDb();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Korisnik s ovim emailom već postoji.' });
    }

    const id = uuidv4();
    const password_hash = bcrypt.hashSync(password, 10);

    db.prepare(
      'INSERT INTO users (id, ime, email, password_hash, telefon) VALUES (?, ?, ?, ?, ?)'
    ).run(id, ime, email, password_hash, telefon || null);

    const token = jwt.sign({ id, email, ime }, JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      message: 'Registracija uspješna.',
      token,
      user: { id, ime, email, telefon: telefon || null }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email i lozinka su obavezni.' });
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Pogrešan email ili lozinka.' });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Pogrešan email ili lozinka.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, ime: user.ime },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Prijava uspješna.',
      token,
      user: { id: user.id, ime: user.ime, email: user.email, telefon: user.telefon }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  try {
    const db = getDb();
    const user = db.prepare('SELECT id, ime, email, telefon, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Korisnik nije pronađen.' });
    }

    const reportCount = db.prepare('SELECT COUNT(*) as count FROM reports WHERE user_id = ?').get(req.user.id);

    res.json({ ...user, report_count: reportCount.count });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

module.exports = router;
