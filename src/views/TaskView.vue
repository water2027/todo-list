<script lang="ts" setup>
import type { Task } from '../types/task'
import { onMounted, reactive } from 'vue'
import { useMessageBox } from '../component/MessageBox'
import { useQuickForm } from '../component/QuickForm'
import { showMsg } from '../composables/showMsg'
import TaskModel from '../db/task'

const tasks = reactive<Task[]>([
])

function lookDetail(task: Task) {
  useMessageBox({ title: task.title, date: task.deadline, message: task.detail })
}
async function addTask() {
  const form = await useQuickForm([
    {
      id: 'title',
      label: '标题',
      type: 'text',
    },
    {
      id: 'deadline',
      label: '死期',
      type: 'date',
    },
    {
      id: 'time',
      label: '时间',
      type: 'time',
    },
    {
      id: 'detail',
      label: '详情',
      type: 'text',
    },
  ] as const,
  )

  const { title, deadline, time, detail } = form
  const date = new Date(`${deadline} ${time}`)
  const resp = await TaskModel.addTask({ title, deadline: date.toLocaleString(), detail, status: 'todo' })
  if (!resp || resp <= 0) {
    return showMsg('添加任务失败')
  }
  showMsg('添加任务成功')
}

async function updateTask(task: Task) {
  const times = task.deadline.split(' ')[0].split('/')
  for (let i = 0; i < times.length; i++) {
    times[i] = times[i].padStart(2, '0')
  }
  const rawDate = `${times[0]}-${times[1]}-${times[2]}`
  try {
    const form = await useQuickForm([
      {
        id: 'title',
        label: '标题',
        type: 'text',
        value: task.title,
      },
      {
        id: 'deadline',
        label: '死期',
        type: 'date',
        value: rawDate,
      },
      {
        id: 'time',
        label: '时间',
        type: 'time',
        value: task.deadline.split(' ')[1],
      },
      {
        id: 'detail',
        label: '详情',
        type: 'text',
        value: task.detail,
      },
    ] as const)

    const { title, deadline, time, detail } = form
    const date = new Date(`${deadline} ${time}`)
    const resp = await TaskModel.updateTask({ ...task, title, deadline: date.toLocaleString(), detail })
    if (!resp) {
      return showMsg('更新任务失败')
    }
    showMsg('更新任务成功')
  }
  catch (error) {
    console.warn('更新任务失败', error)
  }
}

async function deleteTask(task: Task) {
  const resp = await TaskModel.deleteTask(task.id!)
  if (!resp) {
    return showMsg('删除任务失败')
  }
  const index = tasks.findIndex(t => t.id === task.id)
  if (index !== -1) {
    tasks.splice(index, 1)
    showMsg('删除任务成功')
  } else {
    showMsg('任务不存在')
  }
}

onMounted(async () => {
  const data = await TaskModel.getTasks()
  if (data && data.length > 0) {
    tasks.push(...data)
  }
})
</script>

<template>
  <div class="view-root">
    <h2>任务清单</h2>
    <div>
      <button @click="addTask">
        增加
      </button>
    </div>
    <div class="grid grid-cols-4 p-2">
      <div class="border border-black text-center">
        标题
      </div>
      <div class="border border-black text-center">
        死期
      </div>
      <div class="border border-black text-center">
        状态
      </div>
      <div class="border border-black text-center">
        操作
      </div>
      <template v-for="task in tasks" :key="task.id">
        <div class="border border-black text-center">
          {{ task.title }}
        </div>
        <div class="border border-black text-center">
          {{ new Date(task.deadline).toLocaleString() }}
        </div>
        <div class="border border-black text-center">
          {{ task.status }}
        </div>
        <div class="flex border border-black">
          <span class="mx-a" hover="text-blue cursor-pointer" @click="lookDetail(task)">看</span>
          <span class="mx-a" hover="text-blue cursor-pointer" @click.prevent="updateTask(task)">改</span>
          <span class="mx-a" hover="text-blue cursor-pointer" @click.prevent="deleteTask(task)">删</span>
        </div>
      </template>
    </div>
  </div>
</template>
