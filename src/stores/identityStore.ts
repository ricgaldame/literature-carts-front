import { stat } from 'fs';
import { defineStore } from 'pinia';
import { extend, LocalStorage } from 'quasar';
import { supabase } from 'src/supabase.config';

export const useIdentityStore = defineStore('identity', {
  state: () => ({
    user: {
      attributes: null,
      token: '',
      refreshToken: (LocalStorage.getItem('refreshToken') || '') as string,
    },
  }),

  getters: {
    getToken (state) {
      return state.user.token;
    },
    getAttributes (state) {
      return state.user.attributes;
    },
    getRefreshToken (state) {
      return state.user.refreshToken;
    }
  },

  actions: {   
    setAttributes (attributes: any) {
      this.user.attributes =  attributes;
    },
    setToken (token: string) {
      this.user.token =  token;
    },
    setRefreshToken (refreshToken: string) {
      LocalStorage.set('refreshToken', refreshToken);
      this.user.refreshToken =  refreshToken;
    },
    async signOutListener() {
      supabase.auth.onAuthStateChange((event, session) => {
        // console.log('Auth event:', event);
        if (event === 'SIGNED_OUT') {
          // console.log('Usuario cerró sesión');
          localStorage.removeItem('refreshToken');
        }
      });
    }
  }
});
