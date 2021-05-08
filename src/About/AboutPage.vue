<template>
  <v-container fill-height>
    <v-layout align-center>
      <v-flex>
        <v-flex md6 xs12 offset-md3 class="my-2">
          <v-card>
            <v-card-title>
              {{ $appName }} - v{{ version.version }}-{{ version.branch }}-{{
                version.commitShort
              }}
            </v-card-title>
            <v-card-text>
              {{ $appName }} is a customizable e621 client.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <external-link
                component="v-btn"
                color="primary"
                flat
                href="https://e621.net/forum/show/261165"
              >
                visit e621 forum post
              </external-link>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex md6 xs12 offset-md3>
          <v-card>
            <v-card-title>Third party libraries</v-card-title>
            <v-card-text>
              <div class="body-1 mb-2">
                Special thanks to these libraries and their maintainers.
              </div>
              <ul v-if="libraries">
                <li v-for="library in libraries" :key="library">
                  {{ library }} -
                  <external-link
                    :href="`https://www.npmjs.com/package/${library}`"
                    >npm</external-link
                  >&nbsp;-
                  <external-link :href="`https://yarn.pm/${library}`"
                    >yarn</external-link
                  >
                </li>
              </ul>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- <v-flex md6 xs12 offset-md3 class="my-2">
          <v-card>
            <v-card-title>Legend</v-card-title>
            <v-card-text>
              <v-layout row wrap="">
                <v-flex sm6 xs12>
                  <ul class="">
                    <li class="green--text">Feature added</li>
                    <li class="orange--text">Feature changed</li>
                    <li class="red--text">Feature removed</li>
                    <li class="blue--text">Experimental feature</li>
                  </ul>
                </v-flex>
                <v-flex sm6 xs12>
                  <ul class="">
                    <li class="yellow--text">Summer</li>
                    <li class="brown--text">Fall</li>
                    <li class="light-blue--text text--lighten-3">Winter</li>
                    <li class="light-green--text">Spring</li>
                  </ul>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex> -->
        <v-timeline style="width: 100%;" :dense="$vuetify.breakpoint.smAndDown">
          <v-timeline-item
            v-for="(item, index) in timeline"
            :key="index"
            fill-dot
            :small="!item.large"
            :large="item.large"
            :color="item.color || 'primary'"
          >
            <v-icon slot="icon" v-if="item.large">mdi-calendar</v-icon>
            <span slot="opposite">{{ item.opposite }}</span>
            <changelog-item :item="item" />
          </v-timeline-item>
        </v-timeline>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import ChangelogItem from "./ChangelogItem.vue";
import changelog from "../config/changelog";
import packageJson from "../../package";

export default {
  metaInfo: {
    title: "About",
  },
  components: {
    ChangelogItem,
  },
  data() {
    return {
      libraries: [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {}),
      ],
      timeline: [...changelog].reverse(),
      version: {
        version: process.env.VUE_APP_VERSION,
        commitCount: process.env.VUE_APP_GIT_TOTAL_COMMITS,
        commitShort: process.env.VUE_APP_GIT_COMMIT_SHORT_NAME,
        branch: process.env.VUE_APP_GIT_BRANCH_NAME,
      },
    };
  },
  name: "About",
};
</script>
