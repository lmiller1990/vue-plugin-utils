import { createApp, defineComponent, h } from 'vue'
import { TreeNode } from '..'
import { getComponentHierarchy, FoundComponent, hierarchyToTree } from '../getComponentHierarchy'


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

    expect(Object.keys(result).length).toBe(1)
    // expect(result).toEqual<FoundComponents>({
    //   1: {
    //     parent: 0,
    //     name: 'Child',
    //     uid: 1
    //   }
    // })
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

    expect(Object.keys(result).length).toBe(2)
    // expect(result).toEqual<FoundComponents>({
    //   1: {
    //     parent: 0,
    //     name: 'Child',
    //     uid: 1
    //   },
    //   2: {
    //     name: 'Grandchild',
    //     parent: 1,
    //     uid: 2,
    //   },
    // })
  })

  it('works using the same components multiple times', () => {
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

    expect(Object.keys(result).length).toBe(5)
    // expect(result).toEqual<FoundComponents>(
    //   {
    //     1: {
    //       name: 'Child',
    //       parent: 0,
    //       uid: 1,
    //     },
    //     2: {
    //       name: 'Grandchild',
    //       parent: 1,
    //       uid: 2,
    //     },
    //     3: {
    //       name: 'Child',
    //       parent: 0,
    //       uid: 3,
    //     },
    //     4: {
    //       name: 'Grandchild',
    //       parent: 3,
    //       uid: 4,
    //     },
    //     5: {
    //       name: 'Grandchild',
    //       parent: 0,
    //       uid: 5,
    //     },
    //   }
    // )
  })

  it('handles app with mixed components and HTML elements', () => {
    const Hello = defineComponent({
      name: 'Hello',
      setup() {
        return () => h('h1', 'hello!')
      }
    })

    const App = defineComponent({
      name: 'App',
      setup() {
        return () => h('div', [
          h('h4', 'Heading 4'),
          h(Hello),
          h('button', 'Get Tree')
        ])
      }
    })

    const vm = createApp(App)
    const mounted = vm.mount(document.createElement('div'))
    const result = getComponentHierarchy(mounted)
    expect(Object.keys(result).length).toBe(1)
    // expect(result).toEqual<FoundComponents>({
    //   '1': { 
    //     uid: 1, 
    //     name: 'Hello', 
    //     parent: 0
    //   }
    // })
  })
})

test('transforms a component map into a tree', () => {
  const tree = hierarchyToTree(
    {
      uid: 0,
      name: 'App',
    },
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
      }
    }
  )

  expect(tree).toEqual<TreeNode[]>([
    {
      name: 'App',
      children: [
        {
          name: 'Child',
          children: [
            {
              name: 'Grandchild',
              children: []
            }
          ]
        }
      ]
    }
  ])
})
