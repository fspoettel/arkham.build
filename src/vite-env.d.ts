/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_URL: string;
  readonly VITE_CARD_IMAGE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
