import { createApp } from "vue"
import type { Component } from "vue"

export const useQuickComponent = (component:Component, props: any) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    div.className = 'fixed top-0 left-0 h-full w-full z-50 flex items-center justify-center bg-dark bg-op-40'

    const app  = createApp(component, {
        ...props,
        close: () => {
            app.unmount()
            document.body.removeChild(div)
        }
    })

    app.mount(div)

    const close = () => {
        app.unmount()
        document.body.removeChild(div)
    }

    return close
}
