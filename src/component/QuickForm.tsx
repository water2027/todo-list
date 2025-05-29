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
      type: Function as PropType<(data?: Event) => void>,
      required: true,
    },
    onSubmit: {
      type: Function as PropType<(data?: Event, quit?: boolean) => void>,
      required: true,
    },
  },
  setup({ formData, onSubmit, close }) {
    const onsubmit = (event: Event) => {
      onSubmit(event)
      close()
    }
    const quit = () => {
      onSubmit(undefined, true)
      close()
    }
    return () => (
      <form class="flex flex-col rounded-xl bg-white p-4" onSubmit={onsubmit}>
        {formData.map(item => (
          <div key={item.id}>
            <label for={item.id}>{item.label || item.id}</label>
            <input id={item.id} name={item.id} type={item.type} />
          </div>
        ))}
        <button type="submit">Submit</button>
        <button onClick={quit} type="button" class="mx-a aspect-square w-fit rounded-full bg-blueGray p-2 transition-all duration-200 hover:bg-coolgray-6">X</button>
      </form>
    )
  },
})

type Result<T extends readonly FormProps[]> = {
  [K in T[number]['id']]: string
}

export function useQuickForm<T extends readonly FormProps[]>(props: T): Promise<Result<T>> {
  let resolve: (arg0: Result<T>) => void,
    reject: (arg0: unknown) => void
  const p = new Promise<Result<T>>((res, rej) => {
    resolve = res
    reject = rej
  })

  const onSubmit = (event: Event, quit?: boolean) => {
    if (quit) {
      reject(new Error('Form submission cancelled'))
      return
    }
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      data[key] = value
    })
    resolve(data as Result<T>)
  }

  useQuickComponent(QuickForm, {
    ...props,
    onSubmit,
  })
  return p
}
