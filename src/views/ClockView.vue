<script lang="ts" setup>
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import type { UnlistenFn } from '@tauri-apps/api/event'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import WaterClock from '../component/WaterClock.vue'
import { showMsg } from '../composables/showMsg'

const hour = ref(0)
const minute = ref(0)

const timeRemaining = ref(0)

async function setTime() {
  // 这里可以调用 Tauri 的命令来设置时间
  // 这里暂时模拟一下
  const seconds = hour.value * 3600 + minute.value * 60
  if (seconds <= 0) {
    showMsg('时间不能为0')
    return
  }
  timeRemaining.value = seconds
  await invoke('set_countdown', { seconds })
}

async function stop() {
  await invoke('stop_countdown')
}

async function continue_countdown() {
  await invoke('continue_countdown')
}

const text = computed(() => {
  // 计算剩余时间的文本表示
  const hours = Math.floor(timeRemaining.value / 3600).toString().padStart(2, '0')
  const minutes = Math.floor((timeRemaining.value % 3600) / 60).toString().padStart(2, '0')
  const seconds = (timeRemaining.value % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
})

let unlisten : UnlistenFn

interface CountdownEvent {
  time_remaining: number
}

onMounted(async () => {
  unlisten = await listen<CountdownEvent>('countdown_event', (event) => {
    timeRemaining.value = event.payload.time_remaining
  })
})

onUnmounted(() => {
  if (unlisten) {
    unlisten()
  }
})
</script>

<template>
  <div class="view-root flex flex-col bg-coolgray">
    <header class="p-1">
      <h2>时钟</h2>
    </header>
    <form class="mx-a" @submit.prevent="setTime">
      <input v-model="hour" type="number" min="0" max="23" placeholder="Hour">
      <span>小时</span>
      <input v-model="minute" type="number" min="0" max="59" placeholder="Minute">
      <span>分钟</span>
      <button type="submit" class="rounded border-2 border-black p-2 text-white">
        来吧!
      </button>
      <button type="button" class="rounded border-2 border-black p-2 text-white" @click="stop">
        停止!
      </button>
      <button type="button" class="rounded border-2 border-black p-2 text-white" @click="continue_countdown">
        继续!
      </button>
    </form>
    <WaterClock :text="text" />
  </div>
</template>
