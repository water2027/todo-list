import type { Task } from '../types/task'

import { getDb } from './db'

class TaskModel {
  static async createTable() {
    const db = await getDb()
    await db.execute(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                deadline TEXT NOT NULL,
                title TEXT NOT NULL,
                detail TEXT NOT NULL,
                status TEXT NOT NULL CHECK (status IN ('done', 'todo'))
            )
        `)
  }

  static async addTask(task: Task) {
    const db = await getDb()
    const result = await db.execute(
      'INSERT INTO tasks (deadline, title, detail, status) VALUES (?, ?, ?, ?)',
      [task.deadline, task.title, task.detail, task.status],
    )
    return result.lastInsertId
  }

  static async getTasks(limit: number = 10, offset: number = 0): Promise<Task[]> {
    const db = await getDb()
    const result = await db.select<Task[]>(
      'SELECT id, deadline, title, detail, status FROM tasks ORDER BY id DESC LIMIT ? OFFSET ?',
      [limit, offset],
    )
    return result.map(row => ({
      id: row.id!.toString(),
      deadline: row.deadline,
      title: row.title,
      detail: row.detail,
      status: row.status,
    })).sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime())
  }

  static async deleteTask(id: string) {
    const db = await getDb()
    const result = await db.execute('DELETE FROM tasks WHERE id = ?', [id])
    return result.rowsAffected > 0
  }

  static async updateTask(task: Task) {
    const db = await getDb()
    const result = await db.execute(
      'UPDATE tasks SET deadline = ?, title = ?, detail = ?, status = ? WHERE id = ?',
      [task.deadline, task.title, task.detail, task.status, task.id],
    )
    return result.rowsAffected > 0
  }
}

export default TaskModel
