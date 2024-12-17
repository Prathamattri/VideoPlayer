/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VideoURI: string
  readonly VITE_SpriteURI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
