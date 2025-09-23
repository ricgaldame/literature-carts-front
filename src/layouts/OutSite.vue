
<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer style="background-color: #eeeeee;">
      <q-toolbar style="padding: 0px;">
        <q-toolbar-title>
          <q-separator style="padding: 0px; margin: 0px"/>
          <div class="footer">
            Todos los derechos reservados. Carrito Congregación {{ congregation }} © {{ year }}
          </div>
        </q-toolbar-title>
      </q-toolbar> 
    </q-footer>

  </q-layout>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCongregationStore } from 'src/stores/congregationStore';
import { storeToRefs } from 'pinia' 

export default defineComponent({
  name: 'OutSiteLayout',
  data(){
    return {
      congregation: ''
    }
  },
  setup () {
    const year =  new Date().toISOString().split('-')[0];

    const congregationStore = useCongregationStore();
	  const { getCongregation } = storeToRefs(congregationStore);

    return {
      year,
      getCongregation
    }
  },
  async mounted() {
    if(this.getCongregation) this.congregation = this.getCongregation;
  }
});
</script>

<style scoped lang="scss">

  .footer {
    color: $navbar-text;
    font-size: 12px;
    margin-top: 5px;
    padding: 10px
  }

</style>