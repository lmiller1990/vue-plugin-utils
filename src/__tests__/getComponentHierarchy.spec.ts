import { createApp, defineComponent, h } from 'vue'
import { getComponentHierarchy, FoundComponents } from '../getComponentHierarchy'


const createChild = (name: string) => defineComponent({
  name,
  render() {
    return h('div', `Name is ${name}`)
  }
})

describe('getComponentHierarchy', () => {
  it('works for 1 child', () => {
    const Child = createChild('Child')
    const App = defineComponent({
      render() {
        return h('div', [h(Child)])
      }
    })
    const vm = createApp(App)
    const mounted = vm.mount(document.createElement('div'))
    const result = getComponentHierarchy(mounted)

    expect(result).toEqual<FoundComponents>({
      1: {
        parent: 0,
        name: 'Child',
        uid: 1
      }
    })
  })

  it('works for 2 levels of children', () => {
    const Grandchild = defineComponent({
      name: 'Grandchild',
      render() { return h('div', 'Grandchild') }
    })
    const Child = defineComponent({
      name: 'Child',
      render() { 
        return h('div', [h(Grandchild)])
      }
    })
    const App = defineComponent({
      render() {
        return h('div', [h(Child)])
      }
    })
    const vm = createApp(App)
    const mounted = vm.mount(document.createElement('div'))
    const result = getComponentHierarchy(mounted)

    expect(result).toEqual<FoundComponents>({
      1: {
        parent: 0,
        name: 'Child',
        uid: 1
      },
      2: {
        name: 'Grandchild',
        parent: 1,
        uid: 2,
      },
    })
  })

  it.only('works using the same components multiple times', () => {
    const Grandchild = defineComponent({
      name: 'Grandchild',
      render() { return h('div', 'Grandchild') }
    })
    const Child = defineComponent({
      name: 'Child',
      render() { 
        return h('div', [h(Grandchild)])
      }
    })
    const App = defineComponent({
      render() {
        return h('div', [h(Child), h(Child), h(Grandchild)])
      }
    })
    const vm = createApp(App)
    const mounted = vm.mount(document.createElement('div'))
    const result = getComponentHierarchy(mounted)

    expect(result).toEqual<FoundComponents>(
      {
        1: {
          name: 'Child',
          parent: 0,
          uid: 1,
        },
        2: {
          name: 'Grandchild',
          parent: 1,
          uid: 2,
        },
        3: {
          name: 'Child',
          parent: 0,
          uid: 3,
        },
        4: {
          name: 'Grandchild',
          parent: 3,
          uid: 4,
        },
        5: {
          name: 'Grandchild',
          parent: 0,
          uid: 5,
        },
      }
    )
  })
})