<template>
  <q-item
    v-if="visible && navBar"
    :clickable="!isSm"
    @click="click(type, link)"
    :class="`item ${isSm ? '' : 'items-center'}`"
    :style="{
      backgroundColor: page == link ? (!isSm ? 'var(--q-secondary)' : 'var(--q-primary)') : '',
    }"
  >
    <!-- <div
      v-if="icon && !isSm && !isAccount"
      avatar
      class="item-section"
    >
      <q-icon :name="icon" style="font-size: 20px;"/>
    </div> -->

    <div
      v-if="icon && !isSm"
      avatar
      class="item-section"
    >
      <q-icon v-if="name != 'account'" :name="icon" style="font-size: 20px;"/>
      <div v-else>
        <q-avatar v-if="avatar" size="25px">
          <q-img :src="avatar" alt="Foto de perfil" />
        </q-avatar>
        <q-icon v-else :name="icon" style="font-size: 20px;"/>
      </div>
    </div>

    <div 
      class="item-section"
    >
      <div>
        <span v-if="!isSm">{{ title }}</span> 
        <span 
          v-if="isMenu && !isSm" 
          style="margin-left: 5px"
        >
          <q-icon v-if="!isAccount" :name="isMenu && expand ? 'keyboard_arrow_down' : 'keyboard_arrow_up'"/>
        </span>
      </div>
    </div>

    <!-- <div
      v-if="icon && !isSm && isAccount"
      avatar
      class="item-section"
      style="margin-right: 5px;"
    >
      <q-icon :name="icon" style="font-size: 20px;"/>
    </div> -->

    <q-popup-proxy v-if="isMenu && !isSm" :offset="[10, 10]" @hide="hideShowAccount()" @show="hideShowAccount()">
      <q-banner class="menu-nav-bar">
        <q-list v-for="item in menu" :key="item.name">
          <q-item v-ripple :active="true">
            <q-item-section class="item-nav-bar item-section">{{ item.name }}</q-item-section>
          </q-item>
          <q-item v-for="items in item.items" :key="items.name" v-ripple :active="true">
            <q-item-section 
              class="items-nav-bar item-section" 
              v-if="!items.isButton" 
              @click="items?.link ? (items?.type == 'whatsapp' || items?.type == 'faq' ? click(items?.type, items?.link) : hRef(items.link)) : click('', '')"
              :style="{ cursor: items?.link ? 'pointer' : '' }"
            >
              <div class="row justify-start">
                <q-icon v-if="items?.icon" size="20px" :name="items?.icon" style="margin-right: 10px;"/>
                <div :style="{ fontSize: items?.icon ? '15px' : '' }"> {{ items.name }} </div>
              </div>
            </q-item-section>
            <q-item-section class="item-section" v-if="items.isButton">
              <q-btn 
                :class="items.isSolidButton ? 'btn-nav-bar-solid' : 'btn-nav-bar-transparent'" 
                @click="buttonClick(items.clickFunction)"
              >
                {{ items.name }}
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-banner>
    </q-popup-proxy>
    <div v-if="!isMenu && isSm" @click="click(type, link)">
      <q-item 
        v-ripple :active="true"
        :style="{
          color:  page == link ? 'white' : ''
        }"
      >
        <q-item-section class="item-section" avatar>
          <q-icon :name="icon" />
        </q-item-section>
        <q-item-section 
          class="item-nav-bar item-section"
          :style="{
            color: page == link ? 'white' : ''
          }"
        >
          {{ title.toUpperCase() }}
        </q-item-section>
      </q-item>
    </div>
    <div v-if="isMenu && isSm" style="width: 100%;">
      <q-list v-for="item in menu" :key="item.name">
        <q-item v-ripple :active="true">
          <q-item-section class="item-section" avatar>
            <!-- <q-icon :name="icon" /> -->
            <q-icon v-if="name != 'account'" :name="icon"/>
            <div v-else>
              <q-avatar v-if="avatar" size="25px">
                <q-img :src="avatar" alt="Foto de perfil" />
              </q-avatar>
              <q-icon v-else size="25px" :name="icon"/>
            </div>
          </q-item-section>
          <q-item-section class="item-nav-bar item-section">{{ item.name }}</q-item-section>
        </q-item>
        <q-item v-for="items in item.items" :key="items.name" v-ripple :active="true">
          <q-item-section 
            class="items-nav-bar item-section" 
            v-if="!items.isButton" 
            @click="items?.link ? (items?.type == 'whatsapp' || items?.type == 'faq' ? click(items?.type, items?.link) : hRef(items.link)) : click('', '')"
            :style="{ cursor: items?.link ? 'pointer' : '' }"
          >
            <div class="row justify-start">
              <q-icon v-if="items?.icon" size="25px" :name="items?.icon" style="margin-right: 10px;"/>
              <div :style="{ fontSize: items?.icon ? '16px' : '' }"> {{ items.name }} </div>
            </div>
          </q-item-section>
          <q-item-section class="item-section" v-if="items.isButton">
            <q-btn 
              :class="items.isSolidButton ? 'btn-nav-bar-solid' : 'btn-nav-bar-transparent'" 
              @click="buttonClick(items.clickFunction)"
            >
              {{ items.name }}
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-item>
  <q-separator v-if="isSm && separator" style="margin-top: 5px"/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { Menu } from './models';
import { findIdx } from 'src/tools/usefuls';
import { userAuth } from '../identity/userAuth';
import { statSync } from 'fs';

const { signOut } = userAuth();

export default defineComponent({
  name: 'NavBar',
  props: {
    name: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    link: {
      type: String,
      default: '#'
    },

    icon: {
      type: String,
      default: ''
    },

    visible: {
      type: Boolean,
      required: true
    },

    isSm: {
      type: Boolean,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    menu: {
      type: Array as PropType<Menu[]>
    },

    navBar: {
      type: Boolean,
      required: true
    },

    separator: {
      type: Boolean,
      required: true
    },

    page: {
      type: String,
      default: 'calendar'
    },

    avatar: {
      type: String,
      required: false,
      default: null
    },
  },
  data(){
    return {
      expand: false,
      isAccount: this.name == 'account',
      isMenu: this.type == 'menu',
    }
  },
  setup() {
    return {
      findIdx, 
      signOut,
    }
  },
  methods: {
    click(type: any, link: any){
      // console.log(type, link)
      if(type == 'link') this.$router.replace('/' + link);
    },
    hideShowAccount () {
      this.expand = !this.expand;
    },
    hRef(link: any) {
      this.$router.replace('/' + link);
    },
    async buttonClick(fun: any){
      if(fun == 'closeSession') await signOut();
    }
  }
});
</script>

<style scoped lang="scss">
  .menu-nav-bar {
    background-color: white;
    color: $navbar-text;
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
    width: 300px;
  }

  .item-nav-bar {
    color: $primary;
  }

  .items-nav-bar {
    color: $navbar-text;
  }

  .items-nav-bar:hover {
    color: $primary;
  }

  .btn-nav-bar-solid {
    font-size: 15px;
  }

  .btn-nav-bar-transparent {
    background-color: transparent;
    border: 1px solid $primary;
    color: $primary;
    font-size: 15px;
  }

  .btn-nav-bar-solid::before {
    box-shadow: none;
  }

  .btn-nav-bar-transparent::before {
    box-shadow: none;
  }

  .item {
    padding: 5px 10px;
  }

  .item-section {
    padding: 0px 5px 0px 0px;
  }

</style>
