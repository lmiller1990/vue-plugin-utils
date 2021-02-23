import { App, ComponentInternalInstance, ComponentPublicInstance, VNode } from 'vue'

// https://github.com/lmiller1990/vdom-traverse-article/blob/master/index.js
// https://github.com/vuejs/vue-devtools/blob/f3c48017c82bc1c2357f969647dd13de98017239/packages/app-backend-vue3/src/components/tree.ts#L46

export const getComponentHierarchy = (app: ComponentPublicInstance) => {
  return traverse(app.$.subTree)
}

interface FoundComponent {
}

const traverse = (vnode: VNode, found: FoundComponent[]) => {
  if (vnode
}