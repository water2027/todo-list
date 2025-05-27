<script lang="ts" setup>

</script>

<template>
  <div class="h-full w-full flex flex-row bg-black">
    <div class="w-1/5 flex flex-col bg-gray-800 text-white">
      <div class="block w-full border-b border-b-amber-500 p-1.5 py-2 text-center">
        <h2>Water</h2>
      </div>
      <!-- 一个列表 -->
      <RouterLink to="/" class="block w-full rounded-xl p-1.5 py-2 text-center transition-all duration-300" hover="bg-gray-700">
        <span class="">首页</span>
      </RouterLink>
    </div>
    <div class="w-4/5">
      <!-- <RouterView /> -->
    </div>
  </div>
</template>
