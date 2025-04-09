import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

// TODO: run the generator and add the resulting files to the manifest and html

export default defineConfig({
    preset,
    images: [
        'public/favicon.svg',
    ],
    logLevel: 'warn',
})
