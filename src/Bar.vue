<template>
  <p>Bar</p>
  <p>{{ bar }}</p>
  <p>Composition computed: {{ inlineComputed }}</p>
  <input v-model="qux" />
  <button @click="msg = 'bar'">Update</button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Bar',
  setup() {
    const qux = ref('qux')
    return {
      qux,
      inlineComputed: computed(() => {
        return 'baz and ' + qux.value
      })
    }
  },
  data() {
    return {
      msg: 'foo'
    }
  },
  computed: {
    bar() {
      return this.msg.toUpperCase()
    }
  }
})
</script>
