<script lang="ts" setup>
import { onMounted } from 'vue'
import { init } from './db'

onMounted(async () => {
  await init()
})
</script>

<template>
  <RouterView />
</template>
