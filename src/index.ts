import { createApp, defineComponent, h, ref } from 'vue'
import { FoundComponent, FoundComponents, getComponentHierarchy, hierarchyToTree } from './getComponentHierarchy'
import Foo from './Foo.vue'

// const tree =  [
//   {
//     type: 'file',
//     name: 'README.md'
//   },
//   {
//     type: 'folder',
//     name: 'src',
//     contents: [
//       {
//         type: 'file',
//         name: 'foo.js'
//       },
//     ]
//   },
//   {

export interface TreeNode {
  name: string
  children: TreeNode[]
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

    return () => h('div', [
      h(FileTree, { tree: tree.value }),
      h(Foo),
      h('h4', 'Heading 4'),
      h(Hello),
      h('button', {
        onClick: () => {
          // @ts-expect-error
          const tr = getComponentHierarchy(window.vm)
          const root: FoundComponent = {
            uid: window.vm.$.uid,
            name: 'App',
          }
          const treeView = hierarchyToTree(root, tr)
          tree.value = treeView
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