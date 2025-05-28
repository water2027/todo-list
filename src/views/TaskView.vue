<script lang="ts" setup>
// import { invoke } from '@tauri-apps/api/core';
import { reactive } from 'vue';
import { Task } from '../types/task';
import { useMessageBox } from '../component/MessageBox';

const tasks = reactive<Task[]>([
    {
        id: '1',
        deadline: new Date('2023-12-31').toLocaleDateString(),
        title: 'Task 1',
        detail: '',
        status: 'todo'
    },
    {
        id: '2',
        deadline: new Date('2023-12-31').toLocaleDateString(),
        title: 'Task 1',
        detail: '',
        status: 'todo'
    },
]);

const lookDetail = (task: Task) => {
    useMessageBox({title: task.title, date: task.deadline, message: task.detail})
}
</script>

<template>
    <div class="view-root">
        <h2>任务清单</h2>
        <div>
            <button>增加</button>
        </div>
        <div class="grid p-2 grid-cols-4">
            <div class="text-center border border-black">标题</div>
            <div class="text-center border border-black">死期</div>
            <div class="text-center border border-black">状态</div>
            <div class="text-center border border-black">操作</div>
            <template v-for="task in tasks" :key="task.id">
                <div class="text-center border border-black">{{ task.title }}</div>
                <div class="text-center border border-black">{{ new Date(task.deadline).toLocaleString() }}</div>
                <div class="text-center border border-black">{{ task.status }}</div>
                <div class="flex border border-black">
                    <span class="mx-a" hover="text-blue cursor-pointer" @click="lookDetail(task)">看</span>
                    <span class="mx-a" hover="text-blue cursor-pointer" @click="">改</span>
                    <span class="mx-a" hover="text-blue cursor-pointer" @click="">删</span>
                </div>
            </template>
        </div>
    </div>
</template>