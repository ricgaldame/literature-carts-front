<template>
  <div 
    class="row justify-center items-center" 
    :style="{ marginTop: '20px', marginBottom: '20px' }"
  >
    <div 
      class="row justify-between items-center text-bold"
      :style="{
        width: $q.screen.lt.sm ? '80%' : '95%',
        margin: '10px'
      }"
    >
      <div style="font-size: 20px;">
        Congregaciones
      </div>
      <div class="add-congregation-class">
        <q-icon name="add_circle" @click="showCreateUpdateCongregationDialog(null, true)"/>
      </div>
    </div>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="id"
      :style="{
        width: $q.screen.lt.sm ? '80%' : '95%',
        marginTop: '20px'
      }"
      :filter="filter"
      :pagination="{
        rowsPerPage: 15
      }"
      no-data-label="No existen datos"
      no-results-label="No existen resultados"
      rows-per-page-label="Filas por página"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th 
            v-for="column in props.cols" :key="column.id" 
            :style="{ 
              textAlign: column.align, 
              fontWeight: 'bold',
              color: 'var(--q-primary)',
              fontSize: '15px' 
            }"
          >
            {{ column.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-if="isLoading" v-slot:body>
        <q-tr v-for="n in 10" :key="n">
          <q-td v-for="column in columns" :key="column.id">
            <q-skeleton type="text" />
          </q-td>
        </q-tr>
      </template>
      <template v-else v-slot:body="props">
        <q-tr :props="props">
          <q-td 
            v-for="column in props.cols" :key="column.id" 
            :style="{ textAlign: column.align, color: column.id == 'state' ? props.row.color : ''  }"
          >
            <div v-if="column.id == 'settings'">
              <q-icon size="20px" name="more_vert" style="cursor: pointer;">
                <q-popup-proxy :offset="[-30, -60]" v-model="menuMore[props.rowIndex]">
                  <q-banner class="more-menu">
                    <div class="column justify-center" style="font-size: 16px">
                      <div class="menu-profile" @click="showCreateUpdateCongregationDialog(props.row, false)">
                        <q-icon name="visibility" size="18px" style="margin-right: 10px;"/>Congregación
                      </div>
                      <div class="menu-profile"  @click="showCreateUpdateCongregationDialog(props.row, true)">
                        <q-icon name="edit" size="18px" style="margin-right: 10px;"/>Editar
                      </div>
                      <!-- <div 
                        class="menu-profile" 
                      >
                        <q-icon name="delete" size="18px" style="margin-right: 10px;"/>Eliminar
                      </div> -->
                    </div>
                  </q-banner>
                </q-popup-proxy>
              </q-icon>
            </div>
            <div v-else>
              {{ props.row[column.id] }}
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <q-dialog v-model="createUpdateCongregationDialog" persistent>
    <CreateUpdateCongregation 
      :congregationDataEntry="congregationData"
      :congregations="congregations"
      :createOrUpdate="createOrUpdate"
      @close-create-update-congregation-dialog="closeCreateUpdateCongregationDialog"
      @get-congregations="getCongregations"
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getCongregations } from 'src/api/queries/getCongregations';
import { useQuery } from '@vue/apollo-composable';
import CreateUpdateCongregation from 'src/components/congregations/CreateUpdateCongregation.vue';

export default defineComponent({
  name: 'CongregationsPage',
  emits: ['update-nav-bar'],
  components: {
    CreateUpdateCongregation
  },
  data(){
    return {
      isMounted: false,
      isLoading: false,
      congregation_code: process.env.CONGREGATION_CODE || '',
      createUpdateCongregationDialog: false,
      createOrUpdate: false
    }
  },
  async mounted(){
    this.$emit('update-nav-bar', {});
    await this.init();
    this.isMounted = true;
  },
  setup () {
    const filter: any = ref('')
    const columns: any = [
      { id: 'id', field: 'id', label: 'ID', align: 'left', },
      { id: 'name', field: 'name', label: 'Nombre', align: 'left', },
      { id: 'code', field: 'code', label: 'Número', align: 'left', },
      { id: 'settings', field: 'settings', label: '', align: 'right', },
    ];
    const rows: any = ref([10]);
    const menuMore: any = ref([]);
    const congregationData: any = ref(null);
    const congregations: any = ref(null);

    const { 
      refetch: getCongregationsFunc, 
      loading: getCongregationsLoading, 
      result: getCongregationsData, 
      error: getCongregationsError 
    } = useQuery(getCongregations);

    return { 
      columns,
      rows,
      menuMore,
      filter,
      congregationData,
      congregations,
      getCongregationsFunc,
      getCongregationsLoading,
      getCongregationsData,
      getCongregationsError
    };
  },
  methods:{
    async init(){
      try {
        await this.getCongregationsFunc();

        this.congregations = this.getCongregationsData.getCongregations;

        this.rows = this.congregations.map((congregation: any) => {
          // console.log(profile)
          return {
            ...congregation,
            settings: ''
          }
        })
        .sort((a: any, b: any) => a.id - b.id);
        // console.log(this.profiles);
      }
      catch (error) {
        console.error('Error al obtener los datos:', error);
      }      
    },
    closeCreateUpdateCongregationDialog(){
      this.createUpdateCongregationDialog = false;
    },
    showCreateUpdateCongregationDialog(volunteer: any, createOrUpdate: boolean){
      this.createOrUpdate = createOrUpdate;
      this.congregationData = volunteer;
      this.createUpdateCongregationDialog = true;
      this.menuMore = [];
    },
    async getCongregations(){
      await this.init();
    },
  },
  watch:{
    getCongregationsLoading(newVal, oldVal){
      this.isLoading = this.getCongregationsLoading;
    }
  }
});
</script>

<style scoped lang="scss">
  .menu-profile {
    padding: 0px; 
    margin-top: 5px; 
    margin-bottom: 5px; 
    cursor: pointer;
    color: $primary
  }

  .menu-profile:hover {
    color: $secondary;
  }

  .add-congregation-class {
    font-size: 40px; 
    color: var(--q-primary);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }

  .add-congregation-class:hover {
    color: var(--q-secondary);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  }
</style>