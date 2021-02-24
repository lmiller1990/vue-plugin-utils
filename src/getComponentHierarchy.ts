import { App, ComponentInternalInstance, ComponentPublicInstance, getTransitionRawChildren, VNode } from 'vue'
import { TreeNode } from '.'

// https://github.com/lmiller1990/vdom-traverse-article/blob/master/index.js
// https://github.com/vuejs/vue-devtools/blob/f3c48017c82bc1c2357f969647dd13de98017239/packages/app-backend-vue3/src/components/tree.ts#L46

export interface FoundComponent {
  uid: number
  name: string
  parent?: number // uid, undefined for root
}

export type FoundComponents = Record<string, FoundComponent>

export const getComponentHierarchy = (app: ComponentPublicInstance) => {
  return traverse(app.$.subTree, {}, app.$.uid)
}

export const hierarchyToTree = (
  root: FoundComponent,
  componentMap: FoundComponents
): TreeNode[] => {
  const getChildren = (id: number): TreeNode[] => {
    const nodes = Object.values(componentMap).filter(entry => {
      return entry.parent === id
    })
    return nodes.map(node => ({
      name: node.name,
      children: getChildren(node.uid)
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

        acc = {
          ...acc,
          [node.component.uid]: {
            uid: node.component.uid,
            name: node.component.type.name,
            parent: node.component.parent!.uid
          }
        }
        return traverse(node.component.subTree, acc, rootUid)
      }
      
      return acc
    }, {...found})
  }

  return found
}