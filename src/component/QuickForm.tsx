import type { PropType } from 'vue'
import { defineComponent } from 'vue'
import { useQuickComponent } from '../composables/useQuickComponent'

export interface FormProps {
  id: string
  label?: string // 默认与 id 相同
  type: string
}

export interface QuickFormProps {
  // 描述这个表单
  // 应该是一个数组
  formData: FormProps[]
}

const QuickForm = defineComponent({
  props: {
    formData: {
      type: Array as () => FormProps[],
      required: true,
    },
    close: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function as PropType<(data?: Event) => void>,
      required: true,
    },
  },
  setup({ formData, onSubmit, close }) {
    const onsubmit = () => {
      onSubmit()
      close()
    }
    return () => (
      <form onSubmit={onsubmit}>
        {formData.map(item => (
          <div key={item.id}>
            <label for={item.id}>{item.label || item.id}</label>
            <input id={item.id} type={item.type} />
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    )
  },
})

export function useQuickForm(props: QuickFormProps) {
  let resolve: (arg0: unknown) => void
//   , reject: (arg0: unknown) => void
  const p = new Promise((res, _rej) => {
    resolve = res
    // reject = rej
  })

  const onsubmit = (event: Event) => {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      data[key] = value
    })
    resolve(data)
  }

  useQuickComponent(QuickForm, {
    ...props,
    onsubmit,
  })
  return p
}
