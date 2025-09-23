import { stat } from 'fs';
import { defineStore } from 'pinia';

export const useCongregationStore = defineStore('congregation', {
  state: () => ({
    congregation: ''
  }),

  getters: {
    getCongregation (state) {
      return state.congregation;
    },
  },

  actions: {   
    setCongregation (congregation: any) {
      this.congregation =  congregation;
    },
  }
});
