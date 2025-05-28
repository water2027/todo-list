<script lang="ts" setup>
// import { invoke } from '@tauri-apps/api/core'
import { computed, ref } from 'vue'
import WaterClock from '../component/WaterClock.vue'

const hour = ref(0)
const minute = ref(0)

const timeRemaining = ref(0)

async function setTime() {
  // 这里可以调用 Tauri 的命令来设置时间
  // await invoke('set_time', { hour: hour.value, minute: minute.value })
  // 这里暂时模拟一下
  timeRemaining.value = hour.value * 3600 + minute.value * 60

  const i = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    }
    else {
      clearInterval(i)
    }
  }, 1000)
}

const text = computed(() => {
  // 计算剩余时间的文本表示
  const hours = Math.floor(timeRemaining.value / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((timeRemaining.value % 3600) / 60).toString().padStart(2, '0')
  const seconds = (timeRemaining.value % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})
</script>

<template>
  <div class="view-root flex flex-col bg-coolgray">
    <header class="p-1">
      <h2>时钟</h2>
    </header>
    <form class="mx-a" @submit.prevent="setTime">
      <!-- 这里放一个input和按钮吧 -->
      <input v-model="hour" type="number" min="0" max="23" placeholder="Hour">
      <span>小时</span>
      <input v-model="minute" type="number" min="0" max="59" placeholder="Minute">
      <span>分钟</span>
      <button type="submit" class="rounded bg-blue-500 p-2 text-white">
        doit!
      </button>
    </form>
    <WaterClock :text="text" />
  </div>
</template>
