import type { Todo } from '../types/todo'
import { getDb } from './db'

class TodoModel {
  static async createTable() {
    const db = await getDb()
    await db.execute(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                completed BOOLEAN NOT NULL,
                createdAt TEXT NOT NULL,
            )
        `)
  }

  static async addTodo(todo: Todo) {
    const db = await getDb()
    const result = await db.execute(
      'INSERT INTO todos (name, completed, createdAt) VALUES (?, ?, ?, ?)',
      [todo.name, todo.completed, todo.createdAt.toISOString()],
    )
    return result.lastInsertId
  }

  static async getTasks(limit: number = 10, offset: number = 0): Promise<Todo[]> {
    const db = await getDb()
    const result = await db.select<Todo[]>(
      'SELECT id, name, completed, createdAt FROM todos ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset],
    )
    return result.map(row => ({
      id: row.id!.toString(),
      name: row.name,
      completed: row.completed,
      createdAt: row.createdAt,
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  static async deleteTodo(id: string) {
    const db = await getDb()
    const result = await db.execute('DELETE FROM todos WHERE id = ?', [id])
    return result.rowsAffected > 0
  }

  static async updateTask(todo: Todo) {
    const db = await getDb()
    const result = await db.execute(
      'UPDATE tasks SET name = ?, createdAt = ?, completed = ? WHERE id = ?',
      [todo.name, todo.createdAt, todo.completed, todo.id],
    )
    return result.rowsAffected > 0
  }
}

export default TodoModel
