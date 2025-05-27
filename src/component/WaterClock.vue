<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue'
import { renderParticleText } from '../composables/useParticleText'

const { text, width=800, height=600, fontSize=60*devicePixelRatio } = defineProps<{
  text: string;
  width?: number;
  height?: number;
  fontSize?: number;
}>()
const container = useTemplateRef('container')
onMounted(() => {
  if (!container.value)
    return
  const { draw } = renderParticleText(container.value, {
    width,
    height,
    fontSize,
    textGenerator: () => () => text,
  })
  draw()
})
</script>

<template>
  <canvas ref="container" />
</template>
