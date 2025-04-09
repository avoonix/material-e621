/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GIT_COMMIT_INFO: string
    readonly VITE_GIT_BRANCH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
