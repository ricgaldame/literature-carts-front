<template>
  <Assignments :view="'week-template'"/>
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import Assignments from 'src/components/assignments/Assignments.vue';

export default defineComponent({
  name: 'WeekTemplatePage',
  emits: ['update-nav-bar'],
  components: {
		Assignments
  },
  async mounted(){
    // console.log( this.getToken, this.getAttributes, this.getRefreshToken);
    this.$emit('update-nav-bar', {});
  },
});
</script>