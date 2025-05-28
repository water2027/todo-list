<script lang="ts" setup>
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'
import 'github-markdown-css/github-markdown-light.css'

const { content } = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})

const markdown = computed(() => {
  return md.render(content)
})
</script>

<template>
  <div class="markdown-body" v-html="markdown" />
</template>