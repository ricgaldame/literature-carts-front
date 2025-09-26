<template>
  <q-layout view="hHh lpR fff">
    <q-header elevated ref="headerRef">
      <div v-if="!$q.screen.lt.sm" class="row justify-between items-center nav-bar" style="width: 100%;">
        <div class="row justify-start" style="width: 20%;">
          <div style="font-size: 16px; padding-left: 10px">
            <q-img
              class="icon"
              src="/static/carrito.png"
            />
          </div>
        </div>
        <div 
          class="row justify-center" 
          style="width: 60%; overflow-x: hidden; -webkit-overflow-scrolling: touch;"
        >
          <div 
            style="display: flex; flex-wrap: nowrap; position: relative; overflow-x: hidden;" 
            ref="scrollContainerWrapper"
          >
            <q-btn
              v-if="showLeftButton"
              icon="chevron_left"
              flat
              dense
              class="scroll-button left"
              @click="scrollLeft"
              style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%);"
            />
            <div
              style="display: flex; flex-wrap: nowrap; position: relative; overflow-x: hidden;" 
              ref="scrollContainer"
            >
              <NavBar
                v-for="item in navBar.slice(0, -1)"
                :key="item.title"
                v-bind="item"
                :title="item.title"
                :visible="!$q.screen.lt.sm && item.visible"
                :isSm="$q.screen.lt.sm"
                :page="page"
              />
            </div>
            <q-btn
              v-if="showRightButton"
              icon="chevron_right"
              flat
              dense
              class="scroll-button right"
              @click="scrollRight"
              style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);"
            />
          </div>
        </div>
        <div :class="`row justify-${$q.screen.lt.md ? 'start' : 'end'} nav-container`" style="width: 20%;">

            <NavBar
              v-for="item in [navBar[navBar.length - 1]]"
              :key="item.title"
              v-bind="item"
              :title="item.title"
              :visible="!$q.screen.lt.sm && item.visible"
              :isSm="$q.screen.lt.sm"
              :page="page"
            />

        </div>
      </div>
      <div  v-else class="row justify-between items-center" style="width: 100%;">
        <div class="row justify-start" style="width: 49%; font-size: 16px; padding-left: 10px; padding-top: 5px; padding-bottom: 5px;">
          <q-img
            class="icon"
            src="/static/carrito.jpg"
          />
        </div>
        <div class="row justify-end" style="width: 49%; padding-right: 10px; padding-top: 5px; padding-bottom: 5px;">
          <q-btn
            v-if="$q.screen.lt.sm"
            flat
            dense
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
            class="nav-bar"
          />
        </div>
      </div>
    </q-header>

    <q-drawer
      v-if="$q.screen.lt.sm"
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      style="width: 100%"
    >
      <q-list style=" margin-top: 10px;">
        <div style="font-size: 16px; padding-left: 10px; margin-bottom: 10px;">
          <q-img
            class="icon"
            src="/static/carrito.png"
          />
        </div>
        <div
          v-for="link in navBar"
          :key="link.title"
        >
          <NavBar
            v-if="$q.screen.lt.sm && link.visible"
            v-bind="link"
            :title="link.title"
            :visible="$q.screen.lt.sm && link.visible"
            :isSm="$q.screen.lt.sm"
            :page="page"
          />
        </div>
      </q-list>
    </q-drawer>

    <div 
      v-if="isMounted" 
      :class="`${!$q.screen.lt.sm ? 'content-page' : '' }`"
      :style="{ height: !$q.screen.lt.sm  ? `${maxHeight}px` : '' }" 
    >
      <q-page-container>
        <router-view @update-nav-bar="updateNavBar"/>
      </q-page-container>
    </div>
    

    <q-footer style="background-color: white;" ref="footerRef">
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
import NavBar from 'components/NavBar.vue';
import { useIdentityStore } from 'src/stores/identityStore';
import { useCongregationStore } from 'src/stores/congregationStore';
import { storeToRefs } from 'pinia' 
import { findIdx } from 'src/tools/usefuls';
import { useRoute } from 'vue-router';

let navList = [
  {
    name: 'assignments',
    title: 'Asignaciones',
    icon: 'assignment',
    type: 'link',
    link: 'assignments',
    navBar: true,
    separator: true,
    visible: true
  },
  {
    name: 'week-template',
    title: 'Plantilla Semanal',
    icon: 'edit',
    type: 'link',
    link: 'week-template',
    navBar: true,
    separator: true,
    visible: true
  },
  {
    name: 'volunteers',
    title: 'Voluntarios',
    icon: 'wc',
    type: 'link',
    link: 'volunteers',
    navBar: true,
    separator: true,
    visible: true
  },
  {
    name: 'locations',
    title: 'Puntos',
    icon: 'location_on',
    type: 'link',
    link: 'locations',
    navBar: true,
    separator: true,
    visible: true
  },
  {
    name: 'congregations',
    title: 'Congregaciones',
    icon: 'groups',
    type: 'link',
    link: 'congregations',
    navBar: true,
    separator: true,
    visible: true
  },
  {
    name: 'roles',
    title: 'Roles',
    icon: 'manage_accounts',
    type: 'link',
    link: 'roles',
    navBar: true,
    separator: true,
    visible: true
  },
  {
    name: 'account',
    title: '',
    icon: 'person',
    type: 'menu',
    avatar: '',
    menu: [
      {
        name: 'CUENTA',
        items: [
          {
            name: 'name',
            isButton: false,
            // link: '#'
          },
          {
            name: 'CERRAR SESIÓN',
            isButton: true,
            clickFunction: 'closeSession',
            isSolidButton: false
          },
        ]
      }
    ],
    navBar: true,
    separator: false,
    visible: true
  },
];

