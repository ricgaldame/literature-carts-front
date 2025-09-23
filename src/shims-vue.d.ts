/* eslint-disable */

/// <reference types="vite/client" />

// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Añade las declaraciones para las propiedades globales
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $db: Firestore;
    $auth: Auth;
  }
}