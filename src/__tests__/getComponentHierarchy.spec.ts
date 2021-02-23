import { createApp, defineComponent, h } from 'vue'
import { getComponentHierarchy } from '../getComponentHierarchy'


describe('getComponentHierarchy', () => {
  it('works for 1 child', () => {
    const Child = defineComponent({
      name: 'Child',
      render() {
        return h('div', 'Child')
      }
    })
    const App = defineComponent({
      components: { Child },
      render() {
        return h('div', [h(Child)])
      }
    })
    const vm = createApp(App)
    const mounted = vm.mount(document.createElement('div'))
    const result = getComponentHierarchy(mounted)

    console.log(result)
  })
})