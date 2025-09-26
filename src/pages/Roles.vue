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
        Roles
      </div>
      <div class="add-role-class">
        <q-icon name="add_circle" @click="showCreateUpdateRoleDialog(null, true)"/>
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
                      <div class="menu-profile" @click="showCreateUpdateRoleDialog(props.row, false)">
                        <q-icon name="visibility" size="18px" style="margin-right: 10px;"/>Rol
                      </div>
                      <div class="menu-profile"  @click="showCreateUpdateRoleDialog(props.row, true)">
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
  <q-dialog v-model="createUpdateRoleDialog" persistent>
    <CreateUpdateRole 
      :roleDataEntry="roleData"
      :roles="roles"
      :createOrUpdate="createOrUpdate"
      @close-create-update-role-dialog="closeCreateUpdateRoleDialog"
      @get-roles="getRoles"
    />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getRoles } from 'src/api/queries/getRoles';
import { useQuery } from '@vue/apollo-composable';
import CreateUpdateRole from 'src/components/roles/CreateUpdateRole.vue';

export default defineComponent({
  name: 'RolesPage',
  emits: ['update-nav-bar'],
  components: {
    CreateUpdateRole
  },
  data(){
    return {
      isMounted: false,
      isLoading: false,
      congregation_code: process.env.CONGREGATION_CODE || '',
      createUpdateRoleDialog: false,
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
      { id: 'code', field: 'code', label: 'Código', align: 'left', },
      { id: 'description', field: 'description', label: 'Descripción', align: 'left', },
      { id: 'settings', field: 'settings', label: '', align: 'right', },
    ];
    const rows: any = ref([10]);
    const menuMore: any = ref([]);
    const roleData: any = ref(null);
    const roles: any = ref(null);

    const { 
      refetch: getRolesFunc, 
      loading: getRolesLoading, 
      result: getRolesData, 
      error: getRolesError 
    } = useQuery(getRoles);

    return { 
      columns,
      rows,
      menuMore,
      filter,
      roleData,
      roles,
      getRolesFunc,
      getRolesLoading,
      getRolesData,
      getRolesError
    };
  },
  methods:{
    async init(){
      try {
        await this.getRolesFunc();

        this.roles = this.getRolesData.getRoles;

        this.rows = this.roles.map((role: any) => {
          // console.log(profile)
          return {
            ...role,
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
    closeCreateUpdateRoleDialog(){
      this.createUpdateRoleDialog = false;
    },
    showCreateUpdateRoleDialog(role: any, createOrUpdate: boolean){
      this.createOrUpdate = createOrUpdate;
      this.roleData = role;
      this.createUpdateRoleDialog = true;
      this.menuMore = [];
    },
    async getRoles(){
      await this.init();
    },
  },
  watch:{
    getRolesLoading(newVal, oldVal){
      this.isLoading = this.getRolesLoading;
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

  .add-role-class {
    font-size: 40px; 
    color: var(--q-primary);
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  }

  .add-role-class:hover {
    color: var(--q-secondary);
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  }
</style>