<template>
  Bar
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Bar',
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
