<template>
  <div>HOLA MUNDO</div>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AssignmentsPage',
  emits: ['update-nav-bar'],
  async mounted(){
    // console.log( this.getToken, this.getAttributes, this.getRefreshToken);
    this.$emit('update-nav-bar', {});
  },
});
</script>
