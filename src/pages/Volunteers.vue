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
        <q-icon name="add_circle"/>
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
                      <div class="menu-profile">
                        <q-icon name="visibility" size="18px" style="margin-right: 10px;"/>Voluntario
                      </div>
                      <div class="menu-profile">
                        <q-icon name="edit" size="18px" style="margin-right: 10px;"/>Editar
                      </div>
                      <div class="menu-profile">
                        <q-icon name="manage_accounts" size="18px" style="margin-right: 10px;"/>Roles
                      </div>
                      <div 
                        class="menu-profile" 
                      >
                        <q-icon name="delete" size="18px" style="margin-right: 10px;"/>Eliminar
                      </div>
                    </div>
                  </q-banner>
                </q-popup-proxy>
              </q-icon>
            </div>
            <div v-else>
              <div v-if="column.id == 'mobilePhone'" class="row justify-start" style="width: 150px;">
                <div>
                  {{ props.row[column.id] }}
                </div>
                <a
                  :href="`tel:+${props.row[column.id]}`"
                  target="_blank"
                  rel="noopener"
                  style="margin-left: 5px;"
                >
                  <q-icon name="phone_iphone" size="20px" class="text-primary cursor-pointer" />
                </a>

                <a
                  :href="`https://wa.me/${props.row[column.id]}`"
                  target="_blank"
                  rel="noopener"
                  style="margin-left: 5px;"
                >
                  <q-icon name="fa-brands fa-whatsapp" size="20px" class="text-primary cursor-pointer" />
                </a>
              </div>
              <div v-else>
                {{ props.row[column.id] }}
              </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div> 
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getUsers } from 'src/api/queries/getUsers';
import { useQuery } from '@vue/apollo-composable';

export default defineComponent({
  name: 'VoluntariesPage',
  emits: ['update-nav-bar'],
  data(){
    return {
      isMounted: false,
      isLoading: false,
      congregation_code: process.env.CONGREGATION_CODE || ''
    }
  },
  async mounted(){
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

    const volunteerData: any = ref(null);

    const { refetch: getUsersFunc, loading: getUsersLoading, result: getUsersData, error: getUsersError } = useQuery(getUsers, { congregation_code: '' });

    return { 
      users,
      columns,
      rows,
      menuMore,
      filter,
      volunteerData,
      getUsersFunc,
      getUsersLoading,
      getUsersData,
      getUsersError
    };
  },
  methods:{
    async init(){
      this.isLoading = true;
      this.$emit('update-nav-bar', {});
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
      this.isLoading = false;
    },
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