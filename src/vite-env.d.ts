/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TOKEN_URL?: string;
  readonly VITE_CLIENT_ID?: string;
  readonly VITE_CLIENT_SECRET?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GOOGLE_SEARCH_API_KEY?: string;
  readonly VITE_GOOGLE_SEARCH_ENGINE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
