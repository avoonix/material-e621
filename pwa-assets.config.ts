import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config'

// TODO: run the generator and add the resulting files to the manifest and html

export default defineConfig({
    preset: {
        ...preset,
        transparent: {
            ...preset.transparent,
            favicons: [
                ...preset.transparent.favicons!,
                [64, "favicon.png"]
            ]
        }
    },
    images: [
        'public/favicon.svg',
    ],
    logLevel: 'warn',
})
