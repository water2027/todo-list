import type { Component } from 'vue'
import { createApp } from 'vue'

export function useQuickComponent(component: Component, props: any) {
  const div = document.createElement('div')
  div.className = 'fixed top-0 left-0 h-full w-full z-50 flex items-center justify-center bg-dark bg-op-40'
  document.body.appendChild(div)

  const app = createApp(component, {
    ...props,
    close: () => {
      app.unmount()
      document.body.removeChild(div)
    },
  })

  app.mount(div)

  const close = () => {
    app.unmount()
    document.body.removeChild(div)
  }

  return close
}
