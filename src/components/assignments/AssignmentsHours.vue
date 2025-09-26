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
      color: 'var(--q-primary)',
      height: `${hoursHeight}px`,
    }
    "
  >
  {{ `${String(hour).padStart(2, '0')}:00` }}
  </div >
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'AssignmentsComponentComponent',
  emits: ['update-nav-bar'],
  props: {
		hour: {
			type: Number,
			required: true
		},
		hoursHeight: {
			type: Number,
			required: true
		},
	},
});
</script>
