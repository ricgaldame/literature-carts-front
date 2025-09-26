<template>
  <div
    class="row justify-center items-center"
    :style="{
      border: '1px solid grey',
      borderRadius: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '0px',
      paddingBottom: '0px',
      margin: '0px',
      width: '100%',
      color: 'white',
      backgroundColor: 'var(--q-primary)',
      height: `${titlesHeight}px`,
    }
    "
  >
    {{ title }}
  </div >
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AssignmentsTitlesComponent',
  emits: ['update-nav-bar'],
  props: {
		title: {
			type: String,
			required: true
		},
		titlesHeight: {
			type: Number,
			required: true
		},
	},
});
</script>
