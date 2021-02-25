import { createApp, defineComponent, h, ref, onUnmounted, ComponentPublicInstance } from 'vue'
import { FoundComponent, TreeNode, getComponentHierarchy, hierarchyToTree } from './getComponentHierarchy'
import Foo from './Foo.vue'

declare global {
  interface Window {
    vm: ComponentPublicInstance
  }
}

// @ts-expect-error
const FileTree = defineComponent({
  name: 'FileTree',
  data() {
    return {
      foo: 'Some data'
    }
  },
  props: {
    tree: {
      type: Array as () => TreeNode[],
      default: []
    }
  },

  setup(props) {
    return () => [
      props.tree.map(node => 
        h('ul', [
          h('li', [
            node.name,
            Object.keys(node.data || {}).length ? ' data: ' + JSON.stringify(node.data) : '',
            Object.keys(node.computed || {}).length ? ' computed:' + JSON.stringify(node.computed) : '',
            node.children.length ? h(FileTree, { tree: node.children }) : []
          ])
        ])
      )
    ]
  }
})

const Hello = defineComponent({
  name: 'Hello',
  setup() {
    return () => h('h1', 'hello!')
  }
})

const App = defineComponent({
  name: 'App',
  setup() {
    const tree = ref<TreeNode[]>([])
    const tickCount = ref(0)

    const updateTree = () => {
      const tr = getComponentHierarchy(window.vm)
      const root: FoundComponent = {
        uid: window.vm.$.uid,
        name: 'App',
      }
      const treeView = hierarchyToTree(root, tr)
      tree.value = treeView
    }

    const interval = setTimeout(() => {
      updateTree()
    }, 1000)

    onUnmounted(() => {
      clearInterval(interval)
    })

    return () => h('div', [
      h(FileTree, { tree: tree.value }),
      h(Foo),
      h('h4', 'Heading 4'),
      h(Hello),
      h('div', `Tick count ${tickCount.value}`),
      h('button', {
        onClick: () => {
          updateTree()
        }
      }, 'Get Tree')
    ])
  }
})

const app = createApp(App)
const vm = app.mount('#app')

Object.defineProperty(window, 'app', {
  get: () => app
})

Object.defineProperty(window, 'vm', {
  get: () => vm
})