/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public origin of the deployed site, e.g. https://maelle.example.com */
  readonly VITE_SITE_URL?: string;
}
