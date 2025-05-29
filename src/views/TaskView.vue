<script lang="ts" setup>
import type { Task } from '../types/task'
// import { invoke } from '@tauri-apps/api/core';
import { reactive } from 'vue'
import { useMessageBox } from '../component/MessageBox'
import { useQuickForm } from '../component/QuickForm'

const tasks = reactive<Task[]>([
  {
    id: '1',
    deadline: new Date('2023-12-31').toLocaleDateString(),
    title: 'Task 1',
    detail: '',
    status: 'todo',
  },
  {
    id: '2',
    deadline: new Date('2023-12-31').toLocaleDateString(),
    title: 'Task 1',
    detail: '',
    status: 'todo',
  },
])

function lookDetail(task: Task) {
  useMessageBox({ title: task.title, date: task.deadline, message: task.detail })
}
function addTask() {
  useQuickForm([
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
    .then((data) => {
      const { title, deadline, time, detail } = data
      const date = new Date(`${deadline} ${time}`)
      tasks.push({
        id: title,
        title,
        deadline: date.toLocaleString(),
        detail,
        status: 'todo',
      })
    })
    .catch(console.error)
}
</script>

<template>
  <div class="view-root">
    <h2>任务清单</h2>
    <div class="fixed left-0 top-0 hidden" />
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
          <span class="mx-a" hover="text-blue cursor-pointer" @click.prevent="">改</span>
          <span class="mx-a" hover="text-blue cursor-pointer" @click.prevent="">删</span>
        </div>
      </template>
    </div>
  </div>
</template>
