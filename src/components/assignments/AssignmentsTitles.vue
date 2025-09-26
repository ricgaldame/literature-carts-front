<template>
  <div
    :class="`row justify-${(isAdmin || isSupervisor) && !isHours && isWeekTemplate ? 'between' : 'center'} items-center`"
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
    <div>
      {{ title }}
    </div>
    <div v-if="(isAdmin || isSupervisor) && !isHours && isWeekTemplate">
      <div class="add-location-class">
        <q-icon name="add_circle"/>
      </div>
    </div>
  </div >
</template>

<script lang="ts">

import { defineComponent, ref } from 'vue';
import { useIdentityStore } from 'src/stores/identityStore';
import { storeToRefs } from 'pinia' 

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
    view: {
			type: String,
			required: true
		},
	},
  data(){
    return {
      isAdmin: false,
      isSupervisor: false,
      isHours: this.title == 'Horas',
      isWeekTemplate: this.view == 'week-template'
    }
  },
  mounted(){
    if(this.getAttributes){
      const attributes: any = this.getAttributes;
      this.role = attributes.role;
      this.isAdmin = this.role == 'admin';
      this.isSupervisor = this.role == 'supervisor';
    }
  },
  setup(){
    const store = useIdentityStore();
    const { getAttributes } = storeToRefs(store);

    const role: any = ref(null);

    return {
      getAttributes,
      role
    }
  },
});
</script>

<style scoped lang="scss">
  .add-location-class {
    margin-top: -3px;
    padding: 0px;
    font-size: 20px; 
    color: white;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }

  .add-location-class:hover {
    color: #e49b87;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  }
</style>
