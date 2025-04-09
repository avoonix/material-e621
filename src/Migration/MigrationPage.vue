<template>
  <v-app>
    <section class="v-toolbar elevation-0 bg-primary d-flex" :style="{ height: '75vh' }">
      <div class="w-100 d-flex flex-column align-center justify-center fill-height">
        <AppLogo type="face" size="200" />
        <h1 class="mb-2 text-h1 text-center">Material e621</h1>
        <div class="text-h4 mb-3">We are moving!</div>
        <v-btn size="x-large" color="accent" variant="flat" :href="domain">
          <v-icon class="mr-2">mdi-open-in-new</v-icon>
          Go to new instance
        </v-btn>
        <div class="mt-8 text-h5 w-50 text-center">Don't forget to download your settings if you have used Material e621
          in the past. You can
          import them in the new instance.</div>
        <v-btn variant="flat" color="accent" class="mb-3 mt-1" @click="download">
          <v-icon class="mr-2">mdi-download</v-icon>
          Download settings
        </v-btn>
      </div>
    </section>
    <About />
    <Footer />
  </v-app>
</template>

<script setup lang="ts">
import AppLogo from '@/App/AppLogo.vue';
import About from '@/Landing/About.vue';
import Footer from '@/Landing/Footer.vue';
import { usePersistanceService } from '@/services';
import { downloadjs } from '@/Settings/download';

const env = import.meta.env;
const domain = env.VITE_MIGRATE_TO_DOMAIN;

const persistanceService = usePersistanceService();
const download = async () => {
  const file = await persistanceService.stateToFile();
  downloadjs(file, file.name, file.type);
};
</script>
