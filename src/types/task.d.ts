export interface Task {
  id: string
  deadline: string
  title: string
  detail: string
  status: 'done' | 'todo'
}
