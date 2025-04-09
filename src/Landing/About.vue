<template>
    <section class="mt-8 mb-4">
        <v-container>
            <v-row>
                <v-col cols="12" md="6" offset-md="3">
                    <div class="mb-3">
                        <h2 class="text-h4 text-center">What is Material e621?</h2>
                    </div>
                    <p class="text-center">
                        Material e621 is a modern, open source web client for e621.net. It
                        is customizable, comes with a bunch of features that are not
                        available on e621.net, and makes browsing posts a delightful
                        experience.
                    </p>
                    <p class="text-center">
                        Further information can be found on the project's
                        <a class="text-primary text-decoration-none" target="_blank"
                            href="https://github.com/avoonix/material-e621/issues">
                            <v-icon color="primary" size="1em" class="mr-1">
                                mdi-open-in-new </v-icon><span class="text-decoration-underline">GitHub page</span></a>.
                    </p>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" md="6" offset-md="3">
                    <div class="mb-3">
                        <h2 class="text-h4 text-center">Looking for more?</h2>
                    </div>
                    <p class="text-center">
                        The original site can be found
                        <a class="text-primary text-decoration-none" target="_blank" :href="url.e621Url">
                            <v-icon color="primary" size="1em" class="mr-1">
                                mdi-open-in-new </v-icon><span class="text-decoration-underline">here</span></a>. While
                        Material e621
                        provides an enhanced interface for browsing
                        posts, e621.net has more features that go beyond that, such as
                        image uploads, comments, and a forum (among others). If you need
                        any of those, use e621.net directly as most of these features will
                        never be available in Material e621.
                    </p>
                </v-col>
            </v-row>
        </v-container>
    </section>

</template>

<script setup lang="ts">
import { useUrlStore } from '@/services';

const url = useUrlStore();
</script>