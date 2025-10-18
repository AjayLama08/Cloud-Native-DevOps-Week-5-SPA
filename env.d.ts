/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REVIEWS_SERVICE?: string;
  readonly VITE_REVIEWS_BASE_URL?: string;
  readonly VITE_USE_SEED_DATA?: string;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent;
  export default component;
}
