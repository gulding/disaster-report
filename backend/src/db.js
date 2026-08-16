const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './database.sqlite';
const dbPath = path.resolve(__dirname, '..', DB_PATH);

let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      ime TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      telefon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      kategorija TEXT NOT NULL CHECK(kategorija IN ('rupa','pozar','poplava','zemljotres','kliziste','infrastruktura')),
      opis TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      adresa TEXT,
      status TEXT DEFAULT 'novo' CHECK(status IN ('novo','u_obradi','rijeseno')),
      prioritet TEXT DEFAULT 'srednji' CHECK(prioritet IN ('nizak','srednji','visok','kritican')),
      photos TEXT DEFAULT '[]',
      nadlezna_institucija TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS status_history (
      id TEXT PRIMARY KEY,
      report_id TEXT NOT NULL,
      old_status TEXT,
      new_status TEXT NOT NULL,
      changed_by TEXT,
      komentar TEXT,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (report_id) REFERENCES reports(id),
      FOREIGN KEY (changed_by) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_reports_kategorija ON reports(kategorija);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
    CREATE INDEX IF NOT EXISTS idx_reports_location ON reports(latitude, longitude);
    CREATE INDEX IF NOT EXISTS idx_status_history_report ON status_history(report_id);
  `);
}

module.exports = { getDb };
