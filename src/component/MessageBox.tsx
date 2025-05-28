import { createApp, defineComponent, PropType } from 'vue'
import MarkdownContainer from './MarkdownContainer.vue'

export interface MessageBoxProps {
    title: string
    message: string
    date?: string
}

const MessageBox = defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: false,
      default: '',
    },
    onclick: {
        type: Function as PropType<() => void>,
        required: true,
    }
  },
  setup(props) {
    const { title, message, date, onclick } = props
    return () => (
      <div class="h-full w-3/5 flex flex-col bg-white p-2 pb-4 overflow-auto">
        <h3 class="text-center">{title}</h3>
        <h4 class="text-center">{date && new Date(date).toLocaleDateString()}</h4>
        <MarkdownContainer content={message} />
        <button onClick={onclick} class="bg-blueGray w-fit p-2 rounded-full mx-a aspect-square hover:bg-coolgray-6 transition-all duration-200">X</button>
      </div>
    )
  },
})

export const useMessageBox = (props: MessageBoxProps) => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    div.className = 'fixed top-0 left-0 h-full w-full z-50 flex items-center justify-center bg-dark bg-op-40'

    const app  = createApp(MessageBox, {
        ...props,
        onclick: () => {
            app.unmount()
            document.body.removeChild(div)
        }
    })

    app.mount(div)
}
