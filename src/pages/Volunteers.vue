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
        Voluntarios
      </div>
      <div class="add-volunteer-class">
        <q-icon name="add_circle" @click="showCreateUpdateVolunteerDialog(null, true)"/>
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
                      <div class="menu-profile" @click="showCreateUpdateVolunteerDialog(props.row, false)">
                        <q-icon name="visibility" size="18px" style="margin-right: 10px;"/>Voluntario
                      </div>
                      <div class="menu-profile"  @click="showCreateUpdateVolunteerDialog(props.row, true)">
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
  <q-dialog v-model="createUpdateVolunteerDialog" persistent>
    <CreateUpdateVolunteer 
      :volunteerDataEntry="volunteerData"
      :congregations="congregations"
      :roles="roles"
      :createOrUpdate="createOrUpdate"
      @close-create-update-volunteer-dialog="closeCreateUpdateVolunteerDialog"
      @get-volunteers="getVolunteers"
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getUsers } from 'src/api/queries/getUsers';
import { getRoles } from 'src/api/queries/getRoles';
import { getCongregations } from 'src/api/queries/getCongregations';
import { useQuery } from '@vue/apollo-composable';
import CreateUpdateVolunteer from 'src/components/volunteers/CreateUpdateVolunteer.vue';

export default defineComponent({
  name: 'VoluntariesPage',
  emits: ['update-nav-bar'],
  components: {
    CreateUpdateVolunteer
  },
  data(){
    return {
      isMounted: false,
      isLoading: false,
      congregation_code: process.env.CONGREGATION_CODE || '',
      createUpdateVolunteerDialog: false,
      createOrUpdate: false
    }
  },
  async mounted(){
    this.$emit('update-nav-bar', {});
    await this.getRolesFunc();
    await this.getCongregationsFunc();

    this.roles = this.getRolesData.getRoles;
    this.congregations = this.getCongregationsData.getCongregations;

    await this.init();
    this.isMounted = true;
  },
  setup () {
    const users: any = ref([]);
    const filter: any = ref('')
    const columns: any = [
      { id: 'names', field: 'names', label: 'Nombres', align: 'left', },
      { id: 'first_surname', field: 'first_surname', label: 'Apellido Paterno', align: 'left', },
      { id: 'second_surname', field: 'second_surname', label: 'Apellido Materno', align: 'left', },
      { id: 'email', field: 'email', label: 'Correo', align: 'left', },
      { id: 'descriptionRole', field: 'descriptionRole', label: 'Rol', align: 'left', },
      { id: 'settings', field: 'settings', label: '', align: 'right', },
    ];
    const rows: any = ref([10]);
    const menuMore: any = ref([]);
    const roles: any = ref([]);
    const volunteerData: any = ref(null);
    const congregations: any = ref(null);

    const { 
      refetch: getUsersFunc, 
      loading: getUsersLoading, 
      result: getUsersData, 
      error: getUsersError 
    } = useQuery(getUsers, { congregation_code: '' });

    const { 
      refetch: getRolesFunc, 
      loading: getRolesLoading, 
      result: getRolesData, 
      error: getRolesError 
    } = useQuery(getRoles);

    const { 
      refetch: getCongregationsFunc, 
      loading: getCongregationsLoading, 
      result: getCongregationsData, 
      error: getCongregationsError 
    } = useQuery(getCongregations);

    return { 
      users,
      roles,
      columns,
      rows,
      menuMore,
      filter,
      getUsersFunc,
      getUsersLoading,
      getUsersData,
      getUsersError,
      getRolesFunc,
      getRolesLoading,
      getRolesData,
      getRolesError,
      volunteerData,
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
        await this.getUsersFunc({ congregation_code: this.congregation_code });
        this.users = this.getUsersData.getUsers;

        this.rows = this.users.map((user: any) => {
          // console.log(profile)
          return {
            ...user,
            descriptionRole: user.role.description,
            settings: ''
          }
        });
        // console.log(this.profiles);
      }
      catch (error) {
        console.error('Error al obtener los datos:', error);
      }      
    },
    closeCreateUpdateVolunteerDialog(){
      this.createUpdateVolunteerDialog = false;
    },
    showCreateUpdateVolunteerDialog(volunteer: any, createOrUpdate: boolean){
      this.createOrUpdate = createOrUpdate;
      this.volunteerData = volunteer;
      this.createUpdateVolunteerDialog = true;
      this.menuMore = [];
    },
    async getVolunteers(){
      await this.init();
    },
  },
  watch:{
    getUsersLoading(newVal, oldVal){
      this.isLoading = this.getUsersLoading || this.getRolesLoading || this.getCongregationsLoading;
    },
    getRolesLoading(newVal, oldVal){
      this.isLoading = this.getUsersLoading || this.getRolesLoading || this.getCongregationsLoading;
    },
    getCongregationsLoading(newVal, oldVal){
      this.isLoading = this.getUsersLoading || this.getRolesLoading || this.getCongregationsLoading;
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

  .add-volunteer-class {
    font-size: 40px; 
    color: var(--q-primary);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }

  .add-volunteer-class:hover {
    color: var(--q-secondary);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  }
</style>