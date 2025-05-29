import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { useQuickComponent } from '@/composables/useQuickComponent'
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
    close: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  setup(props) {
    const { title, message, date, close } = props
    return () => (
      <div class="h-full w-3/5 flex flex-col overflow-auto bg-white p-2 pb-4">
        <h3 class="text-center">{title}</h3>
        <h4 class="text-center">{date && new Date(date).toLocaleDateString()}</h4>
        <MarkdownContainer content={message} />
        <button onClick={close} class="mx-a aspect-square w-fit rounded-full bg-blueGray p-2 transition-all duration-200 hover:bg-coolgray-6">X</button>
      </div>
    )
  },
})

export function useMessageBox(props: MessageBoxProps) {
  useQuickComponent(MessageBox, props)
}