export default defineComponent({
  name: 'InSiteLayout',
  components: {
    NavBar
  },
  data(){
    return {
      navBar: navList,
      page: 'assignments',
      isMounted: false,
      showLeftButton: false,
      showRightButton: false,
      isSm: this.$q.screen.lt.sm,
      isAdmin: false,
      isSupervisor: false,
      congregation: ''
    }
  },
  setup () {
    const store = useIdentityStore();
    const { getAttributes } = storeToRefs(store);

    const leftDrawerOpen = ref(false)
    const year =  new Date().toISOString().split('-')[0];

    const route = useRoute();
    const maxHeight: any = ref(null);

    const scrollContainer = ref();
    const scrollContainerWrapper = ref();

    const avatar: any = ref(null);

    const congregationStore = useCongregationStore();
	  const { getCongregation } = storeToRefs(congregationStore);

    const role: any = ref(null);

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      getAttributes,
      year,
      route,
      maxHeight,
      scrollContainer,
      scrollContainerWrapper,
      avatar,
      getCongregation,
      role
    }
  },
  async mounted() {
    if(this.getCongregation) this.congregation = this.getCongregation;
    if(this.getAttributes){
      // console.log('getAttributes', this.getAttributes);
      const attributes: any = this.getAttributes;
      this.avatar = attributes?.user_metadata?.avatar_url ? attributes?.user_metadata?.avatar_url : null;
      this.role = attributes.role;
      this.isAdmin = this.role == 'admin';
      this.isSupervisor = this.role == 'supervisor';
      // console.log(attributes)
      // console.log(this.avatar)
    }
    
    this.updateScreenHeight();
    window.addEventListener('resize', this.updateScreenHeight);

    this.checkButtonsVisibility(); // Verifica al montar el componente
    window.addEventListener('resize', this.checkButtonsVisibility);

    this.loadMenu();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenHeight);
    window.removeEventListener('resize', this.checkButtonsVisibility);
  },
  methods: {
    loadMenu() {
      this.page = this.route.path.replace('/', '');
      // console.log('page', this.page);
      if(this.getAttributes){
        const attributes: any = this.getAttributes;
        let index1 = findIdx(this.navBar, 'account');
        this.navBar[index1].title = `${attributes.names} ${attributes.firstSurname}`;
        this.navBar[index1].avatar = this.avatar;
        let index2 = findIdx(this.navBar[index1].menu , 'CUENTA');
        if(this.navBar[index1]?.menu) this.navBar[index1].menu[index2].items[0].name = attributes.email;

        let index3 = findIdx(this.navBar, 'week-template');
        this.navBar[index3].visible = this.isAdmin || this.isSupervisor;
        let index4 = findIdx(this.navBar, 'volunteers');
        this.navBar[index4].visible = this.isAdmin || this.isSupervisor;
        let index5 = findIdx(this.navBar, 'locations');
        this.navBar[index5].visible = this.isAdmin || this.isSupervisor;
        let index6 = findIdx(this.navBar, 'congregations');
        this.navBar[index6].visible = this.isAdmin;
        let index7 = findIdx(this.navBar, 'roles');
        this.navBar[index7].visible = this.isAdmin;
      }
      else {
        this.$router.replace('/login');
      }
      this.isMounted = true;
    },
    async hRef(link: any) {
      this.$router.replace('/' + link);
    },
    updateNavBar(event: any) {
      this.loadMenu();
    },
    updateScreenHeight() {
      this.maxHeight = window.innerHeight;
    },
    checkButtonsVisibility() {
      if(!this.$q.screen.lt.sm){
        const container = this.scrollContainer; //<--
        const wrapper = this.scrollContainerWrapper;
        // Verifica si el contenido es más grande que el contenedor visible
        this.showLeftButton = container.scrollLeft > 0;
        this.showRightButton = container.scrollWidth > wrapper.offsetWidth;
      }
    },
    scrollLeft() {
      if(!this.$q.screen.lt.sm){
        const container = this.scrollContainer;
        container.scrollLeft -= 100; // Desplazar 100px a la izquierda
        this.checkButtonsVisibility();
      }
    },
    scrollRight() {
      if(!this.$q.screen.lt.sm){
        const container = this.scrollContainer;
        container.scrollLeft += 100; // Desplazar 100px a la derecha
        this.checkButtonsVisibility();
      }
    }
  },
  watch: {
    isSm(){
      if(this.isMounted){
        console.log(this.isSm)
      }
    }
  }
});
</script>

<style scoped lang="scss">
  .nav-bar {
    background-color: $primary;
    color: white;
  }

  .side-bar {
    background-color: white;
    color: $navbar-text;
  }

  .icon {
    width: 35px;
    height: 35px;
    //margin-top: 10px;
    //margin-bottom: 10px;
    //margin-left: 10px;
    margin: 0px;
    padding: 0px;
    background-color: transparent;
    border-radius: 50%;
    border: 1px solid $primary;
    overflow: hidden; 
	  cursor: pointer;
  }

  .footer {
    background-color: white;
    color: $navbar-text;
    font-size: 12px;
    margin-top: 5px;
    padding: 10px;
  }

  .content-page {
    background-color: white;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    max-width: 1400px;
    padding: 0;
    position: relative;
    flex: 1;
    overflow-y: auto
  }

  .scroll-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(0, 0, 0, 0.5);
    color: white;
  }

  .left {
    left: 10px;
  }

  .right {
    right: 10px;
  }

  .nav-container {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

</style>