<template>
  <span>
    <div>Foo</div>
    <Bar />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Bar from './Bar.vue'

export default defineComponent({
  name: 'Foo',
  components: {
    Bar
  }
})
</script>
