import Database from '@tauri-apps/plugin-sql'

let db: Database

export async function initDb() {
  try {
    if (!db) {
      db = await Database.load('sqlite3: todo_list.db')
    }
  }
  catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

export async function getDb() {
  if (!db) {
    await initDb()
  }
  return db
}