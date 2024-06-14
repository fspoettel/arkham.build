/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_PAGE_NAME: string;
  readonly VITE_API_URL: string;
  readonly VITE_CARD_IMAGE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
