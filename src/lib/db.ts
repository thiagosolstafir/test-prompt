import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

// Get the absolute path for the database file
const dbPath = path.join(process.cwd(), 'contacts.db')

// Initialize the database
export async function openDb() {
  // Ensure the database is initialized
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  })
  
  // Create table if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  return db
}
