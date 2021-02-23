import { App, ComponentInternalInstance, ComponentPublicInstance, VNode } from 'vue'

// https://github.com/lmiller1990/vdom-traverse-article/blob/master/index.js
// https://github.com/vuejs/vue-devtools/blob/f3c48017c82bc1c2357f969647dd13de98017239/packages/app-backend-vue3/src/components/tree.ts#L46

interface FoundComponent {
  uid: number
  parent: number // uid
  name: string
}

export type FoundComponents = Record<string, FoundComponent>

export const getComponentHierarchy = (app: ComponentPublicInstance) => {
  return traverse(app.$.subTree, {})
}

const traverse = (vnode: VNode, found: FoundComponents): FoundComponents => {
  if (Array.isArray(vnode.children)) {
    return vnode.children.reduce<FoundComponents>((acc, curr) => {
      if (typeof curr === 'object') {
        let node = curr as VNode

        if (!node.component || !node.component.uid) {
          throw Error('WTF')
        }

        acc = {
          ...acc,
          [node.component.uid]: {
            uid: node.component.uid,
            name: node.component.type.name,
            parent: node.component.parent!.uid
          }
        }
        return traverse(node.component.subTree, acc)
      }
      
      return acc
    }, {...found})
  }

  return found
}