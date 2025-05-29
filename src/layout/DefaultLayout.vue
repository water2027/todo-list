<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routes = [
  {
    to: '/',
    name: '首页',
  },
  {
    to: '/clock',
    name: '时钟',
  },
  {
    to: '/todo-list',
    name: '待办',
  },
  {
    to: '/task',
    name: '任务',
  },
  {
    to: '/option',
    name: '设置',
  },
]

const selectedRoute = computed(() => {
  return route.path
})

const isShow = ref(true)
function toggleSidebar() {
  isShow.value = !isShow.value
}
</script>

<template>
  <div class="h-full w-full flex flex-row">
    <div class="relative flex flex-col bg-gray-600 text-white transition-all duration-200" :class="{ 'w-1/5': isShow, 'w-0': !isShow }">
      <button class="absolute left-100% top-50 w-10 translate-y-100% rounded-full bg-blue-500 p-2 transition-all duration-200 -translate-x-5" hover="bg-black" :class="{'hover:transform-translate-x-1': !isShow}" @click="toggleSidebar">
        {{ isShow ? '<-' : '->' }}
      </button>
      <div class="block w-full border-b border-b p-1.5 py-2 text-center" :class="{ hidden: !isShow }">
        <h2>Water</h2>
      </div>
      <!-- 一个列表 -->
      <RouterLink v-for="r in routes" :key="r.to" :to="r.to" class="block w-full rounded-xl p-1.5 py-2 text-center shadow-md transition-all duration-300" hover="bg-gray-700" :class="{ 'bg-gray-800': selectedRoute === r.to, 'hidden': !isShow }">
        <span class="">{{ r.name }}</span>
      </RouterLink>
    </div>
    <div class="w-full">
      <RouterView />
    </div>
  </div>
</template>
