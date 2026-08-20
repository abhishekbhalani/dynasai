/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITEKEY?: string;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

interface Window {
  turnstile?: {
    render: (
      el: HTMLElement,
      opts: { sitekey: string; action?: string; theme?: string; callback?: (token: string) => void },
    ) => string;
    reset: (id?: string) => void;
  };
}
