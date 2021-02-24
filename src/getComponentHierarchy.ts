import { ComponentPublicInstance, ConcreteComponent, VNode } from 'vue'
import { TreeNode } from '.'

// Useful examples
// Mine: https://github.com/lmiller1990/vdom-traverse-article/blob/master/index.js
// Vue DevTools: https://github.com/vuejs/vue-devtools/blob/f3c48017c82bc1c2357f969647dd13de98017239/packages/app-backend-vue3/src/components/tree.ts#L46
// Not sure why Vue DevTools one is so complex :thinking:

export interface FoundComponent {
  uid: number
  name: string
  parent?: number // uid, undefined for root
  data?: Record<string, any>
  computed?: Record<string, any>
}

export type FoundComponents = Record<string, FoundComponent>

export const getComponentHierarchy = (app: ComponentPublicInstance) => {
  return traverse(app.$.subTree, {}, app.$.uid)
}

export const hierarchyToTree = (root: FoundComponent, componentMap: FoundComponents): TreeNode[] => {
  const getChildren = (id: number): TreeNode[] => {
    const nodes = Object.values(componentMap).filter(entry => {
      return entry.parent === id
    })
    return nodes.map(node => ({
      ...node,
      children: getChildren(node.uid),
    }))
  }

  const rootNode: TreeNode = {
    name: root.name,
    children: getChildren(root.uid)
  }
  return [rootNode]
}

const traverse = (vnode: VNode, found: FoundComponents, rootUid: number): FoundComponents => {
  if (Array.isArray(vnode.children)) {
    return vnode.children.reduce<FoundComponents>((acc, curr) => {
      if (typeof curr === 'object') {
        let node = curr as VNode

        if (!node.component || !node.component.uid) {
          return acc
        }

        const computedData = node.component.type.computed
        const computed: Record<string, any> = {}
        if (computedData) {
          for (const k of Object.keys(computedData)) {
            computed[k] = computedData[k].call(node.component.proxy)
          }
        }

        acc = {
          ...acc,
          [node.component.uid]: {
            uid: node.component.uid,
            name: node.component.type.name,
            parent: node.component.parent!.uid,
            data: node.component.data,
            computed,
          }
        }
        return traverse(node.component.subTree, acc, rootUid)
      }
      
      return acc
    }, {...found})
  }

  return found
}