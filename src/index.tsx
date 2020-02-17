import { createApp, ref, defineComponent } from 'vue'

interface Props {
  buttonText: string
}
interface Events {
  click: void
}

const SuperButton = defineComponent<Props, Events>((props, context) => {
  return () => (
    <div>
      Bar asa
      <button on={{
        click: (event) => {
          context.emit('click')
        }
      }}>
        { props.buttonText }
      </button>
    </div>
  )
})

export const App = defineComponent(()=> {
  const count = ref(0)
  const inc = () => {
    count.value++
  }

  return () => (
    <div>
      Foo {count.value}
      <SuperButton
        buttonText="Baz"
        on={{
          click: inc
        }}
      />
    </div>
  )
})

createApp(App).mount('#app')
