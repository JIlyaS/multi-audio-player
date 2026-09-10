/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_API_URI: string;
  readonly VITE_APP_PORT: string;
  readonly VITE_APP_HAWK_TOKEN: string;
  readonly VITE_APP_EXTERNAL_COPY_URL: string;
  readonly VITE_APP_STAND: "local" | "staging" | "production";
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
