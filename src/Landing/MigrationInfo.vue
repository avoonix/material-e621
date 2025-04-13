<template>
    <section v-if="oldOrigin" class="ma-1">
        <v-row justify="center" align="center">
            <v-col>
                <v-alert variant="tonal" type="info" :title="`New Primary Instance is ${currentHostname}`"
                    text="You can still visit the old instance to download your settings and import them here.">
                    <div>
                        <v-btn color="info" block variant="outlined" :href="oldOrigin" target="_blank">Go to old
                            instance</v-btn>
                    </div>
                </v-alert>
            </v-col>
        </v-row>
    </section>
</template>

<script setup lang="ts">
const env = import.meta.env;
const oldOrigin = env.VITE_MIGRATE_FROM_DOMAIN;
const currentHostname = window.location.hostname;
</script>