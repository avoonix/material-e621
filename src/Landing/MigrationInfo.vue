<template>
    <section v-if="oldOrigin && !appearance.hideMigrationInfo" class="ma-1">
        <v-row justify="center" align="center">
            <v-col>
                <v-alert variant="tonal" type="info" :title="`New Primary Instance is ${currentHostname}`"
                    text="You can still visit the old instance to download your settings and import them here. You can also try to automatically migrate your settings (this will overwrite your current settings).">
                    <template #default>
                        <div>
                            <v-btn @click="neverShowAgain" class="mb-2" block color="info" variant="outlined">
                                Never show again
                            </v-btn>
                            <v-btn block class="mb-2" color="info" variant="outlined" :href="oldOrigin"
                                target="_blank">Go to old instance</v-btn>
                            <v-btn block color="info" variant="outlined" @click="attemptAutoMigration"
                                :loading="loading">Automatic
                                Migration</v-btn>
                        </div>
                    </template>
                </v-alert>
            </v-col>
        </v-row>
    </section>
</template>

<script setup lang="ts">
import { useMigrator } from '@/misc/util/migration';
import { ref } from 'vue';
import { useSnackbarStore, useAppearanceStore } from '@/services';

const env = import.meta.env;
const oldOrigin = env.VITE_MIGRATE_FROM_DOMAIN;
const currentHostname = window.location.hostname;
const snackbar = useSnackbarStore();
const appearance = useAppearanceStore();

const migrator = useMigrator();
const loading = ref(false);

const neverShowAgain = () => appearance.hideMigrationInfo = true;

const attemptAutoMigration = () => {
    loading.value = true;
    migrator.requestMigrationDataViaIframe(oldOrigin, () => {
        snackbar.addMessage("Success");
        loading.value = false;
        neverShowAgain();
    }, () => {
        snackbar.addMessage("Failed. Please migrate manually.");
        loading.value = false;
    })
};
</script>